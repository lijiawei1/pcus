package org.zap.framework.security.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.zap.framework.security.entity.PageResult;
import org.zap.framework.security.entity.SessionInfo;
import org.zap.framework.security.exception.VerifyCodeInvalidException;
import org.zap.framework.security.exception.VerifyCodeNullException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.zap.framework.security.constants.SecError.*;

/**
 * Created by Shin on 2015/12/1.
 */
public class SecurityUtils {

    private static Logger logger = LoggerFactory.getLogger(SecurityUtils.class);

    /**
     * 记录登录信息
     */
    private static Map<String, SessionInfo> info = new ConcurrentHashMap<>();

    public static PageResult parseException(AuthenticationException exception) {

        PageResult pageResult = new PageResult(true, 400, "登录验证不通过", null);

        if (exception instanceof AccountExpiredException) {
            return new PageResult(true, ERR_ACCOUNT_EXPIRED.getCode(), ERR_ACCOUNT_EXPIRED.getMessage(), null);
        } else if (exception instanceof BadCredentialsException) {
            return new PageResult(true, ERR_BAD_CREDENTIALS.getCode(), ERR_BAD_CREDENTIALS.getMessage(), null);
        } else if (exception instanceof UsernameNotFoundException) {
            return new PageResult(true, ERR_USERNAME_NOT_FOUND.getCode(), ERR_USERNAME_NOT_FOUND.getMessage(), null);
        } else if (exception instanceof VerifyCodeInvalidException) {
            return new PageResult(true, ERR_VERIFY_CODE_INVALID.getCode(), ERR_VERIFY_CODE_INVALID.getMessage(), null);
        } else if (exception instanceof VerifyCodeNullException) {
            return new PageResult(true, ERR_VERIFY_CODE_NULL.getCode(), ERR_VERIFY_CODE_NULL.getMessage(), null);
        } else if (exception instanceof DisabledException) {
            return new PageResult(true, ERR_USER_DISABLED.getCode(), ERR_USER_DISABLED.getMessage(), null);
        } else if (exception instanceof LockedException) {

        } else if (exception instanceof InternalAuthenticationServiceException) {

        } else if (exception instanceof SessionAuthenticationException) {

        } else if (exception instanceof InsufficientAuthenticationException) {

        }

        return pageResult;
    }


    /**
     * 输出结果
     * @param response
     * @param result
     * @throws IOException
     */
    public static void output(HttpServletResponse response, String result) throws IOException {
        //AJAX请求
        response.setHeader("Content-Type", "application/json;charset=UTF-8");
        response.getWriter().write(result);
        response.flushBuffer();
    }

    /**
     * 得到当前登录账号
     * @return
     */
    public static String getAccount() {

        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) {
            logger.debug("SecurityContext is null");
            return null;
        }

        Authentication authentication = context.getAuthentication();
        if (authentication == null) {
            logger.debug("Authentication is null");
            return null;
        }

        return authentication.getName();
    }

    static ObjectMapper mapper = new ObjectMapper();
    public static ObjectMapper getMapper() {
        return mapper;
    }

    /**
     * 得到当前用户
     * @return
     */
    public static User getCurrentUser() {

        SecurityContext context = SecurityContextHolder.getContext();
        if (context == null) {
            logger.debug("SecurityContext is null");
            return null;
        }

        Authentication authentication = context.getAuthentication();
        if (authentication == null) {
            logger.debug("Authentication is null");
            return null;
        }

        return convertPrincipalToUser(authentication.getPrincipal());

        //return (User)authentication.getPrincipal();

    }

    public static User convertPrincipalToUser(Object principal) {
        if (principal == null || "anonymousUser".equals(principal)) {
            return new User("游客", "", Arrays.asList());
        } else {

            //if (principal instanceof org.springframework.security.core.userdetails.User) {
            //    User user = new User();
            //
            //    org.springframework.security.core.userdetails.User suser = (org.springframework.security.core.userdetails.User) principal;
            //    user.setUsername(suser.getUsername());
            //    user.setAuthorities(suser.getAuthorities());
            //
            //    return user;
            //}

            return (User) principal;
        }
    }


    public static boolean isAjax(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }


    public static void clearSessionInfo() {
        info.clear();
    }

    public static void putSession(HttpSession httpSession) {
        if (httpSession != null) {
            info.put(httpSession.getId(), new SessionInfo(httpSession));
        }
    }

    public static void removeSession(HttpSession httpSession) {
        if (httpSession != null) {
            info.remove(httpSession.getId());
        }
    }

    public static SessionInfo getSession(HttpSession httpSession) {
        if (httpSession != null) {
            return info.get(httpSession.getId());
        }
        return null;
    }

    public static SessionInfo getSession(String id) {
        if (id != null) {
            return info.get(id);
        }
        return null;
    }



}
