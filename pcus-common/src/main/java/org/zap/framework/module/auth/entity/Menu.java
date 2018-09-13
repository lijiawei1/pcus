package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;
import org.zap.framework.orm.itf.ITree;

import java.util.ArrayList;
import java.util.List;

/**
 * 菜单
 * @author Shin
 *
 */
@JdbcTable(value="ZAP_AUTH_MENU", alias="AM")
public class Menu extends BusiEntity implements ITree<Menu> {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2479793359005062559L;
	/**
	 * 
	 */
	@JdbcColumn
	private String pid;
	/**
	 */
	@JdbcColumn
	private String name;
	/**
	 */
	@JdbcColumn
	private String code;
	
	@JdbcColumn
	private String no;
	
	@JdbcColumn
	private int morder;
	/**
	 */
	@JdbcColumn
	private String url;
	/**
	 * 如果为空，取映射的地址
	 */
	@JdbcColumn
	private String intercept_url;
	/**
	 * 取消拦截
	 * 以下角色可访问ROLE_USER和ROLE_ANONYMOUS
	 *
	 */
	@JdbcColumn
	private boolean unintercept;
	/**
	 */
	@JdbcColumn
	private String icon;
	/**
	 */
	@JdbcColumn
	private boolean visible;
	/**
	 */
	@JdbcColumn
	private int mlevel;
	/**
	 */
	@JdbcColumn
	private boolean leaf;
	
	/**
	 * 
	 */
	private String ischecked;
	/**
	 * 
	 */
	private List<Menu> children = new ArrayList<Menu>();

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

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public int getMorder() {
		return morder;
	}

	public void setMorder(int morder) {
		this.morder = morder;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getMlevel() {
		return mlevel;
	}

	public void setMlevel(int mlevel) {
		this.mlevel = mlevel;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public List<Menu> getChildren() {
		return children;
	}

	public void setChildren(List<Menu> children) {
		this.children = children;
	}

	public String getIschecked() {
		return ischecked;
	}

	public void setIschecked(String ischecked) {
		this.ischecked = ischecked;
	}

	public String getIntercept_url() {
		return intercept_url;
	}

	public void setIntercept_url(String intercept_url) {
		this.intercept_url = intercept_url;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public boolean isUnintercept() {
		return unintercept;
	}

	public void setUnintercept(boolean unintercept) {
		this.unintercept = unintercept;
	}
}
