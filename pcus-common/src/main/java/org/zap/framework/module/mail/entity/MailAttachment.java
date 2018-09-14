package org.zap.framework.module.mail.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * Created by Shin on 2016/1/11.
 */
@JdbcTable(value = "ZAP_MAIL_ATTACHMENT", alias = "MA")
public class MailAttachment extends BusiEntity {

    /**
     * 邮件主键
     */
    @JdbcColumn
    String mst_id;
    /**
     * 附件名称
     */
    @JdbcColumn
    String name;
    /**
     * 附件地址
     */
    @JdbcColumn
    String path;
    /**
     * 附件类型
     */
    @JdbcColumn
    String type;

    public String getMst_id() {
        return mst_id;
    }

    public void setMst_id(String mst_id) {
        this.mst_id = mst_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
