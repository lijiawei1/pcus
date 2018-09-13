package org.zap.framework.module.org.service;

import org.apache.commons.lang.StringUtils;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zap.framework.common.entity.pagination.PaginationSupport;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.orm.base.BaseEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 公司操作接口
 * @author Shin
 *
 */
@Service
@Transactional
@CacheConfig(cacheNames = { "corp" })
public class CorpService extends BusiService {

	/**
	 * 增加公司
	 * @param corp
	 */
	public void add(Corp corp) {

		List<Corp> list = getBaseDao().queryByClause(Corp.class, " OC.ID = ? AND OC.DR = 0", corp.getPid());

		if (list == null || list.size() == 0) {
			throw new BusinessException("父公司[" + corp.getPname() + "]已被删除，请刷新");
		}
		
		String parentSn = list.get(0).getSn();
		//最大编号
		Corp maxNo = null;
		PaginationSupport<Corp> page = baseDao.getQuery(Corp.class).eq("pid", corp.getPid()).sort("sn", false).page(1, 1);
		if (page.getTotalCount() > 0) {
			maxNo = page.getData().get(0);
		}

		if (maxNo == null) {
			corp.setSn(parentSn + "001");
		} else {
			//编码长度为3位
			String last3 = maxNo.getSn().substring(StringUtils.length(maxNo.getSn()) - 3);
			corp.setSn(parentSn + StringUtils.leftPad(String.valueOf(Integer.parseInt(last3) + 1), 3, "0"));
		}
		
		LocalDateTime now = LocalDateTime.now();
		corp.setCreate_time(now);
		corp.setModify_time(now);

		baseDao.insert(corp);
	}

	/**
	 * 
	 * @param corp
	 */
	public Corp update(Corp corp) {
		//TODO 判断是否修改了父公司
		super.update(corp);
		return corp;
	}
	
	/**
	 * 公司更新部分字段
	 */
	public int updatePartFields(Corp corp, String[] fields) {

		List<String> fieldlist = new ArrayList<String>();
		if (fields != null) {
			Collections.addAll(fieldlist, fields);
		}
		fieldlist.remove("sn");
		int r = super.update(corp, fieldlist.toArray(new String[fieldlist.size()]), true);
		
		//清空用户缓存
		return r;
	}
	
	
	/**
	 * 加载公司树
	 * @param user
	 */
	public List<Corp> loadCorps(final User user) {
		return getQuery(Corp.class).eq("DR", 0)
				//.rightLike("SN", user.getCorpsn())
				.list();
	}

}
