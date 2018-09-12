package org.zap.framework.security.constants;

/**
 * Created by Shin on 2016/1/26.
 */
public enum SecError {

    ERR_BAD_CREDENTIALS(530, "用户名密码有误"),
    ERR_ACCOUNT_EXPIRED(531, "用户账号已过期"),
    ERR_USERNAME_NOT_FOUND(532, "用户不存在"),
    ERR_USER_DISABLED(533, "用户未启用或被冻结"),

    ERR_VERIFY_CODE_INVALID(540, "图片验证码无效"),
    ERR_VERIFY_CODE_NULL(540, "图片验证码不能为空"),

    ERR_ACCOUNT_DUPLICATE(560, "注册账号重复"),
    ERR_MOBILE_DUPLICATE(561,"注册手机号重复"),
    ERR_EMAIL_DUPLICATE(562,"注册邮箱重复"),

    ERR_EMAIL_FORMAT(570, "邮箱地址格式非法"),
    ERR_MOBILE_FORMAT(571, "手机号格式非法"),
    ERR_ACCOUNT_ENG_NUM(572, "账号格式非法，必须是英文和数字组合"),

    ;

    private String message;

    private int code;

    SecError(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }
}
