package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 用户角色关联表
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_RE_USER_ROLE", alias="ARUR")
public class ReUserRole extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1550229486471342826L;

	@JdbcColumn
	private String role_id;
	
	@JdbcColumn
	private String user_id;

	public String getRole_id() {
		return role_id;
	}

	public void setRole_id(String role_id) {
		this.role_id = role_id;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	
	
}
