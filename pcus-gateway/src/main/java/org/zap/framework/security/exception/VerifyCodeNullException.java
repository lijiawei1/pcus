package org.zap.framework.security.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Created by Shin on 2016/1/26.
 */
public class VerifyCodeNullException extends AuthenticationException {

    public VerifyCodeNullException(String msg, Throwable t) {
        super(msg, t);
    }

    public VerifyCodeNullException(String msg) {
        super(msg);
    }
}
