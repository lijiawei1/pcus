package org.pcus.module.core.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.data.redis.RedisOperationsSessionRepository;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;

@EnableWebSecurity
@EnableRedisHttpSession
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    AuthenticationManager authenticationManager;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
                //此过滤连的入口URL匹配，拦截所有
                .requestMatchers().anyRequest()
                //.and()
                //.authorizeRequests()
                //.anyRequest()
                //.authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(100).sessionRegistry(sessionRegistry())
                .and().and()
                .headers().frameOptions().disable()
                .and().csrf().disable()

        ;
    }

    @Autowired
    SpringSessionBackedSessionRegistry sessionRegistry() {
        return new SpringSessionBackedSessionRegistry((FindByIndexNameSessionRepository) redisOperationsSessionRepository);
    }

    @Autowired
    JedisConnectionFactory jedisConnectionFactory;

    //@Bean
    @Autowired
    RedisOperationsSessionRepository redisOperationsSessionRepository;
}
