package org.pcus.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.AuditorAware;


@SpringBootApplication
@EnableDiscoveryClient
//@EnableJpaAuditing(auditorAwareRef = "auditorAware")
//@EnableJpaRepositories(repositoryBaseClass = WiselyRepositoryImpl.class)
public class AuthServerApplication {

	//@Bean(name = "auditorAware")
	//public AuditorAware<String> auditorAware() {
	//	return ()-> SecurityUtils.getCurrentUserUsername();
	//}

	public static void main(String[] args) {
		SpringApplication.run(AuthServerApplication.class, args);
	}

}
