package org.zap.framework.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.CharEncoding;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.util.Assert;
import org.springframework.web.filter.GenericFilterBean;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.security.constants.SecurityConstants;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Created by Shin on 2016/1/19.
 */
public class EnhanceConcurrentSessionFilter extends GenericFilterBean {
    //~ Instance fields ================================================================================================

    ObjectMapper mapper = new ObjectMapper();

    private SessionRegistry sessionRegistry;
    private String expiredUrl;
    private LogoutHandler[] handlers = new LogoutHandler[]{new SecurityContextLogoutHandler()};
    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    //~ Methods ========================================================================================================


    /**
     * @deprecated Use constructor which injects the <tt>SessionRegistry</tt>.
     */
    public EnhanceConcurrentSessionFilter() {
    }

    public EnhanceConcurrentSessionFilter(SessionRegistry sessionRegistry) {
        this(sessionRegistry, null);
    }

    public EnhanceConcurrentSessionFilter(SessionRegistry sessionRegistry, String expiredUrl) {
        this.sessionRegistry = sessionRegistry;
        this.expiredUrl = expiredUrl;
    }

    @Override
    public void afterPropertiesSet() {
        Assert.notNull(sessionRegistry, "SessionRegistry required");
        Assert.isTrue(expiredUrl == null || UrlUtils.isValidRedirectUrl(expiredUrl),
                expiredUrl + " isn't a valid redirect URL");
    }

    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        HttpSession session = request.getSession(false);

        if (session != null) {
            SessionInformation info = sessionRegistry.getSessionInformation(session.getId());

            if (info != null) {
                if (info.isExpired()) {
                    // Expired - abort processing
                    doLogout(request, response);

                    //判断是否AJAX提交
                    if (SecurityUtils.isAjax(request)) {

                        response.setContentType("application/json");
                        response.setCharacterEncoding(CharEncoding.UTF_8);
                        response.getWriter().print(mapper
                                .writeValueAsString(new PageResult(true, SecurityConstants.SC_MULTIPLE_SESSION, "用户会话失效,请重新登录", null)));
                        response.flushBuffer();
                    } else {

                        String targetUrl = determineExpiredUrl(request, info);

                        if (targetUrl != null) {
                            redirectStrategy.sendRedirect(request, response, targetUrl);

                            return;
                        } else {
                            response.getWriter().print("This session has been expired (possibly due to multiple concurrent " +
                                    "logins being attempted as the same user).");
                            response.flushBuffer();
                        }
                    }

                    return;
                } else {
                    // Non-expired - update last request date/time
                    sessionRegistry.refreshLastRequest(info.getSessionId());
                }
            }
        }

        chain.doFilter(request, response);
    }

    protected String determineExpiredUrl(HttpServletRequest request, SessionInformation info) {
        return expiredUrl;
    }

    private void doLogout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        for (LogoutHandler handler : handlers) {
            handler.logout(request, response, auth);
        }
    }

    public void setLogoutHandlers(LogoutHandler[] handlers) {
        Assert.notNull(handlers);
        this.handlers = handlers;
    }

    public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }
}
