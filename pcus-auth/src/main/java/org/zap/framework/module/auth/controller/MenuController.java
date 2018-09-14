package org.zap.framework.module.auth.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.PropertiesEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.zap.framework.common.controller.BaseController;
import org.zap.framework.common.entity.LigerGridPager;
import org.zap.framework.common.entity.PageResult;
import org.zap.framework.module.auth.entity.Menu;
import org.zap.framework.module.auth.service.MenuService;
import org.zap.framework.module.auth.service.PrivilegeService;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/auth/menu")
public class MenuController extends BaseController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private PrivilegeService privilegeService;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        super.initBinder(binder);
        binder.registerCustomEditor(List.class, new PropertiesEditor() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                setValue(null);
            }
        });
        binder.registerCustomEditor(Collection.class, new PropertiesEditor() {
            @Override
            public void setAsText(String text) throws IllegalArgumentException {
                setValue(null);
            }
        });
    }


    ///**
    // * 管理按钮入口
    // *
    // * @param menu 页面菜单对象
    // */
    //@RequestMapping("/manage")
    //public ModelAndView manage(Menu menu) {
    //    //需要将父菜单主键
    //    return render("auth/menu/button", menu);
    //}

    ///**
    // * 加载入口页面
    // *
    // * @return
    // */
    //@ResponseBody
    //@RequestMapping("/loadPage")
    //public ModelAndView loadPage(PageParam pageParam) {
    //    return render("auth/menu/menu", pageParam);
    //}

    @RequestMapping("/add")
    @ResponseBody
    public Object add(Menu entity) {
        Map<String, Object> result = new HashMap<>();
        menuService.add(entity);
        result.put("data", entity);
        return result;
    }

    @RequestMapping("/update")
    @ResponseBody
    public PageResult update(Menu entity) {
        //审计字段
        entity.setModifier_id(getUser().getId());
        entity.setModify_time(LocalDateTime.now());

        menuService.update(entity);
        return PageResult.success("", entity);
    }

    @RequestMapping("/remove")
    @ResponseBody
    public PageResult remove(Menu entity) {
        return new PageResult(menuService.delete(entity) != 1, "", "");
    }

    /**
     * 加载菜单
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("/loadTreeMenus")
    public List<Menu> loadTreeMenus() {
        return menuService.list(Menu.class, " AM.DR = 0 AND AM.MLEVEL < 3 ORDER BY AM.MORDER");
    }

    @ResponseBody
    @RequestMapping("/loadPageMenus")
    public LigerGridPager<Menu> loadPageMenus(Menu menu, LigerGridPager<?> req) {

        final String sortname = req.getSortname();
        final String sortorder = req.getSortorder();
        //return new LigerGridPager<>(menuService.page(menu, req.getPage() - 1, req.getPagesize(), new ICriteria<Menu>() {
        //    public Criteria<Menu> execute(Criteria<Menu> criteria, Menu entity) {
        //        return criteria.eq("dr", 0).eq("pid", entity.getPid()).sort(sortname, StringUtils.isBlank(sortorder) || "asc".equals(sortorder));
        //    }
        //}));

        return new LigerGridPager<>(menuService.page(Menu.class, req, ""));
    }


    @ResponseBody
    @RequestMapping("/loadGrantedSubMenus")
    public Object loadGrantedSubMenus(String ids) {
        return privilegeService.loadGrantedSubMenus(ids == null ? new String[]{} : ids.split(","));
        //return privilegeService.loadGrantedSubMenus(ids);
    }


}
