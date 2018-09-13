package org.zap.framework.module.org.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 部门
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_ORG_DEPT", alias="OD")
public class Dept extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 223408234465279827L;

	/**
	 * 上级部门
	 */
	@JdbcColumn
	private String pid;
	
	/**
	 * 部门名称
	 */
	@JdbcColumn
	private String name;
	
	/**
	 * 部门编码
	 */
	@JdbcColumn
	private String code;
	
	/**
	 * 父级部门名称
	 */
	@JdbcOne(alias = "OD1", column = "name", foreignKey = "pid", joinObject = Dept.class)
	private String pname;
	
	
	@JdbcColumn
	private String sn;
	
	@JdbcColumn
	private String type;
	
	@JdbcColumn
	private int morder;
	
	@JdbcColumn
	private String ext_type;
	
	@JdbcColumn
	private String ext_id;

	public String getPname() {
		return pname;
	}

	public void setPname(String pname) {
		this.pname = pname;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getMorder() {
		return morder;
	}

	public void setMorder(int morder) {
		this.morder = morder;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getExt_type() {
		return ext_type;
	}

	public void setExt_type(String ext_type) {
		this.ext_type = ext_type;
	}

	public String getExt_id() {
		return ext_id;
	}

	public void setExt_id(String ext_id) {
		this.ext_id = ext_id;
	}
	
}
