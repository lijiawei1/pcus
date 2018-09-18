package org.zap.framework.security.constants;

/**
 * 补充一些除了 HttpServletResponse 中声明的HTTP常用错误码
 *
 * Created by Shin on 2016/1/19.
 */
public class SecurityConstants {



    /**
     * 重复SESSION登录
     */
    public static final int SC_MULTIPLE_SESSION = 2001;

    /**
     * 图片验证码
     */
    public static final String IMAGE_VERIFY_CODE_KEY = "image_verify_code";

}
