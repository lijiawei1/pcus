package org.zap.framework.module.mail.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 发件箱
 * Created by Shin on 2016/1/11.
 */
@JdbcTable(value = "ZAP_MAIL_OUTBOX", alias = "MO")
public class MailOutbox extends BusiEntity {

    @JdbcColumn
    String sender;
    @JdbcColumn
    String receiver;
    @JdbcColumn
    String title;
    @JdbcColumn
    String copyer;
    @JdbcColumn
    String secret;
    @JdbcColumn
    String content;
    @JdbcColumn
    String send_status;
    @JdbcColumn
    String send_time;
    @JdbcColumn
    String type;

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCopyer() {
        return copyer;
    }

    public void setCopyer(String copyer) {
        this.copyer = copyer;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSend_status() {
        return send_status;
    }

    public void setSend_status(String send_status) {
        this.send_status = send_status;
    }

    public String getSend_time() {
        return send_time;
    }

    public void setSend_time(String send_time) {
        this.send_time = send_time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
