package org.pcus.gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.zap.framework.security.utils.SecurityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    //public void addResourceHandlers(ResourceHandlerRegistry registry) {
    //    registry.addResourceHandler("/my/**").addResourceLocations("file:E:/my/");
    //    super.addResourceHandlers(registry);
    //}

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
        registry.addViewController("/login").setViewName("login");
        //主页
        registry.addViewController("/admin/index").setViewName("admin/aindex");

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
                    modelAndView.addObject("user", SecurityUtils.getCurrentUser());
                }
            }
        });
    }


}
