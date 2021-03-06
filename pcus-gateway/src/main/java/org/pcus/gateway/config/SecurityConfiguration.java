package org.pcus.gateway.config;

import org.pcus.gateway.auth.itf.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.intercept.FilterInvocationSecurityMetadataSource;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionFixationProtectionStrategy;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;
import org.springframework.session.security.web.authentication.SpringSessionRememberMeServices;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.auth.entity.UserDTO;
import org.zap.framework.security.entry.EnhanceAuthenticationEntryPoint;
import org.zap.framework.security.filter.DefaultInvocationSecurityMetadataSource;
import org.zap.framework.security.filter.DefaultLoginFilter;
import org.zap.framework.security.filter.EnhanceConcurrentSessionFilter;
import org.zap.framework.security.handler.EnhanceLoginFailureHandler;
import org.zap.framework.security.handler.EnhanceLoginHandler;
import org.zap.framework.security.manager.DefaultAccessDecisionManager;

import java.util.Arrays;

@EnableRedisHttpSession
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    IAuthService authService;

    @Bean
    UserDetailsService getUserDetailsService() {
        return username -> {
            PageResult pageResult = authService.loadUserByUsername(username);
            if (pageResult.isError()) {
                throw new UsernameNotFoundException(pageResult.getMessage());
            } else {
                return  (UserDTO)pageResult.getData();
            }
        };
    }

    //@Bean
    //@Override
    //protected UserDetailsService userDetailsService() {
    //    //TODO 需要切换为真是数据源
    //    InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
    //    manager.createUser(User.withUsername("user_1").password("123456").authorities("ROLE_USER").build());
    //    manager.createUser(User.withUsername("user_2").password("123456").authorities("ROLE_USER").build());
    //    return manager;
    //}

    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/css/**", "/js/**", "/font/**", "/images/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
                //此过滤连的入口URL匹配，拦截所有
                .requestMatchers().anyRequest()
                .and()
                .authorizeRequests()
                .antMatchers("/login**", "/error", "/captcha", "/oauth/**", "/simulate/**").permitAll()
                .and()
                .authorizeRequests()
                .anyRequest()
                .authenticated()
                .and()

                .headers().frameOptions().disable()
                .and()

                //.addFilterBefore(new DefaultIpFilter(), SecurityContextHolderAwareRequestFilter.class)
                //session并发控制
                //.addFilterAt(enhanceConcurrentSessionFilter(), ConcurrentSessionFilter.class)
                //替换注销过滤器
                //.addFilterAt(defaultLogoutFilter(), LogoutFilter.class)
                //设置登录过滤器
                .addFilterAt(defaultLoginFilter(), UsernamePasswordAuthenticationFilter.class)
                //
                //.addFilterBefore(defaultFilterSecurityInterceptor(), FilterSecurityInterceptor.class)

                .exceptionHandling().authenticationEntryPoint(new EnhanceAuthenticationEntryPoint("/login"))
                .and()
                //Session同步控制，需要限制声明
                .sessionManagement()
                //.sessionAuthenticationStrategy(compositeSessionAuthenticationStrategy())
                .maximumSessions(1).maxSessionsPreventsLogin(false).expiredUrl("/login?expired")
                .sessionRegistry(sessionRegistry()).and()
                //.and()
                //.formLogin()
                //.loginPage("/login")
                //.permitAll()
                .and()
                .rememberMe().rememberMeServices(rememberMeServices())
                .and()
                .csrf().disable()
                .logout().logoutUrl("/logout").permitAll()

        ;
        // @formatter:on


        // @formatter:off
        //http
        //        //设置security过滤链的匹配URL，默认的所有匹配
        //        .requestMatchers().anyRequest()
        //        .and()
        //        .authorizeRequests()
        //        .antMatchers("/oauth/**").permitAll()
        //        .antMatchers("/login").permitAll()
        //        .anyRequest().authenticated()
        //        .and().csrf().disable();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public EnhanceConcurrentSessionFilter enhanceConcurrentSessionFilter() {
        EnhanceConcurrentSessionFilter filter = new EnhanceConcurrentSessionFilter(sessionRegistry(), "/login");
        return filter;

    }

    @Bean
    public DefaultLoginFilter defaultLoginFilter() {
        DefaultLoginFilter filter = new DefaultLoginFilter();
        filter.setAuthenticationManager(authenticationManager);
        filter.setSessionAuthenticationStrategy(compositeSessionAuthenticationStrategy());
        EnhanceLoginHandler defaultLoginHandler = new EnhanceLoginHandler();
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


    //@Bean
    //public DefaultFilterSecurityInterceptor defaultFilterSecurityInterceptor() {
    //    DefaultFilterSecurityInterceptor interceptor = new DefaultFilterSecurityInterceptor();
    //
    //    interceptor.setAuthenticationManager(authenticationManager);
    //    interceptor.setAccessDecisionManager(defaultAccessDecisionManager());
    //    interceptor.setSecurityMetadataSource(securityMetadataSource());
    //    return interceptor;
    //}

    @Bean
    public DefaultAccessDecisionManager defaultAccessDecisionManager() {
        return new DefaultAccessDecisionManager();
    }

    @Bean
    public FilterInvocationSecurityMetadataSource securityMetadataSource() {
        return new DefaultInvocationSecurityMetadataSource();
    }

    //@Bean
    //public SessionRegistry sessionRegistry() {
    //    return new SessionRegistryImpl();
    //}

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

    @Bean
    SpringSessionBackedSessionRegistry sessionRegistry() {
        return new SpringSessionBackedSessionRegistry((FindByIndexNameSessionRepository)redisOperationsSessionRepository);
    }

    @Autowired
    RedisOperationsSessionRepository redisOperationsSessionRepository;

    @Bean
    RememberMeServices rememberMeServices() {
        SpringSessionRememberMeServices rememberMeServices = new SpringSessionRememberMeServices();
        // optionally customize
        rememberMeServices.setAlwaysRemember(true);
        return rememberMeServices;
    }
}
