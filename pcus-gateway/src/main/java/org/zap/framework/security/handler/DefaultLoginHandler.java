package org.zap.framework.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.zap.framework.security.entity.PageResult;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 自定义登录成功处理类
 * 
 * @author Shin
 *
 */
public class DefaultLoginHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private static Logger logger = Logger.getLogger(DefaultLoginHandler.class);

	//@Autowired
	//UserService userService;

	ObjectMapper mapper = SecurityUtils.getMapper();

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
			throws ServletException, IOException {

		//更新登录信息
		//updateLoginInfo(request, authentication);

		if (SecurityUtils.isAjax(request)) {

			clearAuthenticationAttributes(request);
			//AJAX请求
			response.setHeader("Content-Type", "application/json;charset=UTF-8");
			authentication.getPrincipal();
			response.getWriter().write(mapper.writeValueAsString(new PageResult(false, 200, "登录成功", "")));
			response.flushBuffer();
		} else {
			super.onAuthenticationSuccess(request, response, authentication);
			logger.debug("CustomLoginHandler.onAuthenticationSuccess() is called!");
		}
	}

	/**
	 * 登录成功，更新登录信息
	 * @param request
	 * @param authentication
	 */
	//private void updateLoginInfo(HttpServletRequest request, Authentication authentication) {
    //
	//	String remoteAddr = HttpToolUtils.getRemoteAddr(request);
	//	HttpSession session = request.getSession(false);
	//	//更新
	//	if (session != null) {
	//		SessionInfo sessionInfo = SecurityUtils.getSession(session.getId());
	//		if (sessionInfo != null) {
	//			//设置登录标记位
	//			sessionInfo.setLogon(true);
	//		}
	//	}
    //
	//	User user = (User)authentication.getPrincipal();
	//	//IP信息
	//	user.setLast_login_ip(remoteAddr);
    //
	//	userService.updateLoginInfo(user);
    //
	//	LocalDateTime now = LocalDateTime.now();
    //
	//	//插入会话信息
	//	LoginLog loginLog = new LoginLog();
	//	loginLog.setUser_id(user.getId());
	//	loginLog.setUsername(StringUtils.defaultIfBlank(user.getName(), user.getUsername()));
	//	loginLog.setAccount(user.getAccount());
	//	loginLog.setIp(remoteAddr);
	//	loginLog.setLogin_time(now);
	//	loginLog.setLast_accessed_time(now);
	//	loginLog.setSession_id(session == null ? "" : session.getId());
    //
	//	//保存登录信息
	//	userService.insert(loginLog);
	//}

}
