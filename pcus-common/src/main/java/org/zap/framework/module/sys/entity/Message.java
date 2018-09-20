package org.zap.framework.module.sys.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

@JdbcTable(value = "ZAP_SYS_MESSAGE", alias = "M")
public class Message extends BusiEntity {
    /**
     * 标题
     */
    @JdbcColumn
    String title;
    /**
     * 消息内容
     */
    @JdbcColumn
    String content;
    /**
     * 消息类型
     */
    @JdbcColumn
    String type;
    /**
     * 状态
     */
    @JdbcColumn
    String state;
    /**
     * 定时发送时间
     */
    @JdbcColumn
    String fix_time;
    /**
     * 接收人
     */
    @JdbcColumn
    String sendee;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getFix_time() {
        return fix_time;
    }

    public void setFix_time(String fix_time) {
        this.fix_time = fix_time;
    }

    public String getSendee() {
        return sendee;
    }

    public void setSendee(String sendee) {
        this.sendee = sendee;
    }
}
