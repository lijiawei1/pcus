package org.zap.framework.module.auth.entity;

/**
 * 用户注册实体，邮箱/手机
 * Created by Shin on 2016/1/25.
 */
public class UserRegisterInfo {

    /**
     * 昵称
     */
    private String name;
    /**
     * 账号
     */
    private String account;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 手机号码
     */
    private String mobile;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 邮箱验证码
     */
    private String email_verify_code;
    /**
     * 手机验证码
     */
    private String mobile_verify_code;
    /**
     * 图片验证码
     */
    private String image_verify_code;
    /**
     * 公司主键
     */
    private String corp_id;
    /**
     * 部门
     */
    private String dept_id;
    /**
     * 是否创建公司组织
     */
    private boolean create_corp;
    /**
     * 用户类型
     */
    private String ext_type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmail_verify_code() {
        return email_verify_code;
    }

    public void setEmail_verify_code(String email_verify_code) {
        this.email_verify_code = email_verify_code;
    }

    public String getMobile_verify_code() {
        return mobile_verify_code;
    }

    public void setMobile_verify_code(String mobile_verify_code) {
        this.mobile_verify_code = mobile_verify_code;
    }

    public String getImage_verify_code() {
        return image_verify_code;
    }

    public void setImage_verify_code(String image_verify_code) {
        this.image_verify_code = image_verify_code;
    }

    public String getCorp_id() {
        return corp_id;
    }

    public void setCorp_id(String corp_id) {
        this.corp_id = corp_id;
    }

    public boolean isCreate_corp() {
        return create_corp;
    }

    public void setCreate_corp(boolean create_corp) {
        this.create_corp = create_corp;
    }

    public String getDept_id() {
        return dept_id;
    }

    public void setDept_id(String dept_id) {
        this.dept_id = dept_id;
    }

    public String getExt_type() {
        return ext_type;
    }

    public void setExt_type(String ext_type) {
        this.ext_type = ext_type;
    }
}
