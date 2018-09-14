package org.zap.framework.security.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.zap.framework.module.auth.entity.User;

import java.util.Arrays;

@Slf4j
public class SecurityUtils {
    /**
     * 得到当前用户
     *
     * @return
     */
    public static User getCurrentUser() {

        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) {
            log.debug("SecurityContext is null");
            return null;
        }

        Authentication authentication = context.getAuthentication();
        if (authentication == null) {
            log.debug("Authentication is null");
            return null;
        }

        return convertPrincipalToUser(authentication.getPrincipal());

        //return (User)authentication.getPrincipal();

    }

    public static User convertPrincipalToUser(Object principal) {
        if (principal == null || "anonymousUser".equals(principal)) {
            User user = new User();
            user.setAccount("anonymousUser");
            user.setUsername("anonymousUser");
            return user;
        } else {

            if (principal instanceof org.springframework.security.core.userdetails.User) {
                User user = new User();

                org.springframework.security.core.userdetails.User suser = (org.springframework.security.core.userdetails.User) principal;
                user.setUsername(suser.getUsername());
                user.setAuthorities(suser.getAuthorities());

                return user;
            }

            return (User) principal;
        }
    }
}
