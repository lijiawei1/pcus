package org.zap.framework.module.auth.constants;

import java.util.HashMap;
import java.util.Map;

/**
 * 系统默认角色
 * Created by Shin on 2016/1/13.
 */
public class AuthConstants {

    public final static Map<String, String> ROLE_SET = new HashMap<>();

    /**
     * 系统管理员 判断是否用户是否admin，代码添加
     */
    public final static String ROLE_SYSTEM = "ROLE_SYSTEM";
    /**
     * 系统用户 判断权限URL是否登录用户可访问，不做权限控制，代码添加
     */
    public final static String ROLE_USER = "ROLE_USER";
    /**
     * 公司管理员 实体有记录
     */
    public final static String ROLE_CORP = "ROLE_CORP";
    /**
     * 匿名访问
     */
    public final static String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

    /**
     * 模块
     */
    public final static int LEVEL_MODULE = 1;
    /**
     * 菜单
     */
    public final static int LEVEL_MENU = 2;
    /**
     * 按钮
     */
    public final static int LEVEL_BUTTON = 3;

    /**
     * 权限客体
     */
    public final static String TYPE_MENU = "menu";
    public final static String TYPE_DICT = "dict";

    public final static String TYPE_DATA = "data";

    /**
     * 权限主体
     */
    public final static String TYPE_ROLE = "role";
    public final static String TYPE_USER = "user";
    public final static String TYPE_USERGROUP = "usergroup";


    /**
     * 权限缓存
     */
    public final static String CACHE_PRIVILEGE = "privilegeCache";
    /**
     * 缓存用户
     */
    public final static String CACHE_USER = "userCache";

    static {
        ROLE_SET.put(ROLE_SYSTEM, "系统管理员");
        ROLE_SET.put(ROLE_USER, "系统用户");
        ROLE_SET.put(ROLE_ANONYMOUS, "匿名用户");
        ROLE_SET.put(ROLE_CORP, "公司管理员");
    }

    /**
     * 权限模块
     */
    public final static String MODULE_AUTH = "auth";

    public final static String MODULE_AUTH_PRIVILEGE = "authPrivilege";

    public final static String MODULE_AUTH_MENU = "authMenu";

    public final static String MODULE_AUTH_DICT = "authDict";

    public final static String MODULE_AUTH_USER = "authUser";

    public final static String MODULE_AUTH_USER_LIST = "authUserList";

    public final static String MODULE_AUTH_USERGROUP = "authUserGroup";

    public final static String MODULE_AUTH_ROLE = "authRole";

    /**
     * 组织管理
     */
    public final static String MODULE_ORG = "org";

    public final static String MODULE_ORG_CORP = "orgCorp";

    public final static String MODULE_ORG_DEPT = "orgDept";

    /**
     * 任务服务
     */
    public final static String MODULE_TASK = "task";

    public final static String MODULE_TASK_CONFIG = "taskConfig";

    public final static String MODULE_TASK_TYPE = "taskType";

    public final static String MODULE_TASK_LOG = "taskLog";

    public final static String MODULE_TASK_BACK = "taskBack";

    /**
     * 邮箱服务
     */
    public final static String MODULE_MAIL = "mail";

    public final static String MODULE_MAIL_CONFIG = "mailConfig";

    public final static String MODULE_MAIL_OUTBOX = "mailOutbox";

    /**
     * 消息服务
     */
    public final static String MODULE_MSG = "msg";

    public final static String MODULE_MSG_NOTICE = "msgNotice";




}
