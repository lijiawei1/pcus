package org.zap.framework.security.entity;

import javax.servlet.http.HttpSession;

/**
 * 获取session信息
 *
 * Created by Shin on 2016/5/3.
 */
public class SessionInfo {

    /**
     * SESSIONID
     */
    String id;

    /**
     * 是否登录
     */
    boolean logon;

    /**
     * SESSION创建时间
     */
    long creationTime;
    /**
     *
     */
    int maxInactiveInterval;
    /**
     * 最后请求时间，可以认为是最后操作时间
     */
    long lastAccessedTime;

    public SessionInfo(HttpSession httpSession) {
        id = httpSession.getId();
        creationTime = httpSession.getCreationTime();
        maxInactiveInterval = httpSession.getMaxInactiveInterval();
        lastAccessedTime = httpSession.getLastAccessedTime();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(long creationTime) {
        this.creationTime = creationTime;
    }

    public int getMaxInactiveInterval() {
        return maxInactiveInterval;
    }

    public void setMaxInactiveInterval(int maxInactiveInterval) {
        this.maxInactiveInterval = maxInactiveInterval;
    }

    public long getLastAccessedTime() {
        return lastAccessedTime;
    }

    public void setLastAccessedTime(long lastAccessedTime) {
        this.lastAccessedTime = lastAccessedTime;
    }

    public boolean isLogon() {
        return logon;
    }

    public void setLogon(boolean logon) {
        this.logon = logon;
    }
}
