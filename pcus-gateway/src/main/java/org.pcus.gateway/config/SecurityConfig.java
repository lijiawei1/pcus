package org.pcus.gateway.config;

import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableOAuth2Sso
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    //@Autowired
    //public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    //    auth.inMemoryAuthentication()
    //            .withUser("admin").password("1").roles("ADMIN", "USER").and()
    //            .withUser("lijw").password("1").roles("USER");
    //}

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //http.formLogin()                    //  定义当需要用户登录时候，转到的登录页面。
        //        .loginProcessingUrl("/auth/login")
        //        .and()
        //        .authorizeRequests()        // 定义哪些URL需要被保护、哪些不需要被保护
        //        .anyRequest()               // 任何请求,登录后可以访问
        //        .authenticated()
        //        .and()
        //        .csrf().disable();

        http.csrf().disable();

    }

}
