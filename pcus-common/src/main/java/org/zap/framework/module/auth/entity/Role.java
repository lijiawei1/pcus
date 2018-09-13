package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

import java.util.ArrayList;
import java.util.List;

/**
 * 角色表
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_ROLE", alias="AR")
public class Role extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 823651262961001684L;
	
	@JdbcColumn
	private String pid;
	
	@JdbcColumn
	private String rolecode;
	
	@JdbcColumn
	private String rolename; 

	@JdbcOne(alias = "OC1", column = "NAME", foreignKey = "CORP_ID", joinObject = Corp.class)
	private String corpname;
	
	/**
	 * 附加字段:
	 * ischecked 对应树形选中
	 */
	private String ischecked;
	
	/**
	 * 角色
	 */
	private List<Privilege> privileges = new ArrayList<Privilege>();
	
	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getRolename() {
		return rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

	public String getRolecode() {
		return rolecode;
	}

	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}

	public String getCorpname() {
		return corpname;
	}

	public void setCorpname(String corpname) {
		this.corpname = corpname;
	}

	public String getIschecked() {
		return ischecked;
	}

	public void setIschecked(String ischecked) {
		this.ischecked = ischecked;
	}
	
	public List<Privilege> getPrivileges() {
		return privileges;
	}

	public void setPrivileges(List<Privilege> privileges) {
		this.privileges = privileges;
	}
	
	
}
