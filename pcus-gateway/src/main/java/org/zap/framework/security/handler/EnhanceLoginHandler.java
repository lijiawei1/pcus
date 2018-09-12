package org.zap.framework.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.StringUtils;
import org.zap.framework.security.entity.PageResult;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Shin on 2016/5/26.
 */
public class EnhanceLoginHandler extends SimpleUrlAuthenticationSuccessHandler {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    protected RequestCache requestCache = new HttpSessionRequestCache();

    //@Autowired
    //UserService userService;

    @Autowired
    ObjectMapper mapper = SecurityUtils.getMapper();

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response, Authentication authentication)
            throws ServletException, IOException {

        //更新登录信息
        //User user = updateLoginInfo(request, authentication);

        //判断是否ajax请求
        boolean ajax = SecurityUtils.isAjax(request);

        //检查登录目标URL
        //if (StringUtils.hasText(user.getTarget_url())) {
        //    if (ajax) {
        //        onAuthenticationSuccess(request, response, authentication, true, user.getTarget_url());
        //    } else {
        //        // Use the DefaultSavedRequest URL
        //        logger.debug("Redirecting to DefaultSavedRequest Url: " + user.getTarget_url());
        //        getRedirectStrategy().sendRedirect(request, response, user.getTarget_url());
        //    }
        //
        //    return;
        //}

        //保存的请求
        SavedRequest savedRequest = requestCache.getRequest(request, response);

        if (savedRequest == null) {
            onAuthenticationSuccess(request, response, authentication, ajax, getDefaultTargetUrl());

            return;
        } else {
            String targetUrlParameter = getTargetUrlParameter();
            if (isAlwaysUseDefaultTargetUrl()
                    || (targetUrlParameter != null && StringUtils.hasText(request
                    .getParameter(targetUrlParameter)))) {
                requestCache.removeRequest(request, response);
                //super.onAuthenticationSuccess(request, response, authentication);

                onAuthenticationSuccess(request, response, authentication, ajax, getDefaultTargetUrl());

                return;
            }

            //清除错误参数
            clearAuthenticationAttributes(request);

            String targetUrl = ((DefaultSavedRequest) savedRequest).getRequestURI();

            String queryString = ((DefaultSavedRequest) savedRequest).getQueryString();

            if (!StringUtils.hasText(targetUrl) || "/".equals(targetUrl)) {
                //如果上次请求的URL为空
                targetUrl = getDefaultTargetUrl();
            }

            if (StringUtils.hasText(queryString)) {
                targetUrl += ("?" + queryString);
            }

            requestCache.removeRequest(request, response);

            if (ajax) {
                onAuthenticationSuccess(request, response, authentication, true, targetUrl);
            } else {
                // Use the DefaultSavedRequest URL
                logger.debug("Redirecting to DefaultSavedRequest Url: " + targetUrl);
                getRedirectStrategy().sendRedirect(request, response, targetUrl);
            }
        }
    }

    /**
     * @param request
     * @param response
     * @param authentication
     * @param ajax
     */
    protected void onAuthenticationSuccess(HttpServletRequest request,
                                           HttpServletResponse response, Authentication authentication,
                                           boolean ajax, String targetUrl) throws IOException, ServletException {
        if (ajax) {
            //AJAX请求
            response.setHeader("Content-Type", "application/json;charset=UTF-8");
            authentication.getPrincipal();

            response.getWriter().write(mapper.writeValueAsString(new PageResult(false, 200, "登录成功", targetUrl)));
            response.flushBuffer();
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }


    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }

    ///**
    // * 登录成功，更新登录信息
    // *
    // * @param request
    // * @param authentication
    // */
    //private User updateLoginInfo(HttpServletRequest request, Authentication authentication) {
    //
    //    String remoteAddr = HttpToolUtils.getRemoteAddr(request);
    //    HttpSession session = request.getSession(false);
    //
    //    User user = (User) authentication.getPrincipal();
    //    //IP信息
    //    user.setLast_login_ip(remoteAddr);
    //
    //    userService.updateLoginInfo(user);
    //
    //    LocalDateTime now = LocalDateTime.now();
    //
    //    //插入会话信息
    //    LoginLog loginLog = new LoginLog();
    //    loginLog.setUser_id(user.getId());
    //    loginLog.setUsername(user.getUsername());
    //    loginLog.setAccount("");
    //    loginLog.setIp(remoteAddr);
    //    loginLog.setLogin_time(now);
    //    loginLog.setSession_id(session == null ? "" : session.getId());
    //
    //    //保存登录信息
    //    userService.insert(loginLog);
    //
    //    return user;
    //}

}
