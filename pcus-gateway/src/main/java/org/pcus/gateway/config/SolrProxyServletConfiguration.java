package org.pcus.gateway.config;

import org.pcus.gateway.proxy.ProxyPlusServlet;
import org.springframework.boot.bind.RelaxedPropertyResolver;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class SolrProxyServletConfiguration implements EnvironmentAware {

  @Bean
  public ServletRegistrationBean servletRegistrationBean(){
    ServletRegistrationBean servletRegistrationBean = new ServletRegistrationBean(new ProxyPlusServlet(), propertyResolver.getProperty("servlet_url"));
    servletRegistrationBean.setName("name1");
    servletRegistrationBean.addInitParameter("targetUri", propertyResolver.getProperty("target_url"));
    servletRegistrationBean.addInitParameter(ProxyPlusServlet.P_LOG, propertyResolver.getProperty("logging_enabled", "false"));
    return servletRegistrationBean;
  }

  private RelaxedPropertyResolver propertyResolver;

  @Override
  public void setEnvironment(Environment environment) {
    this.propertyResolver = new RelaxedPropertyResolver(environment, "proxy.solr.");
  }
}
