package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 租户表
 */
@JdbcTable(value = "ZAP_AUTH_TENANT", alias = "T")
public class Tenant extends BusiEntity {

    /**
     * 名称
     */
    @JdbcColumn
    String tenant_name;
    /**
     * 代码
     */
    @JdbcColumn
    String tenant_code;

    public String getTenant_name() {
        return tenant_name;
    }

    public void setTenant_name(String tenant_name) {
        this.tenant_name = tenant_name;
    }

    public String getTenant_code() {
        return tenant_code;
    }

    public void setTenant_code(String tenant_code) {
        this.tenant_code = tenant_code;
    }
}
