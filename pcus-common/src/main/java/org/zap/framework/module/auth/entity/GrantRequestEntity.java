package org.zap.framework.module.auth.entity;

import java.util.List;

/**
 * Created by Shin on 2016/4/22.
 */
public class GrantRequestEntity {

    private String parentMenuNo;

    private List<Role> roleList;

    public String getParentMenuNo() {
        return parentMenuNo;
    }

    public List<Role> getRoleList() {
        return roleList;
    }
}
