package org.zap.framework.module.auth.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.zap.framework.module.auth.annotation.FunctionType;
import org.zap.framework.module.auth.annotation.NodeFunction;
import org.zap.framework.module.auth.annotation.NodeModule;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.Menu;
import org.zap.framework.module.init.constants.SysConstants;
import org.zap.framework.orm.helper.BeanHelper;
import org.zap.framework.orm.itf.ITree;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;

/**
 * Created by Shin on 2016/1/14.
 */
public class MenuInitiate {

    MenuService menuService;

    PrivilegeService privilegeService;

    RequestMappingHandlerMapping requestMappingHandlerMapping;

    public Logger logger = LoggerFactory.getLogger(MenuInitiate.class);


    public MenuInitiate(MenuService menuService,
                        PrivilegeService privilegeService,
                        RequestMappingHandlerMapping requestMappingHandlerMapping) {
        this.menuService = menuService;
        this.privilegeService = privilegeService;
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
    }


    /**
     * 获取控制器列表
     *
     * @return
     */
    public List<Class<?>> retrieveBeanType(Map<RequestMappingInfo, HandlerMethod> handlerMethods) {

        Set<Class<?>> filter = new HashSet<>();

        for (RequestMappingInfo info : handlerMethods.keySet()) {
            HandlerMethod handlerMethod = handlerMethods.get(info);

            Class<?> beanType = handlerMethod.getBeanType();
            filter.add(beanType);
        }

        return filter.stream().collect(Collectors.toList());
    }

    public void init(boolean reset, String moduleCode, String startNo) {

        List<Menu> menuList = new ArrayList<>();
        Map<String, Menu> menuFromDb = menuList.stream().collect(Collectors.toMap(m -> m.getCode(), m -> m));

        boolean flag = StringUtils.isNotBlank(moduleCode);

        if (requestMappingHandlerMapping != null) {

            //模块列表
            Map<String, NodeModule> moduleMap = new HashMap<>();

            Map<String, NodeFunction> functionMap = new HashMap<>();

            Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();

            List<Class<?>> classes = retrieveBeanType(handlerMethods);

            List<MenuInfoHolder> holderList = new ArrayList<>();

            //得到所有
            for (Class<?> clazz : classes) {

                RequestMapping mapping = clazz.getAnnotation(RequestMapping.class);

                //获取控制器模块注解
                NodeModule module = clazz.getAnnotation(NodeModule.class);

                if (module != null) {

                    //模块编码
                    String code = module.code();

                    if (moduleMap.containsKey(code)) {
                        logger.warn("重复的模块编码[{}]，请检查控制器[{}]", code, clazz.getName());
                    }

                    moduleMap.put(code, module);
                    holderList.add(new MenuInfoHolder(mapping, module, null));
                    logger.debug("发现功能编码[{}:{}]，控制器[{}]", module.code(), module.name(), clazz.getName());

                    NodeFunction[] functions = module.function();
                    if (functions != null && functions.length > 0) {
                        for (int i = 0; i < functions.length; i++) {
                            holderList.add(new MenuInfoHolder(mapping, null, functions[i]));
                        }
                    }
                } else {
                    //控制器没有注解，无法自动生成
                    logger.warn("Controller [{}] annotation @NodeModule missing", clazz.getName());
                }

                //获取方法映射注解
                NodeFunction function = clazz.getAnnotation(NodeFunction.class);

                if (function != null) {

                    String code = function.code();
                    if (moduleMap.containsKey(code)) {
                        logger.warn("重复的功能编码[{}:{}]，请检查控制器[{}]", code, function.name(), clazz.getName());
                    }

                    functionMap.put(code, function);
                    logger.debug("发现模块编码[{}:{}]，控制器[{}]", function.code(), function.name(), clazz.getName());

                    holderList.add(new MenuInfoHolder(mapping, null, function));
                }
            }

            for (RequestMappingInfo info : handlerMethods.keySet()) {

                HandlerMethod handlerMethod = handlerMethods.get(info);
                //获取方法映射注解
                NodeFunction function = handlerMethod.getMethodAnnotation(NodeFunction.class);

                if (function != null) {
                    String code = function.code();

                    if (moduleMap.containsKey(code)) {
                        logger.warn("重复的功能编码[{}]，请检查控制器[{}]", code, handlerMethod.getMethod().getName());
                    }

                    functionMap.put(code, function);
                    logger.debug("发现功能编码[{}]，方法[{}]", code, handlerMethod.getMethod().getName());

                    holderList.add(new MenuInfoHolder(info, handlerMethod, null, function));

                } else {
                    logger.warn("Method [{}] annotation @NodeMethod not found", handlerMethod.getMethod().getName());
                    continue;
                }
            }

            List<MenuInfoHolder> treeList = BeanHelper.buildTree(holderList);


            //初始化单个模块
            if (flag) {

                if (reset) {
                    int i = menuService.deleteByClause(Menu.class, "CODE = ?", moduleCode);
                    logger.debug("删除菜单项[{}]条 ", i);
                }

                //得到目标节点
                MenuInfoHolder target = null;
                for (MenuInfoHolder menuInfoHolder : treeList) {
                    if (menuInfoHolder.getId().equals(moduleCode)) {
                        target = menuInfoHolder;
                        break;
                    }
                }

                NodeModule module = target.getModule();
                List<MenuInfoHolder> children = target.getChildren();

                Menu moduleMenu = convert(module, reset ? null : menuFromDb.get(moduleCode));

                //插入模块节点
                menuService.addMinOpening(moduleMenu, startNo);

                //递归插入
                recursiveInsert(children, moduleMenu);
            }
        }
    }

    /**
     * 递归插入
     *
     * @param children
     * @param parent
     */
    private void recursiveInsert(List<MenuInfoHolder> children, Menu parent) {

        if (children != null && children.size() > 0) {
            //排序
            Collections.sort(children, (o1, o2) -> o1.getFunction().order() - o2.getFunction().order());

            for (MenuInfoHolder child : children) {
                Menu menu = convert(child, null);
                menu.setPid(parent.getId());
                menu.setNo(parent.getNo());
                menuService.addMinOpening(menu, null);
                recursiveInsert(child.getChildren(), menu);
            }
        }
    }

    /**
     * 转换
     * <p>
     * 拦截地址
     * # 使用映射本身地址
     * * 用在
     * 自定义
     *
     * @param holder
     * @param m
     * @return
     */
    private Menu convert(MenuInfoHolder holder, Menu m) {

        if (m == null) {
            m = new Menu();
        }

        NodeModule module = holder.getModule();
        if (module != null) {
            m.setName(module.name());
            m.setCode(module.code()); //菜单编码
            m.setPid(SysConstants.MODULE_ROOT_ID); //模块主键

            m.setUnintercept(module.unintercept()); //是否拦截
            m.setUrl(module.url());
            m.setIntercept_url(module.intercept_url());

            m.setIcon(module.icon());
            m.setVisible(true);
            m.setMlevel(AuthConstants.LEVEL_MODULE);
            m.setMorder(module.order());
            m.setLeaf(false);
        }

        NodeFunction function = holder.getFunction();
        if (function != null) {
            m.setName(function.name());
            m.setCode(function.code()); //菜单编码
            m.setPid(SysConstants.MODULE_ROOT_ID); //模块主键

            m.setUnintercept(function.unintercept()); //是否拦截
            m.setIntercept_url(getConvertInterceptUrl(holder));
            m.setUrl(getConvertUrl(holder));

            m.setIcon(function.icon());
            m.setVisible(function.visible());
            m.setMlevel(AuthConstants.LEVEL_MENU);
            m.setMorder(function.order());
            m.setLeaf(false);
        }
        m.setCreate_time(LocalDateTime.now()); //创建时间
        m.setCreator_id(SysConstants.USER_ADMIN_ID); //系统管理员
        return m;
    }

    private String getConvertUrl(MenuInfoHolder holder) {
        NodeFunction function = holder.getFunction();
        String url = function.url();
        boolean module = false;

        if (holder.getInfo() != null) {
            url = holder.getInfo().getPatternsCondition().getPatterns().stream().limit(1).collect(toList()).get(0);
        } else if (holder.getRequestMapping() != null) {
            url = holder.getRequestMapping().value()[0];
            module = true;
        }

        if ("#".equals(function.url())) {
            return module ? "#" : url;
        }

        return module ? (url + function.url()) : url;
    }


    /**
     * URL配置规则
     *
     * @param holder
     * @return
     */
    private String getConvertInterceptUrl(MenuInfoHolder holder) {

        NodeFunction function = holder.getFunction();
        String url = function.intercept_url();
        boolean module = false;

        if ("#".equals(function.intercept_url())) {

            if (holder.getInfo() != null) {
                url = holder.getInfo().getPatternsCondition().getPatterns().stream().limit(1).collect(toList()).get(0);
            } else if (holder.getRequestMapping() != null) {
                url = holder.getRequestMapping().value()[0];
                module = true;
            }

            return module ? "#" : url;
        }

        if ("*".equals(function.intercept_url())) {

            if (holder.getInfo() != null) {
                url = holder.getInfo().getPatternsCondition().getPatterns().stream().limit(1).collect(toList()).get(0);
            } else if (holder.getRequestMapping() != null) {
                url = holder.getRequestMapping().value()[0];
                module = true;
            }

            return url + (module ? "/**" : "**");
        }
        return url;
    }


    private Menu convert(NodeModule a, Menu m) {

        if (m == null) {
            m = new Menu();
        }

        m.setName(a.name());
        m.setCode(a.code()); //菜单编码
        m.setPid(SysConstants.MODULE_ROOT_ID); //模块主键
        //m.setNo(StringUtils.leftPad(index, 3, "0")); //三位编码左侧补零

        m.setUnintercept(a.unintercept());
        m.setIntercept_url(a.intercept_url());
        m.setUrl(a.url());

        m.setIcon(a.icon());
        m.setVisible(true);
        m.setMlevel(AuthConstants.LEVEL_MODULE);
        m.setMorder(a.order());
        m.setLeaf(false);

        m.setCreate_time(LocalDateTime.now()); //创建时间
        m.setCreator_id(SysConstants.USER_ADMIN_ID); //系统管理员

        return m;
    }

    public void init(boolean reset) {
        if (requestMappingHandlerMapping != null) {

            //模块列表
            Map<String, NodeModule> moduleMap = new HashMap<>();

            Map<String, List<MenuInfoHolder>> functionListMap = new HashMap<>();

            Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();

            for (RequestMappingInfo info : handlerMethods.keySet()) {
                HandlerMethod handlerMethod = handlerMethods.get(info);

                //获取控制器菜单注解
                NodeModule module = handlerMethod.getBeanType().getAnnotation(NodeModule.class);

                if (module == null) {
                    //控制器没有注解，无法自动生成
                    logger.warn("Controller [{}] annotation @NodeModule missing", handlerMethod.getBeanType().getName());
                    continue;
                }

                //获取方法映射注解
                NodeFunction function = handlerMethod.getMethodAnnotation(NodeFunction.class);

                if (function == null) {
                    logger.debug("Method [{}] annotation @NodeMethod not found", handlerMethod.getMethod().getName());
                    continue;
                }

                moduleMap.put(module.code(), module);

                /**
                 * 获取菜单权限配置
                 */
                if (function != null) {

                    Set<String> patterns = info.getPatternsCondition().getPatterns();

                    //统一方法映射了两个入口地址
                    if (patterns.size() > 1) {
                        logger.warn("Handler mappings found more than 1 {}", patterns);
                    }

                    //菜单类型
                    FunctionType type = function.type();

                    switch (type) {
                        case MENU:
                            if (!functionListMap.containsKey(module.code())) {
                                functionListMap.put(module.code(), new ArrayList<>());
                            }

                            functionListMap.get(module.code()).add(new MenuInfoHolder(info, handlerMethod, null, function));
                            break;
                        case BUTTON:

                            //配置去

                            break;
                    }
                }
            }

            //获取现有的菜单列表
            List<Menu> menuList = menuService.queryByClause(Menu.class, " AM.DR = 0 AND AM.ID <> '" + SysConstants.MODULE_ROOT_ID + "'");

            //Map<String, Menu> menuCollect = menuList.stream().collect(Collectors.toMap(m -> m.getCode(), m -> m));

            Map<String, Menu> moduleCollect = menuList.stream().filter(m -> m.getMlevel() == 1).collect(Collectors.toMap(m -> m.getCode(), m -> m));
            Map<String, Menu> menuCollect = menuList.stream().filter(m -> m.getMlevel() == 2).collect(Collectors.toMap(m -> m.getCode(), m -> m));


            //插入模块
            Map<String, Menu> moduleMenuMap = initModules(moduleMap, reset, moduleCollect);

            //插入菜单
            Map<String, Menu> menuFunctionMap = initMenus(moduleMenuMap, functionListMap, menuCollect);

        }
    }

    /**
     * 插入菜单
     *
     * @param moduleMenuMap
     * @param holderListMap
     * @param menuCollect
     */
    private Map<String, Menu> initMenus(Map<String, Menu> moduleMenuMap, Map<String, List<MenuInfoHolder>> holderListMap, Map<String, Menu> menuCollect) {

        List<Menu> functionInsertList = new ArrayList<>();
        List<Menu> functionUpdateList = new ArrayList<>();

        for (String key : moduleMenuMap.keySet()) {

            Menu module = moduleMenuMap.get(key);
            List<MenuInfoHolder> menuInfoHolders = holderListMap.get(key);

            if (menuInfoHolders.size() > 0) {

                MenuInfoHolder[] holders = menuInfoHolders.stream()
                        //排序
                        .sorted(Comparator.comparing(holder -> holder.getFunction().order()))
                        .toArray(MenuInfoHolder[]::new);
                //创建菜单
                for (int i = 0, index = 1; i < holders.length; i++, index++) {

                    MenuInfoHolder holder = holders[i];
                    NodeFunction f = holder.getFunction();
                    RequestMappingInfo info = holder.getInfo();
                    HandlerMethod method = holder.getMethod();

                    //类型名称
                    String simpleName = method.getBeanType().getSimpleName();
                    //方法名称
                    String methodName = method.getMethod().getName();
                    //拦截的URL
                    String url = info.getPatternsCondition().getPatterns().stream().limit(1).collect(toList()).get(0);

                    //模块编码，取最大编码
                    String parentNo = module.getNo();
                    String no = parentNo + StringUtils.leftPad("" + index, 3, "0");


                    if (menuCollect.containsKey(f.code())) {
                        Menu m = menuCollect.get(f.code());

                        m.setName(f.name());
                        m.setCode(f.code());
                        m.setVisible(true);
                        m.setMorder(f.order());
                        m.setMlevel(AuthConstants.LEVEL_MENU);
                        //m.setNo(no);
                        m.setPid(module.getId()); //模块主键

                        m.setIntercept_url(url); //拦截的URL
                        m.setUnintercept(f.unintercept()); //不拦截URL
                        m.setUrl(url); //请求的URL
                        m.setRemark(simpleName + "." + methodName);

                        functionUpdateList.add(m);
                    } else {
                        Menu m = new Menu();
                        functionInsertList.add(m);

                        //设置菜单基本属性
                        m.setName(f.name());
                        m.setCode(f.code());
                        m.setVisible(true);
                        m.setMorder(f.order());
                        m.setMlevel(AuthConstants.LEVEL_MENU);
                        m.setNo(no);
                        m.setPid(module.getId()); //模块主键

                        m.setIntercept_url(url); //拦截的URL
                        m.setUnintercept(f.unintercept()); //不拦截URL
                        m.setUrl(url); //请求的URL
                        m.setRemark(simpleName + "." + methodName);
                    }
                }
            }
        }

        if (functionInsertList.size() > 0) {
            menuService.getBaseDao().insert(functionInsertList);
        }


        if (functionUpdateList.size() > 0) {
            menuService.getBaseDao().update(functionUpdateList);
        }

        //合并
        functionInsertList.addAll(functionUpdateList);

        return functionInsertList.stream().collect(toMap(f -> f.getCode(), f -> f));

    }

    /**
     * 初始化菜单模块
     *
     * @param moduleMap
     * @param menuCollect
     */
    private Map<String, Menu> initModules(Map<String, NodeModule> moduleMap, boolean reset, Map<String, Menu> menuCollect) {

        //清空所有菜单
        if (reset) {
            menuService.deleteByClause(Menu.class, " ID <> '" + SysConstants.MODULE_ROOT_ID + "'");
        }

        List<Menu> moduleInsertList = new ArrayList<>();
        List<Menu> moduleUpdateList = new ArrayList<>();


        //得到排序后的模块节点
        NodeModule[] nodeModules = moduleMap.values().stream()
                .sorted(Comparator.comparing(NodeModule::order))
                .toArray(NodeModule[]::new);

        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < nodeModules.length; i++) {

            String index = String.valueOf(i + 1);
            NodeModule a = nodeModules[i];

            if (menuCollect.containsKey(a.code())) {
                Menu menu = menuCollect.get(a.code());
                menu.setName(a.name());
                menu.setMorder(a.order());

                moduleUpdateList.add(menu);
                menu.setIcon(a.icon());
            } else {
                Menu m = new Menu();
                moduleInsertList.add(m);

                m.setName(a.name());
                m.setCode(a.code()); //菜单编码
                m.setPid(SysConstants.MODULE_ROOT_ID); //模块主键
                m.setNo(StringUtils.leftPad(index, 3, "0")); //三位编码左侧补零

                m.setUrl(null);
                m.setIcon(a.icon());
                m.setVisible(true);
                m.setMlevel(AuthConstants.LEVEL_MODULE);
                m.setLeaf(false);
                m.setIntercept_url(null);

                m.setId(new com.eaio.uuid.UUID().toString());
                m.setCreate_time(now); //创建时间
                m.setCreator_id(SysConstants.USER_ADMIN_ID); //系统管理员
            }
        }

        if (moduleInsertList.size() > 0) {
            menuService.getBaseDao().insert(moduleInsertList);
        }

        if (moduleUpdateList.size() > 0) {
            menuService.getBaseDao().update(moduleUpdateList);
        }

        //合并
        moduleInsertList.addAll(moduleUpdateList);

        return moduleInsertList.stream().collect(Collectors.toMap(m -> m.getCode(), m -> m));

    }

    class MenuInfoHolder implements ITree {

        RequestMappingInfo info;

        HandlerMethod method;

        RequestMapping requestMapping;

        NodeModule module;

        NodeFunction function;

        List<MenuInfoHolder> children = new ArrayList<>();

        public MenuInfoHolder(RequestMapping requestMapping, NodeModule module, NodeFunction function) {
            this.requestMapping = requestMapping;
            this.module = module;
            this.function = function;
        }

        public MenuInfoHolder(RequestMappingInfo info, HandlerMethod method, NodeModule module, NodeFunction function) {
            this.info = info;
            this.method = method;
            this.module = module;
            this.function = function;
        }

        public NodeModule getModule() {
            return module;
        }

        public void setModule(NodeModule module) {
            this.module = module;
        }

        @Override
        public String getId() {
            return module != null ? module.code() : function.code();
        }

        @Override
        public String getPid() {
            return module != null ? "" : function.parent();
        }

        @Override
        public List<MenuInfoHolder> getChildren() {
            return children;
        }

        public void setChildren(List<MenuInfoHolder> children) {
            this.children = children;
        }

        public RequestMappingInfo getInfo() {
            return info;
        }

        public void setInfo(RequestMappingInfo info) {
            this.info = info;
        }

        public HandlerMethod getMethod() {
            return method;
        }

        public void setMethod(HandlerMethod method) {
            this.method = method;
        }

        public NodeFunction getFunction() {
            return function;
        }

        public void setFunction(NodeFunction function) {
            this.function = function;
        }

        public RequestMapping getRequestMapping() {
            return requestMapping;
        }

        public void setRequestMapping(RequestMapping requestMapping) {
            this.requestMapping = requestMapping;
        }
    }


}
