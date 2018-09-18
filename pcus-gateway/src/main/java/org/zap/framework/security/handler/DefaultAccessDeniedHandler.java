package org.zap.framework.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang.CharEncoding;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 拒绝访问处理器
 * Created by Shin on 2016/1/18.
 */
public class DefaultAccessDeniedHandler extends AccessDeniedHandlerImpl {

    //
    ObjectMapper mapper = SecurityUtils.getMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        //判断是否AJAX访问
        boolean isAjax = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));

        if (isAjax) {

            response.setContentType("application/json");
            response.setCharacterEncoding(CharEncoding.UTF_8);
            PrintWriter out = response.getWriter();
            out.print(mapper.writeValueAsString(new PageResult(true, HttpServletResponse.SC_FORBIDDEN, accessDeniedException.getMessage(), null)));
            out.flush();
            out.close();
        } else {
            super.handle(request, response, accessDeniedException);
        }
    }
}
