package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 组用户关联表
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_RE_GROUP_ROLE", alias="ARGU")
public class ReGroupRole extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@JdbcColumn
	private String role_id;
	
	@JdbcColumn
	private String group_id;

	public String getRole_id() {
		return role_id;
	}

	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}

	public String getGroup_id() {
		return group_id;
	}

	public void setGroup_id(String group_id) {
		this.group_id = group_id;
	}

}
