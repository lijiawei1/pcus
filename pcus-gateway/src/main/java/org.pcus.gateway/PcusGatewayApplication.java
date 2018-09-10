package org.pcus.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.io.File;
import java.io.FileNotFoundException;

@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
//@EnableOAuth2Sso
public class PcusGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(PcusGatewayApplication.class);
    }
}
