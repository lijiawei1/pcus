package org.pcus.module;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PcusCoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(PcusCoreApplication.class);
    }
}