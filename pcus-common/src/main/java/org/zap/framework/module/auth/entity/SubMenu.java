package org.zap.framework.module.auth.entity;

import org.zap.framework.orm.annotation.JdbcColumn;
import org.zap.framework.orm.annotation.JdbcTable;
import org.zap.framework.orm.itf.ITree;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 子菜单
 *
 * Created by Shin on 2016/4/26.
 */
@JdbcTable(value = "ZAP_AUTH_MENU", alias = "AM", view = true)
public class SubMenu implements Serializable, ITree {

    @JdbcColumn
    String id;

    @JdbcColumn
    String pid;

    @JdbcColumn
    String name;

    @JdbcColumn
    String url;

    boolean checked;

    List<SubMenu> children = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public List<SubMenu> getChildren() {
        return children;
    }

    public void setChildren(List<SubMenu> children) {
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
