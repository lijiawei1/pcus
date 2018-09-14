package org.zap.framework.module.mail.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * Created by Shin on 2016/1/11.
 */
@JdbcTable(value="ZAP_MAIL_CONFIG", alias="MC")
public class MailConfig extends BusiEntity {

    /**
     * 服务编码
     */
    @JdbcColumn
    String code;
    /**
     * 服务类型
     */
    @JdbcColumn
    String server_type;
    /**
     * 服务地址
     */
    @JdbcColumn
    String server_address;
    /**
     * 服务端口
     */
    @JdbcColumn
    String server_port;
    /**
     * 发送账号
     */
    @JdbcColumn
    String account;
    /**
     * 发送密码
     */
    @JdbcColumn
    String password;
    /**
     * 邮件回复地址
     */
    @JdbcColumn
    String reply_address;
    /**
     * 邮件编码
     */
    @JdbcColumn
    String mail_code;
    /**
     * 邮件地址
     */
    @JdbcColumn
    String mail_address;
    /**
     * html格式
     */
    @JdbcColumn
    boolean html;
    /**
     * ssl加密
     */
    @JdbcColumn
    boolean ssl;

    public String getServer_type() {
        return server_type;
    }

    public void setServer_type(String server_type) {
        this.server_type = server_type;
    }

    public String getServer_address() {
        return server_address;
    }

    public void setServer_address(String server_address) {
        this.server_address = server_address;
    }

    public String getServer_port() {
        return server_port;
    }

    public void setServer_port(String server_port) {
        this.server_port = server_port;
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

    public String getReply_address() {
        return reply_address;
    }

    public void setReply_address(String reply_address) {
        this.reply_address = reply_address;
    }

    public String getMail_code() {
        return mail_code;
    }

    public void setMail_code(String mail_code) {
        this.mail_code = mail_code;
    }

    public String getMail_address() {
        return mail_address;
    }

    public void setMail_address(String mail_address) {
        this.mail_address = mail_address;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isHtml() {
        return html;
    }

    public void setHtml(boolean html) {
        this.html = html;
    }

    public boolean isSsl() {
        return ssl;
    }

    public void setSsl(boolean ssl) {
        this.ssl = ssl;
    }
}
