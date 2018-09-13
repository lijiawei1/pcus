package org.zap.framework.module.org.service;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.common.entity.pagination.PaginationSupport;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.org.entity.Dept;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class DeptService  extends BusiService {

	public void save(Dept dept) {

		String parentSn = "";
		
		String pid = dept.getPid();
		if(pid!=null&&!"".equals(pid)){
			List<Dept> list = baseDao.getQuery(Dept.class).eq("id", dept.getPid()).eq("dr", 0).list();

			if (list == null || list.size() == 0) {
				throw new BusinessException("父部门[" + dept.getPname() + "]已被删除，请刷新");
			}
			parentSn = list.get(0).getSn();
		}

		// 最大编号
		Dept maxNo = null;
		PaginationSupport<Dept> page = baseDao.getQuery(Dept.class).eq("pid", dept.getPid()).sort("sn", false).page(1, 1);
		if (page.getTotalCount() > 0) {
			maxNo = page.getData().get(0);
		}

		if (maxNo == null) {
			dept.setSn(parentSn + "001");
		} else {
			// 编码长度为3位
			String last3 = maxNo.getSn().substring(StringUtils.length(maxNo.getSn()) - 3);
			dept.setSn(parentSn + StringUtils.leftPad(String.valueOf(Integer.parseInt(last3) + 1), 3, "0"));
		}

		saveEntity(dept);
	}

	public <T extends BusiEntity> int saveEntity(T entity) {

		String id = entity.getId();
		LocalDateTime now = LocalDateTime.now();
		if (StringUtils.isBlank(id)) {
			entity.setCreate_time(now);
			return baseDao.insert(entity);
		} else {
			//一致性
			entity.setModify_time(now);
			return checkOptimisticLock(baseDao.update(entity), 1);
		}
	}
}
