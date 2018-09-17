package org.zap.framework.security.filter;

import org.pcus.gateway.auth.itf.IAuthService;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.*;

/**
 * 权限元数据
 * 
 * @author Shin
 *
 */
public class DefaultInvocationSecurityMetadataSource implements	FilterInvocationSecurityMetadataSource {

	//@Autowired
	private IAuthService privilegeService;

	public DefaultInvocationSecurityMetadataSource(IAuthService privilegeService) {
		this.privilegeService = privilegeService;
	}

	public DefaultInvocationSecurityMetadataSource() {
		 //loadResource();
	}

	/**
	 * 加载数据库资源关系
	 * @return
	 */
	private Map<String, Collection<ConfigAttribute>> loadResource() {

		Map<String, Collection<ConfigAttribute>> resourceMap = new HashMap<>();

		//TODO 加载系统配置的所有资源对应的角色权限
		//Map<String, Set<String>> res = new HashMap();//privilegeService.loadPrivilege();
		Map<String, Set<String>> res = privilegeService.loadResource();

		for (String interceptUrl : res.keySet()) {
			Set<String> set = res.get(interceptUrl);
			Collection<ConfigAttribute> configAttributes = SecurityConfig.createList(set.toArray(new String[set.size()]));
			//所有URL默认拥有管理员角色
			configAttributes.add(new SecurityConfig("ROLE_SYSTEM"));
			resourceMap.put(interceptUrl, configAttributes);
		}

		return resourceMap;
	}

	public Collection<ConfigAttribute> getAllConfigAttributes() {
		// TODO Auto-generated method stub
		return null;
	}

	public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
		FilterInvocation fi = ((FilterInvocation) object);

		//URL和角色列表
		Map<String, Collection<ConfigAttribute>> resourceMap = loadResource();
		
		Iterator<String> ite = resourceMap.keySet().iterator();
		while (ite.hasNext()) {
			String resourceUrl = ite.next();
			if ("#".equals(resourceUrl) || resourceUrl == null
					|| "".equals(resourceUrl))
				continue;
			RequestMatcher requestMatcher = new AntPathRequestMatcher(resourceUrl);
			
			if (requestMatcher.matches(fi.getHttpRequest())) {
				return resourceMap.get(resourceUrl);
			}
		}
		Collection<ConfigAttribute> configAttributes = new ArrayList<>();
		//默认权限
		configAttributes.add(new SecurityConfig("ROLE_USER"));
		// 表示需要管理员权限访问
		return configAttributes;
	}

	public boolean supports(Class<?> arg0) {
		// TODO Auto-generated method stub
		return true;
	}
}
