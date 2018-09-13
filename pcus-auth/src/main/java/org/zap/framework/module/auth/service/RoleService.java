
package org.zap.framework.module.auth.service;

import org.apache.commons.lang.StringUtils;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.Privilege;
import org.zap.framework.module.auth.entity.ReGroupRole;
import org.zap.framework.module.auth.entity.ReUserRole;
import org.zap.framework.module.auth.entity.Role;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@CacheConfig(cacheNames = {AuthConstants.CACHE_PRIVILEGE})
public class RoleService extends BusiService {

	/**
	 * 校验角色编码、角色名唯一
	 */
	public boolean checkRoleUnique(String id, String rolecode, String rolename) {

		StringBuilder builder = new StringBuilder(" AR.DR = 0 AND (AR.ROLECODE = ? OR AR.ROLENAME = ? )");
		List<Object> plist = new ArrayList<Object>();
		plist.add(rolecode);
		plist.add(rolename);

		if (!StringUtils.isBlank(id)) {
			builder.append(" AND AR.ID <> ? ");
			plist.add(id);
		}


		List<Role> list = queryByClause(Role.class, builder.toString(), plist.toArray());
		return list == null || list.size() == 0;
	}

	/**
	 * 加载角色
	 * @param role
	 */
	public List<Role> loadRoles(Role role) {
		return getBaseDao().getQuery(Role.class)
				.eq("dr", 0)
				.eq("corp_id", role.getCorp_id())
				.like("rolename", role.getRolename()).list();
        //return getBaseDao().queryByClause(Role.class, " AR.DR = 0 AND AR.CORP_ID = ? AND AR.ROLENAME LIKE '%' || ? ", role.getCorp_id(), role.getRolename());
	}

	/**
	 * 增加角色
	 */
	@CacheEvict(allEntries = true)
	public Role add(Role entity) {

		if (!checkRoleUnique(entity.getId(), entity.getRolecode(), entity.getRolename())) {
			throw new BusinessException(String.format("角色已存在[%s:%s]", entity.getRolecode(), entity.getRolename()));
		}

		LocalDateTime now = LocalDateTime.now();
		entity.setCreate_time(now);
		entity.setModify_time(now);
		insert(entity);
		return entity;
	}

	/**
	 * 更新
	 */
	@CacheEvict(allEntries = true)
	public Role update(Role entity) {

		//检查是否系统角色
		Role roleFromDb = queryByPrimaryKey(Role.class, entity.getId());
		if (AuthConstants.ROLE_SET.containsKey(roleFromDb.getRolecode())) {
			throw new BusinessException(String.format("系统角色[%s:%s]不能修改", roleFromDb.getRolecode(), roleFromDb.getRolename()));
		}

		if (!checkRoleUnique(entity.getId(), entity.getRolecode(), entity.getRolename())) {
			throw new BusinessException(String.format("角色已存在[%s:%s]", entity.getRolecode(), entity.getRolename()));
		}

		entity.setModify_time(LocalDateTime.now());
		super.update(entity);

		//TODO 如果修改的是角色编码
		//清空用户登录缓存
//		ehUserCache.removeUserFromCache(user.getUsername());

		return entity;
	}

	/**
	 * 删除用户
	 */
	@CacheEvict(allEntries = true)
	public void remove(Role role) {

		//检查是否系统角色
		Role roleFromDb = queryByPrimaryKey(Role.class, role.getId());
		if (AuthConstants.ROLE_SET.containsKey(roleFromDb.getRolecode())) {
			throw new BusinessException(String.format("系统角色[%s:%s]不能删除", roleFromDb.getRolecode(), roleFromDb.getRolename()));
		}

		role.setDr(1);
		super.update(role);
	}

	/**
	 * 删除角色前检查
	 */
	public boolean removeBefore(Role role) {
		return check(role);
	}

	private boolean check(Role role) {
		int count = baseDao.getQuery(ReUserRole.class).eq("dr", 0).eq("role_id", role.getId()).count();
		if (count != 0)
			throw new BusinessException("角色已经分配用户");

		count = baseDao.getQuery(Privilege.class).eq("dr", 0).eq("subject_id", role.getId()).count();
		if (count != 0)
			throw new BusinessException("角色已经分配权限");

		count = baseDao.getQuery(ReGroupRole.class).eq("dr", 0).eq("role_id", role.getId()).count();
		if (count != 0)
			throw new BusinessException("角色已经分配用户组");

		return count != 0;
	}

}
