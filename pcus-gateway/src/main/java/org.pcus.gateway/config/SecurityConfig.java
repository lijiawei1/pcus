package org.pcus.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
//@EnableOAuth2Sso
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    //@Autowired
    //public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
    //    auth.inMemoryAuthentication()
    //            .withUser("admin").password("1").roles("ADMIN", "USER").and()
    //            .withUser("lijw").password("1").roles("USER");
    //}

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //http
        //        .requestMatchers().anyRequest()
        //        .and()
        //        .authorizeRequests()        // 定义哪些URL需要被保护、哪些不需要被保护
        //        .antMatchers("/health").permitAll()
        //        .antMatchers("/oauth/*").permitAll()
        //        .anyRequest().authenticated(); // 任何请求,登录后可以访问

        http
                .requestMatchers().anyRequest()
                .and()
                .authorizeRequests()
                .antMatchers("/health").permitAll()
                .antMatchers("/oauth/*").permitAll();

        //http
        //        .requestMatchers().anyRequest()
        //        .and()
        //        .authorizeRequests()
        //        .antMatchers("/oauth/*").permitAll();

        http.csrf().disable();
    }

    @Bean
    @Override
    protected UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("user_1").password("123456").authorities("USER").build());
        manager.createUser(User.withUsername("user_2").password("123456").authorities("USER").build());
        return manager;
    }

}
