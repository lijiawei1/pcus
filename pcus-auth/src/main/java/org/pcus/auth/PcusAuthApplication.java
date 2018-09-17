package org.pcus.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.orm.dao.IBaseDao;
import org.zap.framework.orm.dao.impl.BaseDao;

import javax.sql.DataSource;


@SpringBootApplication(scanBasePackages = {
		"org.zap.framework.common",
		"org.zap.framework.module",
		"org.pcus.auth"
})
@EnableDiscoveryClient
//@EnableJpaAuditing(auditorAwareRef = "auditorAware")
//@EnableJpaRepositories(repositoryBaseClass = WiselyRepositoryImpl.class)
@EnableCaching
public class PcusAuthApplication {

	//@Bean(name = "auditorAware")
	//public AuditorAware<String> auditorAware() {
	//	return ()-> SecurityUtils.getCurrentUserUsername();
	//}

	public static void main(String[] args) {
		SpringApplication.run(PcusAuthApplication.class, args);
	}


	@Autowired
    DataSource dataSource;

	@Bean
    IBaseDao baseDao() {
	    return new BaseDao(dataSource);
    }

	@Bean("customObjectMapper")
    public CustomObjectMapper customObjectMapper() {
		return new CustomObjectMapper();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
