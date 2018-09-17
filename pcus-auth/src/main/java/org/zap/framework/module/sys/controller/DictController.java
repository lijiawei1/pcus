package org.zap.framework.module.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.module.sys.entity.Dictionary;
import org.zap.framework.module.sys.entity.DictionaryMx;
import org.zap.framework.module.sys.service.DictMxService;
import org.zap.framework.module.sys.service.DictService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/sys/dict")
public class DictController extends BaseController {
	
	@Autowired
	private DictService dictService;
	@Autowired
	private DictMxService dictMxService;

	/**
	 * 加载入口页面
	 *
	 * @return
	 */
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("sys/dict/dict", pageParam);
	//}

	@RequestMapping("/add")
	@ResponseBody
	public Map<String, Object> add(Dictionary entity) {
		Map<String, Object> result = new HashMap<>();
		//dictService.save(entity);
		dictService.insert(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/addMx")
	@ResponseBody
	public Map<String, Object> addMx(DictionaryMx entity) {
		Map<String, Object> result = new HashMap<>();
		//dictMxService.save(entity);
		dictMxService.insert(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/update")
	@ResponseBody
	public Map<String, Object> update(Dictionary entity) {
		Map<String, Object> result = new HashMap<>();
		
		//审计字段
		entity.setModifier_id(getUser().getId());
		entity.setModify_time(LocalDateTime.now());
		
		dictService.update(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/updateMx")
	@ResponseBody
	public Map<String, Object> updateMx(DictionaryMx entity) {
		Map<String, Object> result = new HashMap<>();
		
		//审计字段
		entity.setModifier_id(getUser().getId());
		entity.setModify_time(LocalDateTime.now());
		
		dictMxService.update(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/remove")
	@ResponseBody
	public Map<String, Object> remove(Dictionary entity) {
		//业务删除
		//dictService.remove(entity);
		entity.setDr(1);
		dictService.update(entity, new String[] { "dr"}, true);
		return new HashMap<>();
	}
	
	@RequestMapping("/removeMx")
	@ResponseBody
	public Map<String, Object> removeMx(DictionaryMx entity) {
		//业务删除
		//dictMxService.remove(entity);
		entity.setDr(1);
		dictService.update(entity, new String[]{"dr"}, true);
		return new HashMap<>();
	}
	
	@ResponseBody
	@RequestMapping("/beforeRemoveMx")
	public Map<String, Object> beforeRemoveMx(DictionaryMx entity) {
		Map<String, Object> result = new HashMap<>();
		int count = dictMxService.queryCount(DictionaryMx.class, " SDM.DR = 0 AND SDM.PID = ?", new Object[] { entity.getPid() });
		result.put("IsError", count != 0);
		result.put("message", "存在子明细,不能删除!");
		return result; 
	}
	
	@ResponseBody
	@RequestMapping("/loadDictTree")
	public Object loadDictTree() {
		//通过权限过滤
		return dictService.loadDict(getUser(), false);
	}
	
	@ResponseBody
	@RequestMapping("/loadDictMxSelectTree")
	public List<DictionaryMx> loadDictMxSelectTree(DictionaryMx entity) {
		return dictMxService.queryByClause(DictionaryMx.class, "SDM.DR=0 AND SDM.MST_ID = ? order by morder", entity.getMst_id());
	}
	
	@ResponseBody
	@RequestMapping("/loadDictMxTree")
	public Map<String, Object> loadDictMxTree(DictionaryMx entity) {
		Map<String, Object> result = new HashMap<>();
		String mst_id = entity.getMst_id();
		result.put("Rows",dictMxService.list(DictionaryMx.class, "SDM.DR=0 AND SDM.MST_ID='"+mst_id+"' order by SDM.morder,SDM.id"));
		//根据角色获取菜单
		return result;
	}
	
	@ResponseBody
	@RequestMapping("/loadDictMxGrid")
	public Map<String, Object> loadDictMxGrid(DictionaryMx entity) {
		Map<String, Object> result = new HashMap<>();
		String mst_id = entity.getMst_id();
		String id = entity.getId();
		result.put("Rows",dictMxService.list(DictionaryMx.class, "SDM.DR=0 AND SDM.MST_ID='"+mst_id+"' AND SDM.ID!='"+id+"' order by SDM.morder,SDM.id"));
		//根据角色获取菜单
		return result;
	}
}
