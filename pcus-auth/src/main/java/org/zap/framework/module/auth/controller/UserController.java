package org.zap.framework.module.auth.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.LigerGridPager;
import org.zap.framework.common.entity.LigerTreeNode;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.common.json.CustomObjectMapper;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.auth.entity.*;
import org.zap.framework.module.auth.service.UserService;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.org.service.CorpService;
import org.zap.framework.util.SqlUtils;
import org.zap.framework.util.Utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户管理器
 * @author Shin
 *
 */
@Controller
@RequestMapping("/auth/user")
public class UserController extends BaseController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private CorpService corpService;

	@Autowired
	private CustomObjectMapper mapper;

	//@Autowired
	//private BasLogService logService;

	///**
	// * 加载入口页面
	// *
	// * @return
	// */
	//@ResponseBody
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("auth/user/user", pageParam);
	//}

	@RequestMapping("/add")
	@ResponseBody
	public Map<String, Object> add(User entity, HttpServletRequest request) {
		//默认密码为1
		if (StringUtils.isBlank(entity.getPassword())) {
			entity.setPassword("1");
		}
		userService.add(entity);

		Map<String, Object> result = new HashMap<>();
		result.put("data", entity);
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/update")
	public PageResult update(@RequestBody User entity, HttpServletRequest request) {
		Map<String, Object> result = new HashMap<>();
		
		//TODO
		userService.update(entity);
		
		return PageResult.success("保存成功", entity);
	}
	
	/**
	 * 删除用户
	 */
	@ResponseBody
	@RequestMapping("/remove")
	public Map<String, Object> remove(User user) {
		userService.remove(user);
		return new HashMap<>();
	}
	
	/**
	 * 过滤用户
	 */
	@ResponseBody
	@RequestMapping("/loadUsers")
	public List<User> loadUsers(UserFilter filter) {
		return userService.loadUsers(filter);
	}
	
	
	/**
	 * 查询分页角色子表
	 */
	@SuppressWarnings("rawtypes")
	@ResponseBody
	@RequestMapping("/loadPageRoles")
	public LigerGridPager<Role> loadPageRoles(User user, LigerGridPager pager) {
		return userService.loadPageRoles(user, pager.getPage(), pager.getPagesize(), pager.getSortname(), pager.getSortorder());
	}
	
	/**
	 * 弹出选中角色框
	 */
	@ResponseBody
	@RequestMapping("/loadSelectRoles")
	public List<LigerTreeNode> loadSelectRoles(User user) {

		List<Role> roles = userService.loadSelectRoles(user, getUser().isAdmin());

		//转换树形结果
		List<LigerTreeNode> treeNodeList = new ArrayList<>();
		Map<String, List<Role>> ml = Utils.bufferListMap(roles, "corp_id", String.class);

		for (String key : ml.keySet()) {
			List<Role> roleList = ml.get(key);
			treeNodeList.add(new LigerTreeNode(key, "", roleList.get(0).getCorpname(), "", Boolean.FALSE.toString()));

			treeNodeList.addAll(roleList.stream().map(role -> new LigerTreeNode(role.getId(), role.getCorp_id(),
					role.getRolename(), role.getRolecode(),
					role.getIschecked())).collect(Collectors.toList()));
		}


		return treeNodeList;
		
	}
	
	/**
	 * 加载公司
	 */
	@ResponseBody
	@RequestMapping("/loadCorps")
	public List<Corp> loadCorps() {
		//当前用户所属公司编码
		return corpService.loadCorps(getUser());
		
	}
	
	/**
	 * 分配角色
	 */
	@ResponseBody
	@RequestMapping("/grantRoles")
	public Map<String, Object> grantRoles(User user) {
		userService.grantRoles(user);
		return new HashMap<>();
	}
	
	/**
	 * 分配角色
	 */
	@ResponseBody
	@RequestMapping("/grantAnyRoles")
	public Map<String, Object> grantAnyRoles(User user) {
		userService.grantAnyRoles(user);
		return new HashMap<>();
	}
	
	/**
	 * 检查用户名重复
	 */
	@ResponseBody
	@RequestMapping("/checkUserUnique")
	public boolean checkUserUnique(User user) {
		return userService.checkUserUnique(user);
	}
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	/**
	 * 重置密码
	 */
	@ResponseBody
	@RequestMapping("/resetPwd")
	public PageResult resetPwd(User user) {
		//重置密码
		user.setPassword(passwordEncoder.encode("1"));
		int rows = userService.updatePartField(user, new String[] { "password" });
		return new PageResult(rows == 1, "", user);
	}

	/**
	 * 使用邮箱注册用户
	 * @param userRegister
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/emailRegister")
	public Object emailRegister(UserRegisterInfo userRegister, HttpServletRequest request) {

		HttpSession session = request.getSession();

		//检查图片校验码
		String imageVerifyCode = (String)session.getAttribute("image_verify_code");
		if (!StringUtils.equalsIgnoreCase(userRegister.getImage_verify_code(), imageVerifyCode)) {
			return new PageResult(true, 0, "图片校验码不正确", null);
		}

		//消费验证码
		session.removeAttribute("image_verify_code");

		userService.registerMail(userRegister);
		return new PageResult(false, "", "");
	}

	/**************************************用户列表界面********************************************/

	///**
	// * 加载列表界面
	// * @return
     //*/
	//@RequestMapping("/loadPageList")
	//@NodeFunction(name = "用户列表", code = MODULE_AUTH_USER_LIST, parent = MODULE_AUTH, order = 6, intercept_url = "*", url = "/loadPageList")
	//public ModelAndView loadPageList(PageParam pageParam) {
	//	return render("auth/user/userlist", pageParam);
	//}

	///**
	// * 获取用户列表
	// * @param request 请求条件
	// * @param where 序列化的查询条件
     //* @return
     //*/
	//@ResponseBody
	//@RequestMapping("/loadPageUsers")
	//public LigerGridPager<User> loadPageUsers(LigerGridPager<?> request, String where) {
	//	return new LigerGridPager<>(userService.loadPageUsersWithRols(request, where));
	//}

	///**
	// * 新增用户
	// * @param user
	// * @return
	// */
	//@RequestMapping("/addUser")
	//@ResponseBody
	//public PageResult addUser(@RequestBody User user, HttpServletRequest request) {
	//	//检查账号是否重复
	//	if(userService.checkUserUnique(user)) {
	//		return PageResult.success("新增成功", userService.add(user));
	//	}else {
	//		return PageResult.error("登录账号重复");
	//	}
	//}

	///**
	// * 修改用户
	// * @param user
	// * @return
	// */
	//@RequestMapping("/updateUser")
	//@ResponseBody
	//public PageResult updateUser(@RequestBody User user, HttpServletRequest request) {
	//	return PageResult.success("修改成功", userService.update(user, getUser(), request));
	//}

	/**
	 * 批量启用用户
	 * @param users
	 * @return
	 */
	//@RequestMapping("/enable")
	//@ResponseBody
	//public PageResult enable(@RequestBody User[] users, HttpServletRequest request) {
	//	if(users.length > 0) {
	//		for(User user : users) {
	//			user.setEnabled(true);
	//			user.setEnabled_time(LocalDateTime.now());
	//			user.setModifier_id(getUser().getId());
	//			user.setModify_psn(getUser().getName());
	//			user.setModify_time(LocalDateTime.now());
	//		}
	//	}
	//	userService.update(users, new String[]{"enabled", "enabled_time", "modifier_id", "modify_psn", "modify_time"}, true);
    //
	//	List<String> user_ids = Arrays.stream(users).map(m -> m.getId()).distinct().collect(Collectors.toList());
	//	//logService.log(MODULE_AUTH, MODULE_AUTH_USER, "启用用户", user_ids.toArray(new String[user_ids.size()]), getUser(), request);
    //
	//	return PageResult.success("用户已启用", users);
	//}

	/**
	 * 失批量失效用户
	 * @param users
	 * @return
	 */
	//@RequestMapping("/disable")
	//@ResponseBody
	//public PageResult disable(@RequestBody User[] users, HttpServletRequest request) {
	//	List<String> pk_ids = Arrays.stream(users).map(m -> m.getId()).distinct().collect(Collectors.toList());
	//	List<User> userList = userService.queryByClause(User.class, "NVL(AU.DR, 0) = 0 AND AU.ENABLED = 'Y' AND " + SqlUtils.inClause("AU.ID", pk_ids));
	//	if(userList.size() == users.length) {
	//		userService.disableUser(users);
	//		return PageResult.success("用户已失效", null);
	//	}else {
	//		return PageResult.error("选中记录含有不存在或已失效的用户，请刷新重试");
	//	}
	//}

	/**
	 * 重置密码
	 * @param user
	 * @return
	 */
	@RequestMapping("/resetPassword")
	@ResponseBody
	public PageResult resetPassword(@RequestBody User user) {
		//重置密码
		user.setPassword(passwordEncoder.encode("1"));
		int rows = userService.updatePartField(user, new String[]{"password"});
		return new PageResult(rows != 1, "", user);
	}

	/**
	 * 加载角色列表
	 * @param user
	 * @return
	 */
	@RequestMapping("/loadRoles")
	@ResponseBody
	public PageResult loadRoles(@RequestBody User user) {
		List<String> roles = user.getRoles().stream().map(r -> r.getRolecode()).distinct().collect(Collectors.toList());
		roles.add("###");
		List<Role> roleList = userService.queryByClause(Role.class, "NVL(AR.DR, 0)=0 AND AR.ENABLE = 'Y' AND " + SqlUtils.inClause("AR.ROLECODE NOT", roles));

		return PageResult.success("获取角色列表成功", roleList);
	}

	/**
	 * 批量删除用户
	 * @param users
	 * @return
	 */
	//@RequestMapping("/removeUser")
	//@ResponseBody
	//public PageResult removeUser(@RequestBody User[] users, HttpServletRequest request) {
	//	List<User> list = Arrays.stream(users).filter(u -> !u.isEnabled()).distinct().collect(Collectors.toList());
	//	if(list.size() == 0) {
	//		String[] ids = Arrays.stream(users).map(m -> m.getId()).distinct().toArray(String[]::new);
	//		userService.remove(ids, getUser(), request);
	//		return PageResult.success("删除成功", null);
	//	}else {
	//		return PageResult.error("所选记录存在有效的用户，无法删除");
	//	}
	//}

	/**
	 * 批量分配角色给用户
	 * @param roleCheck
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/grantRoleToUsers")
	public Object grantRoleToUsers(RoleCheck roleCheck) {
		userService.grantAnyUsers(roleCheck, getUser());
		return PageResult.success();
	}

	@ResponseBody
	@RequestMapping("/updateTargetUrl")
	public Object updateTargetUrl(String target_url) {

		User user = getUser();
		user.setTarget_url(target_url);
		userService.updatePartFields(user, new String[] { "target_url" });

		return PageResult.success();

	}

	///**
	// * 批量分配角色给单个用户
	// * @param user
	// * @return
	// */
	//@RequestMapping("/grantRolesToUser")
	//@ResponseBody
	//public PageResult grantRolesToUser(@RequestBody User user, HttpServletRequest request) {
	//	if(user != null) {
	//		return userService.grantAnyRoles(user);
	//	}else {
	//		return PageResult.error("请选择用户");
	//	}
	//}

	public String json(Object value) {
		try {
			return mapper.writeValueAsString(value);
		} catch (JsonProcessingException e) {
			throw new BusinessException("数据格式JSON化出错", e);
		}
	}

}
