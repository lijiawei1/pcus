package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 组用户关联表
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_RE_GROUP_USER", alias="ARGU")
public class ReGroupUser extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@JdbcColumn
	private String user_id;
	
	@JdbcColumn
	private String group_id;
	
	@JdbcOne(alias = "A", column = "account", foreignKey = "user_id", joinObject = User.class)
	private String account;
	@JdbcOne(alias = "B", column = "name", foreignKey = "user_id", joinObject = User.class)
	private String name;
	@JdbcOne(alias = "C", column = "corpname", foreignKey = "user_id", joinObject = User.class)
	private String corpname;
	
	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getGroup_id() {
		return group_id;
	}

	public void setGroup_id(String group_id) {
		this.group_id = group_id;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCorpname() {
		return corpname;
	}

	public void setCorpname(String corpname) {
		this.corpname = corpname;
	}
	
}
