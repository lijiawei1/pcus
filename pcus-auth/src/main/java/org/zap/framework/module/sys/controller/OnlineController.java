package org.zap.framework.module.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.sys.entity.OnlineUserInfo;
import org.zap.framework.security.utils.SecurityUtils;
import org.zap.framework.util.BuildUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * Created by Shin on 2016/4/29.
 */
@Controller
@RequestMapping("/sys/online")
public class OnlineController extends BaseController {

    @Autowired
    SessionRegistry sessionRegistry;

    /**
     * 加载入口页面
     *
     * @return
     */
    //@RequestMapping("/loadPage")
    //public ModelAndView loadPage(PageParam pageParam) {
    //    return render("sys/info/online", pageParam);
    //}

    /**
     * 系统活动用户
     *
     * @return
     */
    @RequestMapping("/loadActiveUsers")
    @ResponseBody
    public Object loadActiveUsers(HttpServletRequest request, HttpSession session) {


        List<OnlineUserInfo> infoList = new ArrayList<>();

        Map<Object, Date> lastActivityDates = new HashMap<>();

        for (Object principal : sessionRegistry.getAllPrincipals()) {
            if (principal instanceof UserDetails) {
                //logger.debug(ReflectionToStringBuilder.toString(principal));
            }

            for (SessionInformation information : sessionRegistry.getAllSessions(principal, false)) {

                if (lastActivityDates.get(principal) == null) {
                    lastActivityDates.put(principal, information.getLastRequest());
                } else {
                    // check to see if this session is newer than the last stored
                    Date prevLastRequest = lastActivityDates.get(principal);
                    if (information.getLastRequest().after(prevLastRequest)) {
                        // update if so
                        lastActivityDates.put(principal, information.getLastRequest());
                    }
                }

                //遍历SESSION
                infoList.add(new OnlineUserInfo(SecurityUtils.convertPrincipalToUser(information.getPrincipal()), information));

            }
        }

        return BuildUtils.MAP_BUILDER("Rows", infoList).toMap();
    }

    /**
     * 使失效
     * @return
     */
    @RequestMapping("/invalidate")
    @ResponseBody
    public Object invalidate(@RequestBody String[] sessionids, HttpServletRequest request) {

        int count = 0;
        if (sessionids != null) {
            for (String sessionid : sessionids) {
                SessionInformation sessionInformation = sessionRegistry.getSessionInformation(sessionid);
                if (sessionInformation != null) {
                    sessionInformation.expireNow();
                    count++;

                    //WebApplicationContextUtils.getWebApplicationContext(request.getServletContext())

                }
            }
        }
        return PageResult.success(count + "成功失效", count);
    }

}
