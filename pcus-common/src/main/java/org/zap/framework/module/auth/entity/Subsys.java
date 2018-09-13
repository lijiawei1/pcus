package org.zap.framework.module.auth.entity;

import org.zap.framework.common.entity.BusiEntity;
import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

/**
 * 业务子系统信息
 */
@JdbcTable(value = "ZAP_AUTH_SUBSYS", alias = "S")
public class Subsys extends BusiEntity {

//    /**
//     * 备注
//     */
//    @JdbcColumn
//    String remark;
//    /**
//     * 状态
//     */
//    @JdbcColumn
//    String state;
    /**
     * 系统名称
     */
    @JdbcColumn
    String sys_name;
    /**
     * 系统代码
     */
    @JdbcColumn
    String sys_code;
    /**
     * 系统描述
     */
    @JdbcColumn
    String sys_desc;

    /**
     * 服务简称
     */
    @JdbcColumn
    String sys_ename;

//    public String getState() {
//        return state;
//    }
//
//    public void setState(String state) {
//        this.state = state;
//    }

    public String getSys_name() {
        return sys_name;
    }

    public void setSys_name(String sys_name) {
        this.sys_name = sys_name;
    }

    public String getSys_code() {
        return sys_code;
    }

    public void setSys_code(String sys_code) {
        this.sys_code = sys_code;
    }

    public String getSys_desc() {
        return sys_desc;
    }

    public void setSys_desc(String sys_desc) {
        this.sys_desc = sys_desc;
    }

    public String getSys_ename() {
        return sys_ename;
    }

    public void setSys_ename(String sys_ename) {
        this.sys_ename = sys_ename;
    }
}
