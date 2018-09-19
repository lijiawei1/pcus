package org.zap.framework.module.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.LigerPageRequest;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.Role;
import org.zap.framework.module.auth.service.DictAccessService;
import org.zap.framework.module.auth.service.MenuService;
import org.zap.framework.module.auth.service.PrivilegeService;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.sys.entity.Dictionary;
import org.zap.framework.util.BuildUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 字典权限控制
 * Created by Shin on 2017/3/17.
 */
@Controller
@RequestMapping("/auth/dictAccess")
public class DictAccessController extends BaseController {

    @Autowired
    DictAccessService dictAccessService;

    @Autowired
    private PrivilegeService privilegeService;

    @Autowired
    private MenuService menuService;

    /**
     * 加载字典
     * @param req
     * @param where
     * @return
     */
    @ResponseBody
    @RequestMapping("/loadGrid")
    public Map<String, Object> loadGrid(LigerPageRequest req, String where) {
        return BuildUtils.MAP_BUILDER("Rows",
                privilegeService.queryByClause(Dictionary.class, " SD.DR = 0 ")).toMap();
    }

    /**
     * 加载权限
     * @param roleid
     * @return
     */
    @ResponseBody
    @RequestMapping("/loadPrivileges")
    public Map<String, Object> loadPrivileges(final String roleid){
        return BuildUtils.MAP_BUILDER("Rows", privilegeService.loadMenuPrivilegesByRoleId(roleid, AuthConstants.TYPE_DICT)).toMap();
    }

    /**
     * 加载公司
     */
    @ResponseBody
    @RequestMapping("/loadCorps")
    public List<Corp> loadCorps() {
        //当前用户所属公司编码
        return privilegeService.loadCorps(getUser());

    }

    /**
     * 加载角色
     */
    @ResponseBody
    @RequestMapping("/loadRoles")
    public List<Role> loadRoles(Role role) {
        return privilegeService.loadRoles(role);
    }

    /**
     * 分配权限
     */
    @ResponseBody
    @RequestMapping("/grantPrivileges")
    public Map<String, Object> grantPrivileges(@RequestBody Role entity) {
        privilegeService.grantPrivileges(entity, getUser());
        return new HashMap<>();
    }
}
