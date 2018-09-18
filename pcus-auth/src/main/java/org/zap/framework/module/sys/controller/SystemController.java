package org.zap.framework.module.sys.controller;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.module.auth.service.MenuService;
import org.zap.framework.module.auth.service.UserService;
import org.zap.framework.util.BuildUtils;
import org.zap.framework.util.VerifyCodeUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SystemController extends BaseController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private UserService userService;


    //@Autowired
    //private Producer captchaProducer;

    /**
     * 登录页面
     */
    @RequestMapping("/login")
    public ModelAndView login() {
        return new ModelAndView("login");
    }

    @RequestMapping("/json")
    @ResponseBody
    public String json() {
        return "json";
    }


    /**
     * 校验验证码
     *
     * @param request
     * @return
     * @throws IOException
     */
    @RequestMapping("/captchaCheck")
    @ResponseBody
    public Object captchaCheck(String key, String code, HttpServletRequest request) throws IOException {
        //从session中获取验证码
        String sesCode = (String) request.getSession().getAttribute(StringUtils.defaultIfBlank(key, "image_verify_code"));
        //让上一次的验证码失效
        String reqCode = StringUtils.trim(code);

        return StringUtils.equalsIgnoreCase(sesCode, reqCode);
    }

    /**
     * 获取验证码
     *
     * @param request
     * @param response
     * @throws IOException
     */
    @RequestMapping("/captcha")
    public void captcha(String key, String length, HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setDateHeader("Expires", 0);
        // Set standard HTTP/1.1 no-cache headers.
        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        // Set IE extended HTTP/1.1 no-cache headers (use addHeader).
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        // Set standard HTTP/1.0 no-cache header.
        response.setHeader("Pragma", "no-cache");
        // return a jpeg
        response.setContentType("image/jpeg");

        //验证码长度范围为4-8
        int len = NumberUtils.toInt(length, 0);
        if (len < 4) len = 4;
        if (len > 8) len = 8;

        //默认的key
        String defaultKey = StringUtils.defaultIfBlank(key, "image_verify_code");

        String verifyCode = VerifyCodeUtils.generateVerifyCode(len);
        logger.debug(verifyCode);
        request.getSession().setAttribute(defaultKey, verifyCode);
        VerifyCodeUtils.outputImage(len * 75, 80, response.getOutputStream(), verifyCode);
        response.flushBuffer();


    }

    /**
     * 加载主页
     */
    @RequestMapping("/admin/index")
    public ModelAndView index() {
        User user = getUser();

        ModelAndView mv = new ModelAndView("index");
        mv.addObject("user", user);

        return mv;
    }

    /**
     * 根据用户角色加载系统菜单
     */
    @ResponseBody
    @RequestMapping(value = "/admin/loadMenus", method = RequestMethod.GET)
    public List<?> loadMenus(String parentPageNo) {
        //根据角色获取菜单
        return StringUtils.isNotEmpty(parentPageNo) ?
                menuService.loadMenus(getUser(), parentPageNo, true) : //需要父页面菜单
                menuService.loadMenus(getUser(), false, true, true);
    }

    @ResponseBody
    @RequestMapping(value = "/admin/loadSubMenus", method = RequestMethod.GET)
    public List<?> loadSubMenus(String subCode) {
        return menuService.loadSubMenus(getUser(), subCode, true);
    }

    /**
     * 根据用户角色过滤系统菜单
     */
    @ResponseBody
    @RequestMapping("/admin/loadButtons")
    public List<?> loadButtons(String parentPageNo) {
        return menuService.loadButtonCodes(parentPageNo, getUser());
    }

    @ResponseBody
    @RequestMapping(value = "/admin/relad", method = RequestMethod.GET)
    public List<?> reload(String para) {
        return BuildUtils.LIST_BUILDER("123", "343", "454", "789").toList();
    }

    @ResponseBody
    @RequestMapping(value = "/admin/relad2", method = RequestMethod.GET)
    public List<?> reload2(String para) {
        return BuildUtils.LIST_BUILDER("123", "343", "454").toList();
    }

    /**
     * 登录用户可修改密码
     *
     * @param oldPwd 旧密码
     * @param newPwd 登录密码
     */
    @ResponseBody
    @RequestMapping(value = "/changePwd", method = RequestMethod.POST)
    public Map<String, Object> changePwd(String oldPwd, String newPwd) {
        userService.changePassword(getUser().getId(), oldPwd, newPwd);
        return new HashMap<>();
    }


    //@RequestMapping("/error")
    //public String error() {
    //    return "error";
    //}

    @RequestMapping("/timeout")
    public String timeout() {
        return "timeout";
    }

    Logger logger = Logger.getLogger(SystemController.class);
}
