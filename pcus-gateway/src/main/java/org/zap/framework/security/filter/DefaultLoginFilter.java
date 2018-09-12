package org.zap.framework.security.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.zap.framework.security.constants.SecurityConstants;
import org.zap.framework.security.exception.VerifyCodeInvalidException;
import org.zap.framework.security.exception.VerifyCodeNullException;

/**
 * 登录过滤器
 * @author Shin
 *
 */
public class DefaultLoginFilter extends UsernamePasswordAuthenticationFilter {

	private static Logger logger = LoggerFactory.getLogger(DefaultLoginFilter.class);

	/**
	 * 验证码
	 */
	private String verifyCodeKey = SecurityConstants.IMAGE_VERIFY_CODE_KEY;
	/**
	 * 启用验证码
	 */
	private boolean enableVerifyCode;

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request,
			HttpServletResponse response) throws AuthenticationException {
		
		logger.debug("CustomLoginFilter.attemptAuthentication() is called.");
		
		if (enableVerifyCode) {
			checkVerifyCode(request);
		}
		
		return super.attemptAuthentication(request, response);
		
	}
	
    protected String obtainPassword(HttpServletRequest request) {
    	return super.obtainPassword(request);
    }

	/**
	 * 校验验证码
	 * @param request
	 */
    protected void checkVerifyCode(HttpServletRequest request) {
		//从session中获取验证码
		String sesCode = (String) request.getSession().getAttribute(SecurityConstants.IMAGE_VERIFY_CODE_KEY);
    	
    	String reqCode = StringUtils.trim(request.getParameter(verifyCodeKey));

    	if (StringUtils.isBlank(reqCode)) {
			//throw new AuthenticationServiceException(this.messages.getMessage("LoginAuthentication.captchaInvalid"));
			throw new VerifyCodeNullException("验证码为空");
		} else if (!sesCode.equalsIgnoreCase(reqCode)) {
    		throw new VerifyCodeInvalidException("验证码不正确");
    	}

		//让上一次的验证码失效
		request.removeAttribute(SecurityConstants.IMAGE_VERIFY_CODE_KEY);
    }

	public boolean isEnableVerifyCode() {
		return enableVerifyCode;
	}

	public void setEnableVerifyCode(boolean enableVerifyCode) {
		this.enableVerifyCode = enableVerifyCode;
	}

	public String getVerifyCodeKey() {
		return verifyCodeKey;
	}

	public void setVerifyCodeKey(String verifyCodeKey) {
		this.verifyCodeKey = verifyCodeKey;
	}
}
