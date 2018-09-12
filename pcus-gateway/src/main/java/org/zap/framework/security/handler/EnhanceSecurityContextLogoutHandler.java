package org.zap.framework.security.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Created by Shin on 2016/5/11.
 */
public class EnhanceSecurityContextLogoutHandler extends SecurityContextLogoutHandler {

    private boolean clearAuthentication = true;

    protected Logger log = LoggerFactory.getLogger(EnhanceSecurityContextLogoutHandler.class);

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        Assert.notNull(request, "HttpServletRequest required");
        if (isInvalidateHttpSession()) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                log.debug("Invalidating session: " + session.getId());
                session.invalidate();
            }
        }

        if (clearAuthentication) {
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(null);
        }

        SecurityContextHolder.clearContext();
    }
}
