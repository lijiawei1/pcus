package org.pcus.report.config;

import com.bstek.ureport.console.UReportServlet;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

/**
 * Created by GANGKOU on 2018-09-12.
 */
@ImportResource("classpath:ureport-console-context.xml")
@EnableAutoConfiguration
@Configuration
@ComponentScan(basePackages = "org.pcus.report")
public class UReportConfig {

    @Bean
    public ServletRegistrationBean buildUreportServlet(){
        return new ServletRegistrationBean(new UReportServlet(), "/ureport/*");
    }

}
