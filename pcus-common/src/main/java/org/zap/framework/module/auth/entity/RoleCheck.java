package org.zap.framework.module.auth.entity;

import java.util.ArrayList;
import java.util.List;

/**
 * 角色选中
 * Created by Shin on 2016/4/22.
 */
public class RoleCheck extends Role {

    /**
     * 是否选中
     */
    boolean check;

    /**
     * 用户列表
     */
    List<UserCheck> users = new ArrayList<>();

    public boolean isCheck() {
        return check;
    }

    public void setCheck(boolean check) {
        this.check = check;
    }

    public List<UserCheck> getUsers() {
        return users;
    }

    public void setUsers(List<UserCheck> users) {
        this.users = users;
    }
}
