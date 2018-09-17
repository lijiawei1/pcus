package org.zap.framework.module.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.LigerGridPager;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.module.auth.entity.Role;
import org.zap.framework.module.auth.service.RoleService;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.org.service.CorpService;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 角色管理
 * @author Shin
 *
 */
@Controller
@RequestMapping("/auth/role")
public class RoleController extends BaseController {

	@Autowired
	private RoleService roleService;
	
	@Autowired
    CorpService corpService;

	@Autowired
	CustomObjectMapper customObjectMapper;

	///**
	// * 加载入口页面
	// *
	// * @return
	// */
	//@ResponseBody
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("auth/role/role", pageParam);
	//}

	/**
	 * 检查角色名重复
	 */
	@ResponseBody
	@RequestMapping("/checkRoleUnique")
	public boolean checkRoleUnique(String id, String rolename, String rolecode) {
		return roleService.checkRoleUnique(id, rolecode, rolename);
	}
	
	@ResponseBody
	@RequestMapping("/loadRoles")
	public List<Role> loadRoles(Role role) {
		return roleService.loadRoles(role);
	}

	/**
	 * 加载列表界面
	 *
	 * @return
	 */
	//@RequestMapping("/loadPageList")
	//public ModelAndView loadPageList(PageParam pageParam) throws JsonProcessingException {
	//	pageParam.getParams().put("modules", customObjectMapper.writeValueAsString(roleService.queryForEnhanceMapList("SELECT NAME AS TEXT,NO AS ID FROM ZAP_AUTH_MENU WHERE DR = 0 AND MLEVEL = 1")));
	//	return render("auth/role/rolelist", pageParam);
	//}

	/**
	 * 加载角色列表
	 * @param request
	 * @param where
     * @return
     */
	@ResponseBody
	@RequestMapping("/loadGrid")
	public LigerGridPager<Role> loadGrid(LigerGridPager<?> request, String where) {
		return new LigerGridPager<>(roleService.page(Role.class, request, where));
	}

	/**
	 * 加载公司树
	 */
	@ResponseBody
	@RequestMapping("/loadCorps")
	public List<Corp> loadCorps() {
		return corpService.loadCorps(getUser());
	}

	/**
	 * 加载模块级菜单
	 *
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/loadModules")
	public Object loadModules() {
		return roleService.queryForEnhanceMapList("SELECT NAME AS TEXT,NO AS ID FROM ZAP_AUTH_MENU WHERE DR = 0 AND MLEVEL = 0");
	}

	/************************增删改查**************************/

	@RequestMapping("/add")
	@ResponseBody
	public PageResult add(Role entity) {
		//创建人
		entity.setCreator_id(getUser().getId());
		roleService.add(entity);
		return PageResult.success("", entity);
	}
	
	@RequestMapping("/removeBefore")
	@ResponseBody
	public PageResult removeBefore(Role role) {
		boolean b = roleService.removeBefore(role);
		return new PageResult(b, b ? "角色已经分配用户或权限" : "", "");
	}
	
	@RequestMapping("/update")
	@ResponseBody
	public PageResult update(Role entity) {
		//审计字段
		entity.setModifier_id(getUser().getId());
		entity.setModify_time(LocalDateTime.now());
		
		roleService.update(entity);
		return PageResult.success("", entity);
	}
	
	@RequestMapping("/remove")
	@ResponseBody
	public PageResult remove(Role role) {
		//业务删除
		return PageResult.success("", roleService.delete(role));
	}

}
