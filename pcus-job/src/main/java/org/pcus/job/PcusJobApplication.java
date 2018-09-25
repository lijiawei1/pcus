package org.pcus.job;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.orm.dao.IBaseDao;
import org.zap.framework.orm.dao.impl.BaseDao;

@SpringBootApplication(scanBasePackages = {
		"org.zap.framework.common",
		"org.pcus.job",
})
public class PcusJobApplication {
	public static void main(String[] args) {
		SpringApplication.run(PcusJobApplication.class, args);
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
}
