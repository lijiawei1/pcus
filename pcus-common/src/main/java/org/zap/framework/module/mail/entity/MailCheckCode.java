package org.zap.framework.module.mail.entity;

import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;
import org.zap.framework.orm.base.BaseEntity;

import java.time.LocalDateTime;

/**
 * 邮件验证码
 * Created by Shin on 2016/1/11.
 */
@JdbcTable(value = "ZAP_MAIL_CHECKCODE", alias = "MC")
public class MailCheckCode extends BaseEntity {

    @JdbcColumn
    LocalDateTime create_time;
    @JdbcColumn
    String receiver;
    @JdbcColumn
    String check_code;
    @JdbcColumn
    String check_url;
    @JdbcColumn
    LocalDateTime expired_time;
    @JdbcColumn
    LocalDateTime used_time;
    @JdbcColumn
    boolean used;
    @JdbcColumn
    int dr;

    public LocalDateTime getCreate_time() {
        return create_time;
    }

    public void setCreate_time(LocalDateTime create_time) {
        this.create_time = create_time;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getCheck_code() {
        return check_code;
    }

    public void setCheck_code(String check_code) {
        this.check_code = check_code;
    }

    public String getCheck_url() {
        return check_url;
    }

    public void setCheck_url(String check_url) {
        this.check_url = check_url;
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

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public int getDr() {
        return dr;
    }

    public void setDr(int dr) {
        this.dr = dr;
    }
}
