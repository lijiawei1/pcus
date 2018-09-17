package org.zap.framework.module.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.org.service.CorpService;

import java.util.List;

/**
 * 系统日志，用户操作记录
 * @author Shin
 *
 */
@Controller
@RequestMapping("/sys/log")
public class LogController extends BaseController {

	@Autowired
    CorpService corpService;
	
	//@Autowired
	//LogService logService;

	/**
	 * 加载入口页面
	 *
	 * @return
	 */
	//@RequestMapping("/loadPage")
	//public ModelAndView loadPage(PageParam pageParam) {
	//	return render("sys/log/log", pageParam);
	//}

	/**
	 * 加载
	 */
	//@ResponseBody
	//@RequestMapping("/loadPageLogs")
	//public LigerGridPager<SystemLog> loadPageLogs(SystemLog taskLog, LigerGridPager<?> req) {
    //
	//	final String sortname = req.getSortname();
	//	final String sortorder = req.getSortorder();
	//	return new LigerGridPager<>(logService.page(taskLog, req.getPage() - 1, req.getPagesize(), new ICriteria<SystemLog>() {
	//		public Criteria<SystemLog> execute(Criteria<SystemLog> criteria, SystemLog entity) {
	//			return criteria.eq("dr", 0).sort(sortname, StringUtils.isBlank(sortorder) || "asc".equals(sortorder));
	//		}
	//	}));
	//}
	
	/**
	 * 删除
	 */
	//@RequestMapping("/remove")
	//@ResponseBody
	//public Map<String, Object> remove(SystemLog entity) {
	//	//业务删除
	//	logService.remove(entity);
	//	return new HashMap<>();
	//}
	
	/**
	 * 加载公司树
	 */
	@ResponseBody
	@RequestMapping("/loadCorps")
	public List<Corp> loadCorps() {
		return  corpService.loadCorps(getUser());
	}
	
}
