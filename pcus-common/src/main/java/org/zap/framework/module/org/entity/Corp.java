package org.zap.framework.module.org.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcOne;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 公司
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_ORG_CORP", alias="OC")
public class Corp extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5568744358591717625L;

	/**
	 * 上级公司
	 */
	@JdbcColumn
	private String pid;
	/**
	 * 公司名称
	 */
	@JdbcColumn
	private String name;
	
	/**
	 * 公司编码
	 */
	@JdbcColumn
	private String code;
	/**
	 * 编号
	 */
	@JdbcColumn
	private String sn;
	/**
	 * 简称
	 */
	@JdbcColumn
	private String shortname;
	
	/**
	 * 外文名称
	 */
	@JdbcColumn
	private String foreignname;
	
	/**
	 * 扩展类型
	 */
	@JdbcColumn
	private String ext_type;
	
	/**
	 * 扩展表主键
	 */
	@JdbcColumn
	private String ext_id;
	
	
	@JdbcOne(alias = "OC1", column = "NAME", foreignKey = "PID", joinObject = Corp.class)
	private String pname;

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

	public String getShortname() {
		return shortname;
	}

	public void setShortname(String shortname) {
		this.shortname = shortname;
	}

	public String getForeignname() {
		return foreignname;
	}

	public void setForeignname(String foreignname) {
		this.foreignname = foreignname;
	}

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
