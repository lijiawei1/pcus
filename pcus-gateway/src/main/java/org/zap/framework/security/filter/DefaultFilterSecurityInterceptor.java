package org.zap.framework.security.filter;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.access.SecurityMetadataSource;
import org.springframework.security.access.intercept.AbstractSecurityInterceptor;
import org.springframework.security.access.intercept.InterceptorStatusToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.zap.framework.security.utils.SecurityLog;

import javax.servlet.*;
import java.io.IOException;
import java.util.stream.Stream;

public class DefaultFilterSecurityInterceptor extends AbstractSecurityInterceptor implements Filter{

	private FilterInvocationSecurityMetadataSource securityMetadataSource;
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		FilterInvocation fi = new FilterInvocation(request, response, chain);
		invoke(fi);
	}

	public void invoke(FilterInvocation fi) throws IOException, ServletException {

		SecurityLog.debug("请求对象[{}]，需要权限{}", fi.getRequestUrl(), securityMetadataSource.getAttributes(fi));

		InterceptorStatusToken token = super.beforeInvocation(fi);

		logUser();

		try {
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } finally {
            super.afterInvocation(token, null);
        }
	}

	@Override
	public Class<?> getSecureObjectClass() {
		return FilterInvocation.class;
	}

	@Override
	public SecurityMetadataSource obtainSecurityMetadataSource() {
		return this.securityMetadataSource;
	}
	
	public void destroy() {
		
	}
	
	public void init(FilterConfig arg0) throws ServletException {
		
	}

	public FilterInvocationSecurityMetadataSource getSecurityMetadataSource() {
		return securityMetadataSource;
	}

	public void setSecurityMetadataSource(
			FilterInvocationSecurityMetadataSource securityMetadataSource) {
		this.securityMetadataSource = securityMetadataSource;
	}


	//记录登录用户信息
	protected void logUser() {

		if (SecurityLog.isDebugEnabled()) {

			SecurityContext context = SecurityContextHolder.getContext();
			if (context == null) {
				return ;
			}

			Authentication authentication = context.getAuthentication();
			if (authentication == null) {
				return ;
			}

			Object principal = authentication.getPrincipal();

			if (principal == null || "anonymousUser".equals(principal)) {
				SecurityLog.debug("当前登录对象[{}]", principal);
			} else {

				if (principal instanceof org.springframework.security.core.userdetails.User) {
					//User user = new User();

					org.springframework.security.core.userdetails.User suser = (org.springframework.security.core.userdetails.User) principal;
					//user.setUsername(suser.getUsername());
					//user.setAuthorities(suser.getAuthorities());

					if (suser != null) {
						Stream<GrantedAuthority> stream = suser.getAuthorities().stream();
						String[] authorities = stream.map(a -> a.getAuthority()).toArray(String[]::new);
						SecurityLog.debug("当前登录对象拥有权限键值[{}]", StringUtils.join(authorities, ","));
					}
				}

				//return (User) principal;

				//User user = (User)principal;
				//if (user != null) {
				//	String[] authorities = user.getAuthorities().stream().map(a -> a.getAuthority()).toArray(String[]::new);
				//	String[] names = user.getAuthorities().stream().map(a -> ((EnhanceGrantedAuthority) a).getName()).toArray(String[]::new);
				//	SecurityLog.debug("当前登录对象拥有权限[{}]，键值[{}]", StringUtils.join(names, ","), StringUtils.join(authorities, ","));
				//}

			}

		}
	}
}
