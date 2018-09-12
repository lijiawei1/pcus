package org.zap.framework.security.manager;

import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.SecurityConfig;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Iterator;

/**
 * 决策管理器
 *
 * @author Shin
 */
public class DefaultAccessDecisionManager implements AccessDecisionManager {


    /**
     * @param authentication   访问主体
     * @param object           受访客体
     * @param configAttributes 拥有的权限
     * @throws AccessDeniedException               拒绝访问
     * @throws InsufficientAuthenticationException 权限不足
     */
    public void decide(Authentication authentication, Object object,
                       Collection<ConfigAttribute> configAttributes) throws AccessDeniedException,
            InsufficientAuthenticationException {

        if (configAttributes == null) {
            return;
        }

        //当前请求的url
//		System.out.println(object.toString());
        Iterator<ConfigAttribute> ite = configAttributes.iterator();
        while (ite.hasNext()) {
            ConfigAttribute ca = ite.next();
            String needRole = ca.getAttribute();
            for (GrantedAuthority ga : authentication.getAuthorities()) {
                if (needRole.equals(ga.getAuthority()))
                    return;
            }
        }
        throw new AccessDeniedException("Access denied, less of roles");

    }

    public boolean supports(ConfigAttribute attribute) {
        // TODO Auto-generated method stub
        return true;
    }

    public boolean supports(Class<?> clazz) {
        // TODO Auto-generated method stub
        return true;
    }

}
