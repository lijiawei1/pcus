package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 用户组
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_USERGROUP", alias="AUG")
public class UserGroup extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3420620542803315192L;
	
	@JdbcColumn
	private String pid;
	
	@JdbcColumn
	private String groupname;
	
	@JdbcColumn
	private String groupcode;
	
	@JdbcOne(alias = "AUG1", column = "GROUPNAME", foreignKey = "PID", joinObject = UserGroup.class)
	private String pname;

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getGroupname() {
		return groupname;
	}

	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}

	public String getPname() {
		return pname;
	}

	public void setPname(String pname) {
		this.pname = pname;
	}

	public String getGroupcode() {
		return groupcode;
	}

	public void setGroupcode(String groupcode) {
		this.groupcode = groupcode;
	}
	
	
}
