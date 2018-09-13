package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;


@JdbcTable(value="ZAP_AUTH_PRIVILEGE", alias="AP")
public class Privilege extends BusiEntity {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5730855870286332205L;
	/**
	 * 主体类型
	 */
	@JdbcColumn
	private String subject_type;
	/**
	 * 客体类型
	 */
	@JdbcColumn
	private String object_type;
	/**
	 * 主体ID
	 */
	@JdbcColumn
	private String subject_id;
	/**
	 * 对象ID
	 */
	@JdbcColumn
	private String object_id;
	/**
	 * 可授权
	 */
	@JdbcColumn
	private boolean authorizable;
	/**
	 * 可访问
	 */
	@JdbcColumn
	private boolean accessible;
	
	public boolean isAuthorizable() {
		return authorizable;
	}
	public void setAuthorizable(boolean authorizable) {
		this.authorizable = authorizable;
	}
	public boolean isAccessible() {
		return accessible;
	}
	public void setAccessible(boolean accessible) {
		this.accessible = accessible;
	}
	public String getSubject_type() {
		return subject_type;
	}
	public void setSubject_type(String subject_type) {
		this.subject_type = subject_type;
	}
	public String getObject_type() {
		return object_type;
	}
	public void setObject_type(String object_type) {
		this.object_type = object_type;
	}
	public String getSubject_id() {
		return subject_id;
	}
	public void setSubject_id(String subject_id) {
		this.subject_id = subject_id;
	}
	public String getObject_id() {
		return object_id;
	}
	public void setObject_id(String object_id) {
		this.object_id = object_id;
	}
	
	
	
}
