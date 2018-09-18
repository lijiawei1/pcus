package org.zap.framework.module.auth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.zap.framework.security.entity.EnhanceGrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

/**
 * 系统用户表
 * @author Shin
 *
 */
public class UserDTO implements UserDetails {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 4293160150150650244L;
	
	private String id;

	private String corp_id;

	private String dept_id;
	/**
	 * 用户账号
	 */
	
	private String account;
	/**
	 * 密码
	 */
	
	private String password;
	/**
	 * 人员档案名称
	 */
	
	private String name;
	/**
	 * 账户是否有效
	 */
	
	private boolean enabled;
	/**
	 * 最后登录IP
	 */
	
	private String last_login_ip;
	/**
	 *  最后登录时间 
	 **/
	
	private LocalDateTime last_login_time;
	/**
	 * 生效时间
	 */
	
	private LocalDateTime enabled_time;
	/**
	 * 失效时间
	 */
	
	private LocalDateTime expired_time;
	/**
	 * 账户没有过期
	 */
	
	private boolean is_account_non_expired;
	/**
	 * 账户没有被锁定
	 */
	
	private boolean is_account_non_locked;
	/**
	 * 证书没有过期
	 */
	
	private boolean is_credentials_non_expired;
	/**
	 *  是否管理员
	 */
	
	private boolean admin;
	/**
	 * 扩展类型
	 */
	
	private String ext_type;
	/**
	 * 扩展表主键
	 */
	
	private String ext_id;
	/**
	 * 手机号
	 */
	
	private String mobile;
	/**
	 *  启用手机号登录
	 */
	
	private boolean mobile_enabled;
	/**
	 * qq号码
	 */
	
	private String qqno;
	/**
	 * 启用qq号登录
	 */
	
	private boolean qqno_enabled;
	/**
	 * 微信号
	 */
	
	private String wechatno;
	/**
	 * 启用微信登录
	 */
	
	private boolean wechatno_enabled;
	/**
	 * 邮箱号
	 */
	
	private String email;
	/**
	 * 启用邮箱登录
	 */
	
	private boolean email_enabled;

	
	private String target_url;

	/**************************
	 * 关联字段
	 **************************/
	/**
	 * 公司名称
	 * LC0.NAME   LO0.ID=AU.CORP_ID
	 */
	private String corpname;
	/**
	 * 公司编码
	 */
	private String corpsn;
	/**
	 * 部门名称
	 */
	private String deptname;
	
	/************************
	 * 权限相关
	 ************************/
	/**
	 * 权限
	 */
	private Collection<EnhanceGrantedAuthority> authorities = new ArrayList<EnhanceGrantedAuthority>();
	/**
	 * 角色
	 */
	//private List<Role> roles = new ArrayList<Role>();
	/**
	 * 原用户名
	 */
	private String old_account;
	/**
	 * 用户账号(系统认证)
	 */
	private String username;
	/**
	 * 确认密码
	 */
	private String confirm_password;
	
	//public List<Role> getRoles() {
	//	return roles;
	//}

	//public void setRoles(List<Role> roles) {
	//	this.roles = roles;
	//}

	/**
	 * USERDETAIL接口
	 */
	public Collection<EnhanceGrantedAuthority> getAuthorities() {
		return authorities;
	}

	/**
	 * 获取角色字符串
	 * @return
     */
	public String getPassword() {
		return this.password;
	}

	public String getConfirm_password() {
		return confirm_password;
	}

	public void setConfirm_password(String confirm_password) {
		this.confirm_password = confirm_password;
	}

	/**
	 * 获取用户名
	 * @return
	 */
	public String getUsername() {

		if (StringUtils.isNotBlank(username)) {
			return username;
		}

		if (StringUtils.isNotBlank(account)) {
			return account;
		}

		if (email_enabled && StringUtils.isNotBlank(email)) {
			return email;
		}

		if (mobile_enabled && StringUtils.isNotBlank(mobile)) {
			return mobile;
		}

		return "";
	}
	
	public boolean isAccountNonExpired() {
		return this.is_account_non_expired;
	}

	public boolean isAccountNonLocked() {
		return this.is_account_non_locked;
	}

	public boolean isCredentialsNonExpired() {
		return this.is_credentials_non_expired;
	}

	public boolean isEnabled() {
		return this.enabled;
	}

	/**
	 * 
	 */
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLast_login_ip() {
		return last_login_ip;
	}

	public void setLast_login_ip(String last_login_ip) {
		this.last_login_ip = last_login_ip;
	}

	public LocalDateTime getLast_login_time() {
		return last_login_time;
	}

	public void setLast_login_time(LocalDateTime last_login_time) {
		this.last_login_time = last_login_time;
	}

	public LocalDateTime getEnabled_time() {
		return enabled_time;
	}

	public void setEnabled_time(LocalDateTime enabled_time) {
		this.enabled_time = enabled_time;
	}

	public LocalDateTime getExpired_time() {
		return expired_time;
	}

	public void setExpired_time(LocalDateTime expired_time) {
		this.expired_time = expired_time;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public boolean isIs_account_non_expired() {
		return is_account_non_expired;
	}

	public void setIs_account_non_expired(boolean is_account_non_expired) {
		this.is_account_non_expired = is_account_non_expired;
	}

	public boolean isIs_account_non_locked() {
		return is_account_non_locked;
	}

	public void setIs_account_non_locked(boolean is_account_non_locked) {
		this.is_account_non_locked = is_account_non_locked;
	}

	public boolean isIs_credentials_non_expired() {
		return is_credentials_non_expired;
	}

	public void setIs_credentials_non_expired(boolean is_credentials_non_expired) {
		this.is_credentials_non_expired = is_credentials_non_expired;
	}

	public String getCorpname() {
		return corpname;
	}

	public void setCorpname(String corpname) {
		this.corpname = corpname;
	}

	public String getCorpsn() {
		return corpsn;
	}

	public void setCorpsn(String corpsn) {
		this.corpsn = corpsn;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	@JsonIgnore
	public String getOld_account() {
		return old_account;
	}

	public void setOld_account(String old_account) {
		this.old_account = old_account;
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

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getQqno() {
		return qqno;
	}

	public void setQqno(String qqno) {
		this.qqno = qqno;
	}

	public String getWechatno() {
		return wechatno;
	}

	public void setWechatno(String wechatno) {
		this.wechatno = wechatno;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getTarget_url() {
		return target_url;
	}

	public void setTarget_url(String target_url) {
		this.target_url = target_url;
	}

	public boolean isMobile_enabled() {
		return mobile_enabled;
	}

	public void setMobile_enabled(boolean mobile_enabled) {
		this.mobile_enabled = mobile_enabled;
	}

	public boolean isQqno_enabled() {
		return qqno_enabled;
	}

	public void setQqno_enabled(boolean qqno_enabled) {
		this.qqno_enabled = qqno_enabled;
	}

	public boolean isWechatno_enabled() {
		return wechatno_enabled;
	}

	public void setWechatno_enabled(boolean wechatno_enabled) {
		this.wechatno_enabled = wechatno_enabled;
	}

	public boolean isEmail_enabled() {
		return email_enabled;
	}

	public void setEmail_enabled(boolean email_enabled) {
		this.email_enabled = email_enabled;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDeptname() {
		return deptname;
	}

	public void setDeptname(String deptname) {
		this.deptname = deptname;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCorp_id() {
		return corp_id;
	}

	public void setCorp_id(String corp_id) {
		this.corp_id = corp_id;
	}

	public String getDept_id() {
		return dept_id;
	}

	public void setDept_id(String dept_id) {
		this.dept_id = dept_id;
	}

	@Override
	public boolean equals(Object rhs) {
		if (rhs instanceof UserDTO) {
			return StringUtils.equals(getUsername(), ((UserDTO) rhs).getUsername());
		}
		return false;
	}

	public void setAuthorities(Collection<EnhanceGrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	/**
	 * Returns the hashcode of the {@code username}.
	 */
	@Override
	public int hashCode() {
		return getUsername().hashCode();
	}
}
