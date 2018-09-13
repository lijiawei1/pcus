package org.zap.framework.module.org.entity;

import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;

@JdbcTable(value="ZAP_ORG_CORP", alias="OC")
public class VCorp extends Corp {
    @JdbcColumn
    String pname;

    public String getPname() {
        return pname;
    }

    public void setPname(String pname) {
        this.pname = pname;
    }
}
