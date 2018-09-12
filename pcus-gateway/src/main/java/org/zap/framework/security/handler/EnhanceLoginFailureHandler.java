package org.zap.framework.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.zap.framework.security.entity.PageResult;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录失败处理器
 *
 * Created by Shin on 2016/1/26.
 */
public class EnhanceLoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    ObjectMapper mapper;

    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {

        //AJAX请求
        if (SecurityUtils.isAjax(request)) {
            PageResult pageResult = SecurityUtils.parseException(exception);
            SecurityUtils.output(response, mapper.writeValueAsString(pageResult));
        } else {
            super.onAuthenticationFailure(request, response, exception);
        }

        //if (defaultFailureUrl == null) {
        //    logger.debug("No failure URL set, sending 401 Unauthorized error");
        //
        //    response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
        //            "Authentication Failed: " + exception.getMessage());
        //} else {
        //    saveException(request, exception);
        //
        //    if (forwardToDestination) {
        //        logger.debug("Forwarding to " + defaultFailureUrl);
        //
        //        request.getRequestDispatcher(defaultFailureUrl)
        //                .forward(request, response);
        //    } else {
        //        logger.debug("Redirecting to " + defaultFailureUrl);
        //        redirectStrategy.sendRedirect(request, response, defaultFailureUrl);
        //    }
        //}
    }

}
