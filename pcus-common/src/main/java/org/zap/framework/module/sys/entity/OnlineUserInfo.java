package org.zap.framework.module.sys.entity;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.session.SessionInformation;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.security.entity.SessionInfo;
import org.zap.framework.security.utils.SecurityUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * 在线用户信息
 *
 * 扩展用户表，增加SESSION信息
 *
 * Created by Shin on 2016/4/29.
 */
public class OnlineUserInfo extends User {

    /**
     *
     */
    String sessionid;
    /**
     * 最后访问时间
     */
    LocalDateTime last_access_time;

    /**
     * 创建时间
     */
    LocalDateTime creation_time;
    /**
     * 非活动时长
     */
    long inactive_time;
    /**
     * 在线时长
     */
    long online_time;

    /**
     * 有效时长
     */
    int max_inactive_interval;

    public OnlineUserInfo(User user, SessionInformation sessionInformation) {
        //复制用户属性
        BeanUtils.copyProperties(user, this);
        //复制SESSION属性
        sessionid = sessionInformation.getSessionId();

        Date lastRequest = sessionInformation.getLastRequest();

        last_access_time = LocalDateTime.ofInstant(lastRequest.toInstant(), ZoneId.systemDefault());

        //SessionInfo session = SecurityUtils.getSession(sessionid);
        //
        //if (session != null) {
        //
        //    Date created = new Date(session.getCreationTime());
        //    //Date accessed = new Date(session.getLastAccessedTime());
        //    //创建时间
        //    creation_time = LocalDateTime.ofInstant(created.toInstant(), ZoneId.systemDefault());
        //
        //    //在线时长(分钟)
        //    online_time = creation_time.until(last_access_time, ChronoUnit.MINUTES);
        //    //非活动时长
        //    inactive_time = last_access_time.until(LocalDateTime.now(), ChronoUnit.MINUTES);
        //
        //    max_inactive_interval = session.getMaxInactiveInterval() / 60;
        //}

    }

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public LocalDateTime getLast_access_time() {
        return last_access_time;
    }

    public void setLast_access_time(LocalDateTime last_access_time) {
        this.last_access_time = last_access_time;
    }

    public long getInactive_time() {
        return inactive_time;
    }

    public void setInactive_time(long inactive_time) {
        this.inactive_time = inactive_time;
    }

    public LocalDateTime getCreation_time() {
        return creation_time;
    }

    public void setCreation_time(LocalDateTime creation_time) {
        this.creation_time = creation_time;
    }

    public long getOnline_time() {
        return online_time;
    }

    public void setOnline_time(long online_time) {
        this.online_time = online_time;
    }

    public int getMax_inactive_interval() {
        return max_inactive_interval;
    }

    public void setMax_inactive_interval(int max_inactive_interval) {
        this.max_inactive_interval = max_inactive_interval;
    }
}
