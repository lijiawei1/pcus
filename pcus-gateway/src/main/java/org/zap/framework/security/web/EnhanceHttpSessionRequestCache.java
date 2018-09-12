package org.zap.framework.security.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 保存上次请求
 * <p>
 * Created by Shin on 2016/5/30.
 */
public class EnhanceHttpSessionRequestCache extends HttpSessionRequestCache {

    boolean justUseSavedRequestOnGet;

    Logger logger = LoggerFactory.getLogger(EnhanceHttpSessionRequestCache.class);

    @Override
    public void saveRequest(HttpServletRequest request, HttpServletResponse response) {

        if (!justUseSavedRequestOnGet || "GET".equals(request.getMethod())) {
            if (!SecurityUtils.isAjax(request)) {

                logger.debug("保存请求", request.getRequestURI());

                super.saveRequest(request, response);
            }
        } else {
            logger.debug("Request not saved as configured RequestMatcher did not match");
        }


    }

    public void setJustUseSavedRequestOnGet(boolean justUseSavedRequestOnGet) {
        this.justUseSavedRequestOnGet = justUseSavedRequestOnGet;
    }
}
