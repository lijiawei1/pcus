package org.zap.framework.module.auth.service;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.interceptor.SimpleKey;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.*;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.orm.extractor.BeanListExtractor;
import org.zap.framework.orm.helper.BeanHelper;
import org.zap.framework.util.BuildUtils;
import org.zap.framework.util.Utils;
import org.zap.framework.util.builder.ListBuilder;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
@CacheConfig(cacheNames = AuthConstants.CACHE_PRIVILEGE)
public class PrivilegeService extends BusiService {

    static Logger logger = LoggerFactory.getLogger(Privilege.class);

    @Autowired
    CacheManager cacheManager;

    /**
     * 获取角色已分配的菜单
     *
     * @param subjectIds 权限主体主键
     * @return
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<SubMenu> loadGrantedSubMenus(String[] subjectIds) {

        if (subjectIds != null && subjectIds.length > 0) {

            StringBuffer clause = new StringBuffer(" SELECT AM.ID, AM.PID, AM.NAME FROM ZAP_AUTH_MENU AM WHERE AM.DR = 0 AND AM.VISIBLE = 'Y' ")
                    .append(" AND AM.ID IN (SELECT OBJECT_ID FROM ZAP_AUTH_PRIVILEGE WHERE DR = 0 AND OBJECT_TYPE = 'menu' AND ACCESSIBLE = 'Y' ")
                    .append(" AND SUBJECT_ID IN (").append(StringUtils.repeat("?", ",", subjectIds.length)).append(")) ")
                    .append(" ORDER BY AM.MORDER");

            return BeanHelper.buildTree(getBaseDao().query(clause.toString(), subjectIds, new BeanListExtractor(SubMenu.class)));
        } else return new ArrayList<>();

    }

    /**
     * 获取角色已分配的菜单
     *
     * @param subjectId
     * @return
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<SubMenu> loadGrantedSubMenus(String subjectId) {
        return loadGrantedSubMenus(new String[]{subjectId});
    }

    /**
     * 获取用户可授权菜单与
     *
     * @param userId 当前用户
     * @param roleId 被授权角色，获取已授权的菜单
     * @return
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<SubMenu> loadEditingSubMenus(String userId, String roleId) {

        StringBuilder sql = new StringBuilder()
                .append("SELECT AM.ID, AM.PID, AM.NAME, NVL2(P.OBJECT_ID, 'Y', 'N') AS CHECKED\n")
                .append("  FROM ZAP_AUTH_MENU AM\n")
                .append("  LEFT JOIN (SELECT PR.OBJECT_ID\n")
                .append("               FROM ZAP_AUTH_PRIVILEGE PR\n")
                .append("              WHERE PR.DR = 0\n")
                .append("                AND PR.SUBJECT_ID = ?) P\n")
                .append("    ON AM.ID = P.OBJECT_ID\n")
                .append(" WHERE AM.DR = 0\n")
                .append("   AND AM.VISIBLE = 'Y'\n")
                .append("   AND AM.ID IN\n")
                .append("       (SELECT PR.OBJECT_ID\n")
                .append("          FROM ZAP_AUTH_PRIVILEGE PR\n")
                .append("          LEFT JOIN ZAP_AUTH_RE_USER_ROLE UR\n")
                .append("            ON PR.SUBJECT_ID = UR.ROLE_ID\n")
                .append("         WHERE PR.DR = 0\n")
                .append("           AND UR.DR = 0\n")
                .append("           AND UR.USER_ID = ?)")
                .append(" ORDER BY AM.MORDER");

        List<SubMenu> query = getBaseDao().getJdbcTemplate().query(sql.toString(), (rs, rowNum) -> {
            SubMenu sm = new SubMenu();
            sm.setId(rs.getString("ID"));
            sm.setPid(rs.getString("PID"));
            sm.setName(rs.getString("NAME"));
            sm.setChecked("Y".equals(rs.getString("CHECKED")));
            return sm;
        }, new Object[]{roleId, userId});

        return BeanHelper.buildTree(query);
    }

    /**
     * 根据权限主体ID加载功能菜单
     *
     * @param subjectId   权限主体(角色ID等)
     * @param subjectType 权限类型(角色等)
     * @return
     */
    @Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
    public List<Privilege> loadMenuPrivilegesByRoleId(String subjectId, String subjectType) {
        return list(Privilege.class, " AP.DR = 0 AND AP.SUBJECT_ID = ? AND OBJECT_TYPE = ?",
                new Object[]{subjectId, subjectType});
    }

    /**
     * 批量分配权限给角色列表
     *
     * @param roleList     角色列表
     * @param parentMenuNo 父菜单编码
     */
    @CacheEvict(allEntries = true)
    public void grantPrivileges(List<Role> roleList, String parentMenuNo, User user) {

        //查询菜单
        List<Menu> menuList = queryByClause(Menu.class, "AM.NO LIKE ? || '%' ", parentMenuNo);

        int msize = menuList.size();
        int rsize = roleList.size();

        if (msize > 0 && rsize > 0) {

            List<Privilege> privilegeList = new ArrayList<>();
            List<String> paramList = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            //获取笛卡尔积关系
            roleList.forEach(role -> menuList.forEach(menu -> {
                paramList.add(role.getId());
                paramList.add(menu.getId());

                Privilege p = new Privilege();

                p.setSubject_id(role.getId());
                p.setObject_id(menu.getId());
                p.setCreator_id(user.getCreator_id());
                p.setCreate_time(now);
                p.setCorp_id(user.getCorp_id());

                privilegeList.add(p);
            }));

            //总共 r m 乘积和
            StringBuffer clause = new StringBuffer("(").append(StringUtils.repeat(" ( SUBJECT_ID = ? AND OBJECT_ID = ? ) ", "OR", msize * rsize)).append(")");

            //清空权限列表
            logger.debug("SUCCESS DELETE RELATIONS [{}]", deleteByClause(Privilege.class, clause.toString(), paramList.toArray(new String[paramList.size()])));

            //重新插入
            if (privilegeList.size() > 0) {
                logger.debug("SUCCESS SAVE RELATIONS [{}]", insertList(privilegeList, false));
            }

        }
    }


    /**
     * 分配权限
     *
     * @param role 角色带权限列表
     * @param user 当前登录用户
     */
    //@CacheEvict(allEntries = true)
    public void grantPrivileges(Role role, User user) {

        List<Privilege> plist = role.getPrivileges();
        if (plist != null && plist.size() > 0) {

            List<String> menuIdList = Utils.collection2FieldList(plist, "object_id", String.class);
            //删除当前角色选中的菜单
            deleteByClause(Privilege.class, String.format(" SUBJECT_ID = '%s' AND OBJECT_ID IN ('%s')",
                    role.getId(), String.join("','", menuIdList)));

            List<Privilege> insertList = new ArrayList<Privilege>();
            for (Privilege p : plist) {
                //勾选了可访问或者可授权
                if (p.isAccessible() || p.isAuthorizable()) {
                    insertList.add(p);
                }
            }

            //插入权限
            if (insertList.size() > 0) {
                LocalDateTime now = LocalDateTime.now();
                for (int i = 0; i < insertList.size(); i++) {
                    Privilege p = insertList.get(i);

                    p.setSubject_id(role.getId());
//					p.setObject_id(object_id);
                    p.setCreator_id(user.getId());
                    p.setCreate_time(now);
                    p.setCorp_id(user.getCorp_id());
                    p.setDept_id(user.getDept_id());
                }
                insertList(insertList, false);
            }
        }

        //清空缓存
        Cache cache = cacheManager.getCache(AuthConstants.CACHE_PRIVILEGE);
        cache.evict(SimpleKey.EMPTY);

    }

    /**
     * 复制权限
     *
     * @param from             源角色
     * @param to               目标角色
     * @param authorizableOnly 只复制可授权
     * @param authorizable     是否可授权
     */
    @CacheEvict(allEntries = true)
    public void copyPrivilege(Role from, Role to, boolean authorizableOnly, boolean authorizable) {

        List<Privilege> insertList = new ArrayList<>();
        List<Privilege> privileges = queryByClause(Privilege.class, "AP.SUBJECT_ID = ?", from.getId());
        logger.debug("清空角色[{}]权限条数[{}]", to.getRolecode(), deleteByClause(Privilege.class, "SUBJECT_ID = ?", to.getId()));

        privileges.forEach(p -> {
            p.setId(null);
            p.setVersion(0);
            p.setAuthorizable(authorizable);
            p.setAccessible(true);
            p.setSubject_id(to.getId());
            p.setCreate_time(LocalDateTime.now());
            p.setModify_time(null);
            p.setModifier_id(null);

            if (!authorizableOnly || p.isAuthorizable()) {
                insertList.add(p);
            }
        });

        logger.debug("角色[{}]从角色[{}]复制了权限条数[{}]", to.getRolecode(), from.getRolecode(), insertList.size() > 0 ? insertList(insertList, false) : 0);
    }


    /**
     * 刷新缓存
     */
    public void refresh() {
        //获取缓存
        Cache cache = cacheManager.getCache(AuthConstants.CACHE_PRIVILEGE);
        cache.evict(SimpleKey.EMPTY);
    }

    /**
     * 获取权限主客体关系
     * SimpleKeyGenerator生成主键
     */
    @Cacheable
    @Transactional(propagation = Propagation.SUPPORTS)
    public Map<String, Set<String>> loadPrivilege() {
        return loadPrivilegeInternal();
    }

    @Transactional(readOnly = true)
    public Map<String, Set<String>> loadPrivilegeInternal() {

        String sql = " SELECT AM.INTERCEPT_URL, AR.ROLECODE AS ROLECODE, AR.ID AS ROLE_ID, AU.ID AS USER_ID,AM.UNINTERCEPT" +
                " FROM ZAP_AUTH_MENU AM LEFT JOIN ZAP_AUTH_PRIVILEGE AP ON AP.OBJECT_ID = AM.ID" +
                " LEFT JOIN ZAP_AUTH_ROLE AR ON AP.SUBJECT_ID = AR.ID" +
                " LEFT JOIN ZAP_AUTH_USER AU ON AP.SUBJECT_ID = AU.ID" +
                " WHERE (AP.DR = 0 AND AM.INTERCEPT_URL IS NOT NULL) OR AM.UNINTERCEPT = 'Y'";

        List<Map<String, Object>> maplist = baseDao.queryForMapList(sql);

        Map<String, Set<String>> filter = new HashMap<>();
        for (Map<String, Object> m : maplist) {
            String url = (String) m.get("intercept_url");
            String rolecode = (String) m.get("rolecode");
            String user_id = (String) m.get("user_id");
            String role_id = (String) m.get("role_id");
            String unintercept = (String) m.get("unintercept");

            if (!filter.containsKey(url)) {
                filter.put(url, new HashSet<>());
            }

            if (StringUtils.isNotBlank(rolecode)) {
                //关联角色
                filter.get(url).add(rolecode);
            }

            if (StringUtils.isNotBlank(role_id)) {
                filter.get(url).add(role_id);
            }

            if (StringUtils.isNotBlank(user_id)) {
                //关联用户
                filter.get(url).add(user_id);
            }

            //不拦截URL
            if ("Y".equals(unintercept)) {
                //匿名用户可访问
                filter.get(url).add(AuthConstants.ROLE_ANONYMOUS);
                //登录用户可访问
                filter.get(url).add(AuthConstants.ROLE_USER);
            }
        }

        return filter;
    }

    /**
     * 加载公司，用户登录公司作为父公司过滤数据
     *
     * @param user 使用公司编码过滤 corpsn
     */
    public List<Corp> loadCorps(User user) {

        StringBuilder clause = new StringBuilder(" OC.DR = 0");
        if (!user.isAdmin() && StringUtils.isNotBlank(user.getCorpsn())) {
            clause.append(" AND OC.SN LIKE '").append(StringEscapeUtils.escapeSql(user.getCorpsn())).append("%'");
        }

        return baseDao.queryByClause(Corp.class, clause.toString());
    }

    /**
     * 加载角色
     *
     * @param role
     */
    public List<Role> loadRoles(Role role) {

        StringBuffer clause = new StringBuffer(" AR.DR = 0 ");
        ListBuilder<Object> objectListBuilder = BuildUtils.LIST_BUILDER();

        if (StringUtils.isNotBlank(role.getCorp_id())) {
            clause.append("AND AR.CORP_ID = ?");
            objectListBuilder.add(role.getCorp_id());
        }

        if (StringUtils.isNotBlank(role.getRolename())) {
            clause.append(" AND AR.ROLENAME LIKE ? ");
            objectListBuilder.add("%" + role.getRolename() + "%");
        }

        return baseDao.queryByClause(Role.class, clause.toString(), objectListBuilder.toObjectArray());
    }

}
