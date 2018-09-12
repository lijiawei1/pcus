package org.zap.framework.security.authority;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

/**
 *
 *
 * Created by Shin on 2016/5/11.
 */
public class EnhanceGrantedAuthority implements GrantedAuthority {

    private final String id;

    private final String code;

    private final String name;

    private final String type;

    public EnhanceGrantedAuthority(String id, String rolecode, String rolename) {
        this.id = id;
        this.code = rolecode;
        this.name = rolename;
        this.type = "role";
    }

    public EnhanceGrantedAuthority(String id, String subject, String subject_name, String type) {
        Assert.hasText(id, "权限实体ID不能为空");
        Assert.hasText(subject, "A granted authority textual representation is required");
        this.id = id;
        this.code = subject;
        this.name = subject_name;
        this.type = StringUtils.defaultIfBlank(type, "role");
    }

    public String getAuthority() {
        return id;
    }

    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }

        if (obj instanceof EnhanceGrantedAuthority) {
            return code.equals(((EnhanceGrantedAuthority) obj).code);
        }

        return false;
    }

    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public int hashCode() {
        return this.code.hashCode();
    }

    public String toString() {
        return this.code;
    }
}
