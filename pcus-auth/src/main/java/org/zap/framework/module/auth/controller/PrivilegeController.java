package org.zap.framework.module.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.GrantRequestEntity;
import org.zap.framework.module.auth.entity.Menu;
import org.zap.framework.module.auth.entity.Role;
import org.zap.framework.module.auth.service.MenuService;
import org.zap.framework.module.auth.service.PrivilegeService;
import org.zap.framework.module.org.entity.Corp;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/auth/privilege")
public class PrivilegeController extends BaseController {

	@Autowired
	private PrivilegeService privilegeService;
	
	@Autowired
	private MenuService menuService;

	///**
	// * 加载入口页面
	// *
	// * @return
	// */
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("auth/privilege/privilege", pageParam);
	//}

	/**
	 * 读取选中角色选中的权限客体
	 */
	@ResponseBody
	@RequestMapping("/loadPrivileges")
	public Map<String, Object> loadPrivileges(final String roleid) {
		Map<String, Object> result = new HashMap<>();
		result.put("data", privilegeService.loadMenuPrivilegesByRoleId(roleid, AuthConstants.TYPE_MENU));
		return result;
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
	 * 加载公司
	 */
	@ResponseBody
	@RequestMapping("/loadCorps")
	public List<Corp> loadCorps() {
		//当前用户所属公司编码
		return privilegeService.loadCorps(getUser());
		
	}
	
	/**
	 * 读取所有模块下的菜单按钮的树形结构列表
	 */
	@ResponseBody
	@RequestMapping("/loadMenus")
	public Map<String, Object> loadMenus(Menu menu, String roleid) {
		Map<String, Object> result = new HashMap<>();
		result.put("Rows", menuService.loadMenus(getUser(), true, true, false));
		return result;
	}
	
	/**
	 * 分配权限
	 */
	@ResponseBody
	@RequestMapping("/grantPrivileges")
	public Map<String, Object> grantPrivileges(Role entity) {
		privilegeService.grantPrivileges(entity, getUser());
		return new HashMap<>();
	}

	/**
	 * 分配权限
	 */
	@ResponseBody
	@RequestMapping("/grantModule")
	public Object grantModules(@RequestBody GrantRequestEntity entity) {
		privilegeService.grantPrivileges(entity.getRoleList(), entity.getParentMenuNo(), getUser());
		return PageResult.success();
	}

	/**
	 * 刷新
	 * @return
     */
	@ResponseBody
	@RequestMapping("/refresh")
	public Object refresh() {
		privilegeService.refresh();
		return PageResult.success();
	}

	
}
