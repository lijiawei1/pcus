package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 子角色
 */
@JdbcTable(value = "ZAP_AUTH_SUBROLE", alias = "S")
public class Subrole extends BusiEntity {

    /**
     * 所属角色主键
     */
    @JdbcColumn
    String role_id;

    /**
     * 子系统主键
     */
    @JdbcColumn
    String subsys_id;
    /**
     * 上级角色
     */
    @JdbcColumn
    String pid;
    /**
     * 角色名称
     */
    @JdbcColumn
    String rolename;
    /**
     * 角色编码
     */
    @JdbcColumn
    String rolecode;

    public String getRole_id() {
        return role_id;
    }

    public void setRole_id(String role_id) {
        this.role_id = role_id;
    }

    public String getSubsys_id() {
        return subsys_id;
    }

    public void setSubsys_id(String subsys_id) {
        this.subsys_id = subsys_id;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getRolename() {
        return rolename;
    }

    public void setRolename(String rolename) {
        this.rolename = rolename;
    }

    public String getRolecode() {
        return rolecode;
    }

    public void setRolecode(String rolecode) {
        this.rolecode = rolecode;
    }
}
