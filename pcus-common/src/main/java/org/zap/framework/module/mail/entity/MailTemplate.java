package org.zap.framework.module.mail.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 邮件模板
 * Created by Shin on 2016/1/12.
 */
@JdbcTable(value = "ZAP_MAIL_TEMPLATE", alias = "MT")
public class MailTemplate extends BusiEntity {

    /**
     * 模板名称
     */
    @JdbcColumn
    String name;
    /**
     * 模板编码
     */
    @JdbcColumn
    String code;
    /**
     * 模板内容
     */
    @JdbcColumn
    String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
