package org.zap.framework.module.auth.entity;


/**
 * 资源实体
 * @author Shin
 *
 */
public class Resource {
	/**
	 * 访问URL
	 */
	public String intercept_url;
	/**
	 * 角色编码
	 */
	public String rolecode;
	/**
	 * 角色名称
	 */
	public String rolename;
	/**
	 * 是否可见
	 */
	public boolean visible;
	/**
	 * 是否可授予给下级角色
	 */
	public boolean grantable;

	public String getIntercept_url() {
		return intercept_url;
	}
	public void setIntercept_url(String intercept_url) {
		this.intercept_url = intercept_url;
	}
	
	public boolean isVisible() {
		return visible;
	}
	public void setVisible(boolean visible) {
		this.visible = visible;
	}
	public boolean isGrantable() {
		return grantable;
	}
	public void setGrantable(boolean grantable) {
		this.grantable = grantable;
	}
	public String getRolecode() {
		return rolecode;
	}
	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}
	public String getRolename() {
		return rolename;
	}
	public void setRolename(String rolename) {
		this.rolename = rolename;
	}
	

}
