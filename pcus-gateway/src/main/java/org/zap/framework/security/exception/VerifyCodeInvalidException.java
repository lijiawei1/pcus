package org.zap.framework.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Created by Shin on 2016/1/26.
 */
public class VerifyCodeInvalidException extends AuthenticationException {
    public VerifyCodeInvalidException(String msg, Throwable t) {
        super(msg, t);
    }

    public VerifyCodeInvalidException(String msg) {
        super(msg);
    }
}
