package org.pcus.gateway.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.lang.StringUtils;
import org.beetl.ext.simulate.JsonUtil;
import org.beetl.ext.simulate.WebSimulate;
import org.beetl.ext.spring.BeetlSpringViewResolver;
import org.pcus.gateway.auth.itf.IAuthService;
import org.pcus.gateway.auth.service.StaticPagePathFinder;
import org.pcus.gateway.mock.EnhanceWebSimulate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.HttpMessageConverters;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.zap.framework.common.entity.PageParam;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.auth.entity.Menu;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.security.utils.SecurityUtils;
import org.zap.framework.util.constant.ZapConstant;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

    @Bean
    public HttpMessageConverters fastJsonHttpMessageConverters() {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(new CustomObjectMapper());
        converter.setSupportedMediaTypes(Arrays.asList(
                new MediaType(MediaType.TEXT_HTML, Charset.forName("UTF-8")),
                MediaType.APPLICATION_JSON_UTF8));

        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
        stringHttpMessageConverter.setSupportedMediaTypes(Arrays.asList(
                new MediaType(MediaType.TEXT_PLAIN, Charset.forName("UTF-8"))));
        return new HttpMessageConverters(Arrays.asList(converter, stringHttpMessageConverter));
    }

    @Autowired
    private StaticPagePathFinder staticPagePathFinder;

    @Autowired(required = false)
    IAuthService iAuthService;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        File path = null;
        try {
            path = new File(ResourceUtils.getURL("classpath:").getPath());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        String gitPath = path.getParentFile().getParentFile().getParent() + File.separator + "pcusdata" + File.separator + "uploads" + File.separator;
        registry.addResourceHandler("/uploads/**").addResourceLocations(gitPath);
        registry.addResourceHandler("/**").addResourceLocations(ResourceUtils.CLASSPATH_URL_PREFIX + "/static/");
        super.addResourceHandlers(registry);

    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //登录页面
        //registry.addViewController("/login").setViewName("login");
        //主页
        //registry.addViewController("/admin/index").setViewName("admin/aindex");

        try {
            for (StaticPagePathFinder.PagePaths pagePaths : staticPagePathFinder.findPath()) {
                String urlPath = pagePaths.getUrlPath();
                System.out.println(pagePaths.getUrlPath());
                System.out.println(pagePaths.getFilePath());
                //registry.addViewController(urlPath).setViewName(pagePaths.getFilePath());
                String filePath = pagePaths.getFilePath();
                if (!filePath.isEmpty()) {
                    //匹配目录是/PUCS/开头的,去掉/PUCS/，其它模块还是原来的访问路径
                    String regx = "(/pcus/|/)";
                    registry.addViewController(filePath).setViewName(filePath.replaceFirst(regx, ""));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Unable to locate static pages:" + e.getMessage(), e);
        }
    }

    /**
     * {@inheritDoc}
     * <p>This implementation is empty.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptorAdapter() {
            @Override
            public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
                super.postHandle(request, response, handler, modelAndView);
                if (modelAndView != null) {

                    PageParam pageParam = new PageParam();
                    //模块
                    pageParam.setModule(request.getParameter("module"));
                    //菜单
                    pageParam.setFunction(request.getParameter("function"));
                    //父页面编码
                    pageParam.setParentPageNo(request.getParameter("parentPageNo"));
                    //父页面主键
                    pageParam.setParentPageId(request.getParameter("parentPageId"));
                    //页面编码
                    pageParam.setNo(request.getParameter("no"));

                    //菜单编码
                    String menuCode = request.getParameter("menuCode");
                    User currentUser = SecurityUtils.getCurrentUser();
                    List<String> permissions = new ArrayList<>();
                    if (iAuthService != null && currentUser != null) {
                        if (StringUtils.isBlank(menuCode)) {
                            //通过前端传回来的菜单编码
                            permissions = iAuthService.loadButtonsByType(pageParam.getNo(), currentUser.getId(), currentUser.isAdmin(), "");
                            //permissions = menuService.loadButtonCodes(param.getNo(), getUser());
                        } else {
                            permissions = iAuthService.loadButtonsByType(menuCode, currentUser.getId(), currentUser.isAdmin(), "menuCode");
                            //菜单
                            //Menu menu = menuService.queryOneByClause(Menu.class, "NVL(AM.DR, 0) = 0 AND AM.CODE = ?", menuCode);
                            //if (menu != null) {
                            //    permissions = menuService.loadButtonCodes(menu.getNo(), getUser());
                            //}
                        }
                    }
                    //输出按钮权限
                    modelAndView.addObject(ZapConstant.PAGE_PERMISSION, json(permissions));
                    modelAndView.addObject("user", currentUser);
                    modelAndView.addObject("pp", pageParam);
                }
            }
        });
    }

    public String json(Object value) {
        try {
            return mapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new BusinessException("数据格式JSON化出错", e);
        }
    }

    /**
     * simluateView来模拟视图渲染，simluateJson来模拟REST请求的数据
     * @param resolver
     * @return
     */
    @Bean
    public WebSimulate getWebSmulate(BeetlSpringViewResolver resolver) {
        CustomObjectMapper mapper = new CustomObjectMapper();
        WebSimulate webSimulate = new EnhanceWebSimulate(resolver.getConfig().getGroupTemplate(), new JsonUtil() {

            @Override
            public String toJson(Object o) throws Exception {
                return mapper.writeValueAsString(o);
            }

            @Override
            public Object toObject(String str, Class c) throws Exception {
                return mapper.readTree(str);
            }
        }) {

            public String getValuePath(HttpServletRequest request) {
                return this.removePreffix(request.getServletPath());
            }


            protected String getRenderPath(HttpServletRequest request) {
                return this.removePreffix(request.getServletPath());
            }

            private String removePreffix(String path) {
                return path.replaceFirst("/simulate", "");
            }
        };
        return webSimulate;
    }

    @Autowired
    CustomObjectMapper mapper;

    @Bean("customObjectMapper")
    public CustomObjectMapper customObjectMapper() {
        return new CustomObjectMapper();
    }
}
