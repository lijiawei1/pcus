package org.zap.framework.module.sms.entity;

import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;
import org.zap.framework.orm.base.BaseEntity;

import java.time.LocalDateTime;

/**
 * 短信验证码实体
 *
 * @author Shin
 */
@JdbcTable(value = "zap_sys_code", alias = "zsc")
public class SmsCode extends BaseEntity {


    /**
     *
     */
    private static final long serialVersionUID = 1L;
    @JdbcColumn
    private int dr;
    //手机号
    @JdbcColumn
    private String mobile;
    //验证码
    @JdbcColumn
    private String checkcode;
    //IP
    @JdbcColumn
    private String ip;
    //创建时间
    @JdbcColumn
    private LocalDateTime create_time;
    //失效时间
    @JdbcColumn
    private LocalDateTime expired_time;
    //使用时间
    @JdbcColumn
    private LocalDateTime used_time;
    //是否已使用
    @JdbcColumn
    private boolean is_used;

    public int getDr() {
        return dr;
    }

    public void setDr(int dr) {
        this.dr = dr;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getCheckcode() {
        return checkcode;
    }

    public void setCheckcode(String checkcode) {
        this.checkcode = checkcode;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public LocalDateTime getCreate_time() {
        return create_time;
    }

    public void setCreate_time(LocalDateTime create_time) {
        this.create_time = create_time;
    }

    public LocalDateTime getExpired_time() {
        return expired_time;
    }

    public void setExpired_time(LocalDateTime expired_time) {
        this.expired_time = expired_time;
    }

    public LocalDateTime getUsed_time() {
        return used_time;
    }

    public void setUsed_time(LocalDateTime used_time) {
        this.used_time = used_time;
    }

    public boolean isIs_used() {
        return is_used;
    }

    public void setIs_used(boolean is_used) {
        this.is_used = is_used;
    }

}
