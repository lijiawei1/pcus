package org.zap.framework.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationTargetUrlRequestHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.zap.framework.security.entity.PageResult;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 默认登出处理
 */
public class DefaultLogoutHandler extends AbstractAuthenticationTargetUrlRequestHandler implements LogoutSuccessHandler {

    @Autowired
    ObjectMapper mapper = SecurityUtils.getMapper();

    Logger logger = LoggerFactory.getLogger(DefaultLogoutHandler.class);

    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
                                Authentication authentication) throws IOException, ServletException {
        if ( SecurityUtils.isAjax(request)) {
            //AJAX请求
            response.setHeader("Content-Type", "application/json;charset=UTF-8");
            response.getWriter().write(mapper.writeValueAsString(new PageResult(true, 200, "登出成功", null)));
            response.flushBuffer();
        } else {
            super.handle(request, response, authentication);
        }

    }


}
