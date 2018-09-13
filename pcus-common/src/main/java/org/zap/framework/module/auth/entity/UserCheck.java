package org.zap.framework.module.auth.entity;

import org.apache.commons.lang.StringUtils;

import java.io.Serializable;

/**
 * Created by Shin on 2016/4/29.
 */
public class UserCheck implements Serializable {

    private String id;

    private String name;

    private String email;

    private String account;

    private String mobile;

    boolean checked;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return StringUtils.defaultIfBlank(name,
                StringUtils.defaultIfBlank(account,
                        StringUtils.defaultIfBlank(email, mobile)));
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setCheck(boolean check) {
        this.checked = check;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }
}
