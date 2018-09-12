package org.pcus.gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter;
import org.springframework.security.web.session.ConcurrentSessionFilter;
import org.zap.framework.security.filter.*;
import org.zap.framework.security.handler.DefaultLoginHandler;
import org.zap.framework.security.handler.DefaultLogoutHandler;
import org.zap.framework.security.handler.EnhanceLoginFailureHandler;
import org.zap.framework.security.manager.DefaultAccessDecisionManager;

import java.util.Arrays;

//@Configuration
//@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    AuthenticationManager authenticationManager;


    @Bean
    @Override
    protected UserDetailsService userDetailsService() {
        //TODO 需要切换为真是数据源
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user_1").password("123456").authorities("ROLE_USER").build());
        manager.createUser(User.withUsername("user_2").password("123456").authorities("ROLE_USER").build());
        return manager;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
                .requestMatchers().anyRequest()
                .and()
                .authorizeRequests()
                .antMatchers("/login").permitAll()
                .antMatchers("/captcha*").permitAll()
                .antMatchers("/error").permitAll()
                .antMatchers("/oauth/*").permitAll()
                .and()
                .headers().frameOptions().disable()
                .and()

                .addFilterBefore(new DefaultIpFilter(), SecurityContextHolderAwareRequestFilter.class)
                //session并发控制
                .addFilterAt(enhanceConcurrentSessionFilter(), ConcurrentSessionFilter.class)
                //替换注销过滤器
                .addFilterAt(defaultLogoutFilter(), LogoutFilter.class)
                //设置登录过滤器
                .addFilterAt(defaultLoginFilter(), UsernamePasswordAuthenticationFilter.class)
                //
                .addFilterBefore(defaultFilterSecurityInterceptor(), FilterSecurityInterceptor.class)

                //Session同步控制，需要限制声明
                .sessionManagement().sessionAuthenticationStrategy(compositeSessionAuthenticationStrategy())
                .and()
                .csrf().disable()

        ;
        // @formatter:on
    }

    @Bean
    public EnhanceConcurrentSessionFilter enhanceConcurrentSessionFilter() {
        EnhanceConcurrentSessionFilter filter = new EnhanceConcurrentSessionFilter(new SessionRegistryImpl(), "/login");
        return filter;

    }

    @Bean
    public DefaultLogoutFilter defaultLogoutFilter() {
        DefaultLogoutFilter filter = new DefaultLogoutFilter(new DefaultLogoutHandler(), new LogoutHandler[]{
                new SecurityContextLogoutHandler()
        });
        return filter;
    }

    @Bean
    public DefaultLoginFilter defaultLoginFilter() {
        DefaultLoginFilter filter = new DefaultLoginFilter();
        filter.setAuthenticationManager(authenticationManager);
        filter.setSessionAuthenticationStrategy(compositeSessionAuthenticationStrategy());
        DefaultLoginHandler defaultLoginHandler = new DefaultLoginHandler();
        defaultLoginHandler.setAlwaysUseDefaultTargetUrl(true);
        defaultLoginHandler.setDefaultTargetUrl("/admin/index");
        filter.setAuthenticationSuccessHandler(defaultLoginHandler);
        EnhanceLoginFailureHandler enhanceLoginFailureHandler = new EnhanceLoginFailureHandler();
        enhanceLoginFailureHandler.setDefaultFailureUrl("/error");
        filter.setAuthenticationFailureHandler(enhanceLoginFailureHandler);
        filter.setFilterProcessesUrl("/checklogin");
        filter.setEnableVerifyCode(false);
        return filter;
    }


    @Bean
    public DefaultFilterSecurityInterceptor defaultFilterSecurityInterceptor() {
        DefaultFilterSecurityInterceptor interceptor = new DefaultFilterSecurityInterceptor();

        interceptor.setAuthenticationManager(authenticationManager);
        interceptor.setAccessDecisionManager(defaultAccessDecisionManager());
        interceptor.setSecurityMetadataSource(securityMetadataSource());
        return interceptor;
    }

    @Bean
    public DefaultAccessDecisionManager defaultAccessDecisionManager() {
        return new DefaultAccessDecisionManager();
    }

    @Bean
    public FilterInvocationSecurityMetadataSource securityMetadataSource() {
        return new DefaultInvocationSecurityMetadataSource();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public CompositeSessionAuthenticationStrategy compositeSessionAuthenticationStrategy() {
        ConcurrentSessionControlAuthenticationStrategy concurrentSessionControlAuthenticationStrategy = new ConcurrentSessionControlAuthenticationStrategy(sessionRegistry());
        //最大同时session数
        concurrentSessionControlAuthenticationStrategy.setMaximumSessions(1);
        return new CompositeSessionAuthenticationStrategy(Arrays.asList(
                concurrentSessionControlAuthenticationStrategy,
                //session固化策略,Servlet3.1以上容器可以使用changeSessionId方法
                new SessionFixationProtectionStrategy(),
                //验证通过后将session注册到sessionRegistry
                new RegisterSessionAuthenticationStrategy(sessionRegistry())

        ));
    }
}