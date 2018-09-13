package org.zap.framework.module.auth.entity;

public class UserFilter {

	/**
	 * 所有用户
	 */
	public final static String ALL = "ALL";
	/**
	 * 普通用户
	 */
	public final static String PLAIN = "PLAIN";
	/**
	 * 锁定用户
	 */
	public final static String LOCKED = "LOCKED";
	
	/**
	 * 公司
	 */
	private String filtercorp;
	/**
	 * 过滤字段
	 */
	private String filterfield;
	/**
	 * 类型
	 */
	private String filtertype;
	/**
	 * 关键字
	 */
	private String filtername;
	
	public String getFiltercorp() {
		return filtercorp;
	}
	public void setFiltercorp(String filtercorp) {
		this.filtercorp = filtercorp;
	}
	public String getFilterfield() {
		return filterfield;
	}
	public void setFilterfield(String filterfield) {
		this.filterfield = filterfield;
	}
	public String getFiltertype() {
		return filtertype;
	}
	public void setFiltertype(String filtertype) {
		this.filtertype = filtertype;
	}
	public String getFiltername() {
		return filtername;
	}
	public void setFiltername(String filtername) {
		this.filtername = filtername;
	}
}
