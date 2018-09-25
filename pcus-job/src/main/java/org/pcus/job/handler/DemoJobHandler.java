package org.pcus.job.handler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.zap.framework.module.auth.entity.Role;
import org.zap.framework.orm.dao.IBaseDao;

import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.IJobHandler;
import com.xxl.job.core.handler.annotation.JobHandler;
import com.xxl.job.core.log.XxlJobLogger;

@JobHandler(value="demoJobHandler")
@Component
public class DemoJobHandler extends IJobHandler {

	@Autowired
	IBaseDao baseDao;
	
	@Override
	public ReturnT<String> execute(String param) throws Exception {
		
		XxlJobLogger.log("XXL-JOB, Hello World.");
		
		//有数据库操作
		List<Role> roleList = baseDao.queryByClause(Role.class, "");
		
		System.out.println(roleList.size());
		
		return SUCCESS;
	}

}
