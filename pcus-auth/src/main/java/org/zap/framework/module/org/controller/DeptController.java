package org.zap.framework.module.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.module.org.entity.Dept;
import org.zap.framework.module.org.service.CorpService;
import org.zap.framework.module.org.service.DeptService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping("/org/dept")
public class DeptController extends BaseController {

	@Autowired
    CorpService corpService;
	
	@Autowired
    DeptService deptService;

	/**
	 * 加载入口页面
	 *
	 * @return
	 */
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("org/dept/dept", pageParam);
	//}

	@RequestMapping("/add")
	@ResponseBody
	public Map<String, Object> add(Dept entity) {
		Map<String, Object> result = new HashMap<>();
		
		deptService.save(entity);
		result.put("data", entity);
		return result;
	}
	
	
	@RequestMapping("/update")
	@ResponseBody
	public Map<String, Object> update(Dept entity) {
		Map<String, Object> result = new HashMap<>();
		
		//审计字段
		entity.setModifier_id(getUser().getId());
		entity.setModify_time(LocalDateTime.now());
		
		deptService.save(entity);
		result.put("data", entity);
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/loadDeptGrid")
	public Map<String, Object> loadDeptGrid(Dept entity) {
		Map<String, Object> result = new HashMap<>();
		String corp_id = entity.getCorp_id();
		String dept_id = entity.getId();
		
		String where ="";
		
		if(dept_id!=null&&!"".equals(dept_id)){
			where = " OD.DR=0 AND OD.ID!='"+dept_id+"' AND OD.CORP_ID='"+corp_id+"' order by OD.MORDER,OD.CREATE_TIME";
		}
		else{
			where = " OD.DR=0 AND OD.CORP_ID='"+corp_id+"' order by OD.MORDER,OD.CREATE_TIME";
		}
		result.put("Rows",deptService.list(Dept.class, where));
		//根据角色获取菜单
		return result;
	}
	
	
	@ResponseBody
	@RequestMapping("/beforeRemove")
	public Map<String, Object> beforeRemove(Dept entity) {
		Map<String, Object> result = new HashMap<>();
		int count = deptService.queryCount(Dept.class, " OD.DR = 0 AND OD.PID = ?", new Object[] { entity.getPid() });
		result.put("IsError", count != 0);
		result.put("message", "存在子明细,不能删除!");
		return result; 
	}
	
	@RequestMapping("/remove")
	@ResponseBody
	public Map<String, Object> removeMx(Dept entity) {
		//业务删除
		deptService.remove(entity);
		return new HashMap<>();
	}
}
