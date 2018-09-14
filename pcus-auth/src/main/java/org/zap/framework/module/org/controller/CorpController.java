package org.zap.framework.module.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.org.service.CorpService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 
 * @author Shin
 *
 */
@Controller
@RequestMapping("/org/corp")
public class CorpController extends BaseController {
	
	@Autowired
    CorpService corpService;

	/**
	 * 加载入口页面
	 *
	 * @return
	 */
	//@RequestMapping(value = "/loadPage", method = RequestMethod.GET)
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("org/corp/corp", pageParam);
	//}

	/**
	 * 加载公司树
	 */
	@ResponseBody
	@RequestMapping("/loadCorps")
	public List<Corp> loadCorps() {
		return corpService.loadCorps(getUser());
	}

	@RequestMapping("/add")
	@ResponseBody
	public Map<String, Object> add(Corp entity) {
		Map<String, Object> result = new HashMap<>();
		//创建人
		entity.setCreator_id(getUser().getId());
		corpService.add(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/update")
	@ResponseBody
	public Map<String, Object> update(Corp entity) {
		Map<String, Object> result = new HashMap<>();
		
		//审计字段
		entity.setModifier_id(getUser().getId());
		entity.setModify_time(LocalDateTime.now());
		
		corpService.update(entity);
		result.put("data", entity);
		return result;
	}
	
	@RequestMapping("/removeBefore")
	@ResponseBody
	public Map<String, Object> removeBefore(Corp corp) {
		Map<String, Object> result = new HashMap<>();
		int count = corpService.queryCount(Corp.class, " OC.DR = 0 AND OC.PID = ?", new Object[] { corp.getPid() });
		//业务删除
		result.put("IsError", count != 0);
		result.put("message", "存在下级公司");
		return result;
	}
	
	@RequestMapping("/remove")
	@ResponseBody
	public Map<String, Object> remove(Corp corp) {
		//业务删除
		corpService.delete(corp);
		return new HashMap<>();
	}
	
}
