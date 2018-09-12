package org.zap.framework.security.listener;

import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.session.HttpSessionDestroyedEvent;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.zap.framework.security.entity.SessionInfo;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;

/**
 * 增强的SESSION监听
 *
 *
 * 	主动登出  最后请求时间=登出时间
 * 	管理员踢出（用户刷新界面） 最后请求时间 小于 SESSION销毁时间
 * 	SESSION空闲超时（关闭浏览器、关闭电脑、重复登录被踢） 最后请求时间 小于 SESSION销毁时间
 *
 * Created by Shin on 2016/5/3.
 **/
public class EnhancedHttpSessionEventPublisher extends HttpSessionEventPublisher {

    //private BusiService busiService;

    SessionRegistry sessionRegistry;

    public void sessionCreated(HttpSessionEvent event) {
        //保存session信息
        SecurityUtils.putSession(event.getSession());

        initService(event);

        super.sessionCreated(event);
    }

    /**
     * Handles the HttpSessionEvent by publishing a {@link HttpSessionDestroyedEvent} to
     * the application appContext.
     *
     * @param event The HttpSessionEvent pass in by the container
     */
    public void sessionDestroyed(HttpSessionEvent event) {

        initService(event);

        HttpSession session = event.getSession();

        SessionInfo sessionInfo = SecurityUtils.getSession(session.getId());
        if (sessionInfo != null && sessionInfo.isLogon()) {

            //如果是登录用户，记录用户的登出时间
            String sessionId = sessionInfo.getId();

            //更新
            //String sql = "UPDATE ZAP_LOG_LOGIN L SET L.LOGOUT_TIME = ? WHERE L.SESSION_ID = ?";
            //busiService.getBaseDao().getJdbcTemplate().update(sql,
            //        DateUtils.FORMATTER_DATETIME.format(LocalDateTime.now()),
            //        sessionId);
        }

        //移除session信息
        SecurityUtils.removeSession(event.getSession());

        super.sessionDestroyed(event);
    }

    private void initService(HttpSessionEvent event) {
        //if (busiService == null && event.getSession() != null) {
        //    busiService = (BusiService)WebApplicationContextUtils.getWebApplicationContext(event.getSession().getServletContext()).getBean("busiService");
        //}

        if (sessionRegistry == null) {
            sessionRegistry = WebApplicationContextUtils.getWebApplicationContext(event.getSession().getServletContext()).getBean(SessionRegistry.class);
        }
    }

}
