
package org.zap.framework.module.auth.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.security.SpringSessionBackedSessionRegistry;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.zap.framework.common.entity.LigerGridPager;
import org.zap.framework.common.entity.pagination.PaginationSupport;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.exception.BusinessException;
import org.zap.framework.module.auth.constants.AuthConstants;
import org.zap.framework.module.auth.entity.*;
import org.zap.framework.module.init.constants.SysConstants;
import org.zap.framework.module.mail.entity.MailCheckCode;
import org.zap.framework.module.org.entity.Corp;
import org.zap.framework.module.sms.entity.SmsCode;
import org.zap.framework.orm.criteria.Query;
import org.zap.framework.orm.extractor.BeanListExtractor;
import org.zap.framework.security.entity.EnhanceGrantedAuthority;
import org.zap.framework.util.SqlUtils;
import org.zap.framework.util.Utils;
import org.zap.framework.util.ValidateUtils;
import org.zap.framework.util.builder.ListBuilder;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toMap;
import static java.util.stream.Collectors.toSet;
import static org.zap.framework.util.BuildUtils.LIST_BUILDER;

@Service
@Transactional
public class UserService extends BusiService {

    Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    PasswordEncoder passwordEncoder;
    /**
     *
     */
    @Autowired
    SpringSessionBackedSessionRegistry sessionRegistry;

    @Autowired
    CacheManager cacheManager;

    /**
     * 新增用户
     * 1.登录字段用户名/邮箱/手机号
     * 2.不能全为空
     * 3.登录字段非空格式校验
     * 4.不能重复
     *
     * @param entity 用户对象
     * @return 用户对象
     */
    public User add(User entity) {

        //校验账号、手机号、邮箱不能全空
        checkAddUser(entity);

        if (StringUtils.isBlank(entity.getPassword())) {

            if (StringUtils.isNotBlank(entity.getConfirm_password())) {
                //使用确认密码
                entity.setPassword(entity.getConfirm_password());
            } else {
                log.debug("USE DEFAULT PASSWORD");
                entity.setPassword("1");
            }
        }

        //密码加密
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));

        LocalDateTime now = LocalDateTime.now();
        //创建时间
        entity.setCreate_time(now);
        //修改时间
        entity.setModify_time(now);

        getBaseDao().insert(entity);

        return entity;
    }

    /**
     * 新增用户
     * 附带
     *
     * @param entity   用户对象
     * @param roleCode 对象
     * @return
     */
    public User add(User entity, String[] roleCode) {

        add(entity);

        //分配角色
        List<Role> roles = getBaseDao().queryByClause(Role.class, "AR.DR = 0 AND " + SqlUtils.inClause("AR.ROLECODE", roleCode));

        if (roles.size() > 0) {
            //设置是否选中
            roles.forEach(r->r.setIschecked(String.valueOf(true)));
            entity.setRoles(roles);
            grantAnyRoles(entity);
        }
        return entity;
    }

    /**
     * 更新
     * 1.传入完整对象(版本校验)
     * 2.忽略密码字段
     * 3.清空当前用户的缓存
     *
     * @param user 用户对象
     * @return 更新后的用户对象
     */
    public User update(User user) {
        user.setModify_time(LocalDateTime.now());

        //将会校验版本号字段
        super.update(user, new String[]{"password"}, false);

        //清空用户缓存
        //removeUserFromCache(user);

        //检查
        checkDisableUser(user);

        return user;
    }

    /**
     * 更新登录信息
     *
     * @param user
     */
    public void updateLoginInfo(User user) {

        if (user != null) {

            LocalDateTime now = LocalDateTime.now();

            //最后登录时间
            user.setLast_login_time(now);
            //修改时间
            user.setModify_time(now);

            //检查账户生效期和过期
            LocalDateTime enabled_time = user.getEnabled_time();

            //过期时间
            LocalDateTime expired_time = user.getExpired_time();

            //账户未过期
            if (enabled_time != null && now.compareTo(enabled_time) > 0) {
                user.setEnabled(true);
            }

            //账户已经过期
            if (expired_time != null && now.compareTo(expired_time) > 0) {
                user.setEnabled(false);
            }

            getBaseDao().updateNotVersion(user);

            checkDisableUser(user);

            //removeUserFromCache(user);
        }

    }

    /**
     * 批量添加用户
     * 用户名重复解决
     */
    public void addBatchUser(List<User> userList) {
        if (userList.size() > 0) {

            //查询系统现有的所有账号名
            List<User> users = getBaseDao().queryByClause(User.class, " ifnull(AU.DR,0) = 0 AND AU.ACCOUNT IS NOT NULL");

            //账号集
            Set<String> collect = users.stream().map(u -> u.getAccount()).collect(toSet());

            for (User user : userList) {

                int start = 0;
                //账号
                String account = user.getAccount();
                //备注原用户名
                user.setRemark(user.getAccount());

                while (collect.contains(user.getAccount())) {
                    //用户名++
                    user.setAccount(account + String.valueOf(++start));
                }

                //将用户名添加到集合中
                collect.add(user.getAccount());
            }

            //插入用户
            getBaseDao().insertList(userList, false);
        }
    }


    /**
     * 更新用户账号
     * 1.用户账号/手机号/邮箱为登录字段
     *
     * @param user 用户对象
     */
    public void updateByAccount(User user) {

        User dbUser = findUserWithRolesByAccount(user.getAccount());

        if (dbUser != null) {

            LocalDateTime now = LocalDateTime.now();

            //最后登录IP
            dbUser.setLast_login_ip(user.getLast_login_ip());
            //最后登录时间
            dbUser.setLast_login_time(now);
            //修改时间
            dbUser.setModify_time(now);

            //检查账户生效期和过期
            LocalDateTime enabled_time = dbUser.getEnabled_time();

            //过期时间
            LocalDateTime expired_time = dbUser.getExpired_time();

            //账户未过期
            if (enabled_time != null && now.compareTo(enabled_time) > 0) {
                dbUser.setEnabled(true);
            }

            //账户已经过期
            if (expired_time != null && now.compareTo(expired_time) > 0) {
                dbUser.setEnabled(false);
            }

            baseDao.update(dbUser);

            checkDisableUser(user);

            //removeUserFromCache(user);
        }
    }

    /**
     * 批量用户更新部分字段
     *
     * @param users
     * @param fields
     * @return
     */
    public int updatePartFields(User[] users, String[] fields) {

        Assert.notEmpty(users, "参数不能为空");

        List<String> fieldlist = new ArrayList<String>();
        if (fields != null) {
            Collections.addAll(fieldlist, fields);
        }

        fieldlist.remove("password");
        fieldlist.add("modify_time");

        Stream.of(users).forEach(u -> u.setModify_time(LocalDateTime.now()));
        int rows = update(users, fieldlist.toArray(new String[fieldlist.size()]), true);
        //检查乐观锁
        checkOptimisticLock(rows, users.length);

        //清空用户缓存
        //removeUserFromCache(user);

        //移除用户SESSION
        checkDisableUser(users);

        return rows;
    }


    /**
     * 用户更新部分字段
     *
     * @param user
     * @param fields
     */
    public int updatePartFields(User user, String[] fields) {

        Assert.notNull(user, "参数不能为空");

        List<String> fieldlist = new ArrayList<String>();
        if (fields != null) {
            Collections.addAll(fieldlist, fields);
        }

        fieldlist.remove("password");
        fieldlist.add("modify_time");

        user.setModify_time(LocalDateTime.now());
        int r = super.update(user, fieldlist.toArray(new String[fieldlist.size()]), true);
        checkOptimisticLock(r, 1);
        //清空用户缓存
        //removeUserFromCache(user);

        //移除用户SESSION
        checkDisableUser(user);

        return r;
    }


    /**
     * 删除用户
     *
     * @param user
     */
    public void remove(User user) {
        user.setDr(1);
        update(user, new String[] {"dr"}, true);
        //super.remove(user);

        //移除用户session
        removeUserSession(new String[]{user.getId()});

        //清空用户登录缓存
        //removeUserFromCache(user);
    }

    /**
     * 批量业务删除用户
     *
     * @param ids
     */
    public void remove(String[] ids) {

        Assert.notEmpty(ids, "参数不能为空");

        User[] users = new User[ids.length];
        for (int i = 0; i < ids.length; i++) {
            users[i] = new User();
            users[i].setId(ids[i]);
            users[i].setDr(1);
            users[i].setModify_time(LocalDateTime.now());
        }
        getBaseDao().updateNotVersion(users, new String[]{"dr"}, true);
        //清空session
        removeUserSession(ids);
    }


    /**
     * 移除session
     *
     * @param user
     */
    public void removeSession(User user) {


    }


    /**
     * 校验登录账号唯一
     *
     * @param user 用户
     * @return 是否唯一
     */
    public boolean checkUserUnique(User user) {

        //多账号用户登录
        return 0 == queryCount(User.class, " AU.DR = 0 "
                        + " AND AU.ID <> ? "
                        + " AND (AU.ACCOUNT = ? "
                        + " OR (AU.MOBILE = ?) "
                        + " OR (AU.EMAIL = ?) "
                        + " OR (AU.QQNO = ?) "
                        + " OR (AU.WECHATNO = ?))",
                StringUtils.defaultIfBlank(user.getId(), "###"),
                user.getAccount(),
                user.getMobile(),
                user.getEmail(), user.getQqno(), user.getWechatno());

    }

    /**
     * 修改密码
     *
     * @param id       用户ID
     * @param loginPwd 新密码
     */
    @Deprecated
    public User changePassword(String id, String loginPwd) {

        User user = baseDao.queryByPrimaryKey(User.class, id);
        if (user == null) {
            throw new BusinessException("非法用户");
        }
        user.setPassword(passwordEncoder.encode(loginPwd));
        baseDao.update(user, new String[]{"password"}, true);

        //从缓存中移除
        //removeUserFromCache(user);

        return user;
    }


    /**
     * 修改密码
     * <p>
     * 原始密码可选
     *
     * @param id     用户ID
     * @param oldPwd 原始密码
     * @param newPwd 新密码
     */
    public User changePassword(String id, String oldPwd, String newPwd) {

        String newPassword = StringUtils.trimToEmpty(newPwd);
        String userId = StringUtils.trimToEmpty(id);

        if (userId.length() == 0) {
            log.error("USER ID EMPTY [{}]", id);
            throw new BusinessException("修改密码[用户ID]不能为空");
        }
        if (newPassword.length() == 0) {
            log.error("NEW PASSWORD INVALID [{}]", newPassword);
            throw new BusinessException("修改密码[新密码]不能为空");
        }

        //
        User user = baseDao.queryByPrimaryKey(User.class, userId);
        if (user != null) {
            if (StringUtils.isNotBlank(oldPwd) && !passwordEncoder.matches(oldPwd, user.getPassword())) {
                //密码校验
                throw new BusinessException("原密码输入错误!");
            }

            //加密新密码
            user.setPassword(passwordEncoder.encode(newPassword));
            //修改时间
            user.setModify_time(LocalDateTime.now());
            //更新密码字段
            getBaseDao().update(user, new String[]{"password"}, true);
            //从缓存中移除
            //removeUserFromCache(user);
            return user;
        } else {
            log.error("USER NOT EXIST, ID[{}]", userId);
            throw new BusinessException("用户不存在[" + userId + "]");
        }
    }

    /**
     * 重置密码
     *
     * @return
     */
    public User resetPassword(String id, String newPwd) {

        String newPassword = StringUtils.trimToEmpty(newPwd);
        String userId = StringUtils.trimToEmpty(id);

        if (userId.length() == 0) {
            log.error("USER ID EMPTY [{}]", id);
            throw new BusinessException("修改密码[用户ID]不能为空");
        }
        if (newPassword.length() == 0) {
            log.error("NEW PASSWORD INVALID [{}]", newPassword);
            throw new BusinessException("修改密码[新密码]不能为空");
        }

        User user = baseDao.queryByPrimaryKey(User.class, userId);
        if (user != null) {
            //加密新密码
            user.setPassword(passwordEncoder.encode(newPassword));
            //修改时间
            user.setModify_time(LocalDateTime.now());
            //更新密码字段
            getBaseDao().update(user, new String[]{"password"}, true);
            //从缓存中移除
            //removeUserFromCache(user);

            return user;
        } else {
            log.error("USER NOT EXIST, ID[{}]", userId);
            throw new BusinessException("用户不存在[" + userId + "]");
        }
    }

    /**
     * 加载左侧用户树
     *
     * @param filter 用户过滤信息
     * @return
     */
    public List<User> loadUsers(UserFilter filter) {

        Query<User> query = baseDao.getQuery(User.class).eq("dr", 0)
                .eq("corp_id", filter.getFiltercorp())
                .like(filter.getFilterfield(), filter.getFiltername());

        //Criteria<User> criteria = busiDao.getBuilder(User.class).createCriteria().eq("dr", 0)
        //        .eq("corp_id", filter.getFiltercorp())
        //        .eq(filter.getFilterfield(), filter.getFiltername());

        //是否锁定
        if (UserFilter.PLAIN.equals(filter.getFiltertype())) {
            query.eq("enabled", Boolean.TRUE);

        } else if (UserFilter.LOCKED.equals(filter.getFiltertype())) {
            query.eq("enabled", Boolean.FALSE);
        }

        return query.list();

    }

    /**
     * 加载角色子表
     *
     * @param user
     * @param page
     * @param pagesize
     * @param sortname
     * @param sortorder
     */
    public LigerGridPager<Role> loadPageRoles(User user, int page, int pagesize, String sortname, String sortorder) {

        //拼装条件，可以使用builder
        return new LigerGridPager<Role>(baseDao.queryPage(Role.class,
                " AR.DR = 0 AND AR.ID IN ( SELECT ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE WHERE USER_ID = '" + user.getId() + "' )",
                page - 1, pagesize));

    }

    public PaginationSupport<User> loadPageUsersWithRols(LigerGridPager<?> req, String where) {
        PaginationSupport<User> page = page(User.class, req, where);

        List<User> data = page.getData();
        if (data != null && data.size() > 0) {
            //查找角色列表

            Map<String, User> collect = data.stream().collect(Collectors.toMap(d -> d.getId(), d -> d));
            String[] ids = collect.keySet().toArray(new String[collect.size()]);
            List<Role> query = getBaseDao().getJdbcTemplate().query("SELECT UR.USER_ID AS ID,R.ROLENAME AS ROLENAME FROM ZAP_AUTH_RE_USER_ROLE UR LEFT JOIN ZAP_AUTH_ROLE R ON UR.ROLE_ID = R.ID WHERE " + SqlUtils.inClause("USER_ID", ids),
                    (rs, rowNum) -> {
                        Role c = new Role();
                        c.setRolename(rs.getString("ROLENAME"));
                        c.setId(rs.getString("ID"));
                        return c;
                    });
            query.forEach(r -> {
                if (collect.containsKey(r.getId())) {
                    collect.get(r.getId()).getRoles().add(r);
                }
            });
        }
        return page;
    }

    /**
     * 分配用户功能加载角色树
     *
     * @param user corp_id
     */
    public List<Role> loadSelectRoles(User user, boolean admin) {

        //用户已经选中的角色
        List<ReUserRole> relist = baseDao.queryByClause(ReUserRole.class, " ARUR.DR = 0 AND ARUR.USER_ID = ? ", user.getId());
        Set<String> roleids = Utils.collection2FieldSet(relist, "role_id", String.class);

        //该用户所有角色
        List<Role> rolelist = baseDao.queryByClause(Role.class, " AR.DR = 0 AND AR.CORP_ID IN (?, ?) ",
                user.getCorp_id(),
                (admin ? SysConstants.CORPORATION_ROOT_ID : ""));
        //设置选中
        rolelist.stream().filter(r -> roleids.contains(r.getId())).forEach(r -> {
            //设置选中
            r.setIschecked(Boolean.TRUE.toString());
        });
        return rolelist;

    }

    /**
     * 获取用户列表
     *
     * @param corp_id 公司主键
     * @param user_id 用户主键
     * @return
     */
    public List<RoleCheck> loadRoles(String corp_id, String user_id) {

        ListBuilder<Object> listBuilder = LIST_BUILDER();
        StringBuilder sqlBuilder = new StringBuilder("");

        if (StringUtils.isNotEmpty(user_id)) {
            sqlBuilder.append("SELECT R.*,NVL2(UR.ROLE_ID,'Y','N') AS CHECKED FROM ZAP_AUTH_ROLE R LEFT JOIN (SELECT USER_ID,ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE WHERE USER_ID = ? ) UR ON R.ID = UR.ROLE_ID");
            listBuilder.add(user_id);
        } else {
            sqlBuilder.append("SELECT R.*,'N' AS CHECKED FROM ZAP_AUTH_ROLE R ");
        }

        sqlBuilder.append(" WHERE R.DR = 0 AND R.CORP_ID = ?");
        listBuilder.add(corp_id);

        return baseDao.query(sqlBuilder.toString(), listBuilder.toObjectArray(), new BeanListExtractor(RoleCheck.class));
    }

    /**
     * 获取可用的用户
     *
     * @param corp_id
     * @return
     */
    public List<UserCheck> loadUserByCorpId(String corp_id) {
        StringBuilder builder = new StringBuilder("SELECT U.ID,U.NAME,U.ACCOUNT,U.EMAIL,U.MOBILE FROM ZAP_AUTH_USER U WHERE U.CORP_ID = ?");
        return getBaseDao().query(builder.toString(), new Object[]{corp_id},
                new BeanListExtractor<>(UserCheck.class));
    }

    /**
     * 数据库查询用户
     * 已经使用默认的CacheManager和userCache设置了缓存
     */
    public User loadUserByUsername(String account) throws UsernameNotFoundException {

        User currentUser = (User) getUserFromCache(account);
        if (currentUser != null) {
            log.debug("Get user from cache：" + currentUser.getAccount());
            return currentUser;
        }

        currentUser = findUserWithRolesByAccount(account);

        if (currentUser == null)
            throw new UsernameNotFoundException("用户不存在：" + account);

//		if (currentUser.getExpired_time().isBefore(LocalDateTime.now())) {
//			throw new BusinessException("用户已经过期无效");
//		}

        log.debug("Query user from database [{}]", currentUser.getAccount());

        if (currentUser.isAdmin()) {
            //如果是管理员权限
            currentUser.getAuthorities().add(new EnhanceGrantedAuthority(AuthConstants.ROLE_SYSTEM, AuthConstants.ROLE_SYSTEM,
                    AuthConstants.ROLE_SET.get(AuthConstants.ROLE_SYSTEM), null));
        }

        //登录用户都拥有的权限角色
        //currentUser.getAuthorities().add(new SimpleGrantedAuthority(AuthConstants.ROLE_USER));
        currentUser.getAuthorities().add(new EnhanceGrantedAuthority(AuthConstants.ROLE_USER, AuthConstants.ROLE_USER,
                AuthConstants.ROLE_SET.get(AuthConstants.ROLE_USER), null));
        //登录用户自身ID作为权限判断
        //currentUser.getAuthorities().add(new SimpleGrantedAuthority(currentUser.getId()));
        currentUser.getAuthorities().add(new EnhanceGrantedAuthority(currentUser.getId(), currentUser.getUsername(),
                currentUser.getUsername(), null));

        if (currentUser.getRoles() != null) {
            for (Role role : currentUser.getRoles()) {
                //currentUser.getAuthorities().add(new SimpleGrantedAuthority(role.getRolecode()));
                currentUser.getAuthorities().add(new EnhanceGrantedAuthority(role));

            }
        }

        //putUserInCache(currentUser);

        return currentUser;
    }

    /**
     * 使用登录账号查找用户，带出角色列表
     * 1.登录账号 ACCOUNT、MOBILE、EMAIL
     *
     * @param account
     */
    public User findUserWithRolesByAccount(String account) {

        User user = null;

        try {

            //多账号用户登录
            user = queryOneByClause(User.class, " AU.DR = 0 AND (AU.ACCOUNT = ? "
                    + " OR (AU.MOBILE = ? AND AU.MOBILE_ENABLED = 'Y') "
                    + " OR (AU.EMAIL = ? AND AU.EMAIL_ENABLED = 'Y') "
                    + " OR (AU.QQNO = ? AND AU.QQNO_ENABLED = 'Y') "
                    + " OR (AU.WECHATNO = ? AND AU.WECHATNO_ENABLED = 'Y'))", account, account, account, account, account);

            if (user != null) {
                //查找用户的角色
                user.setRoles(findRolesByUser(user));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return user;
    }

    /**
     * 使用用户查找角色
     *
     * @param user
     */
    public List<Role> findRolesByUser(User user) {
        return queryByClause(Role.class, " AR.DR = 0 AND AR.ID IN ( SELECT ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE WHERE DR = 0 AND USER_ID = ?)",
                user.getId());
    }

    /**
     * 移除角色
     *
     * @param user
     */
    public void removeRolesFromUser(User user) {

        deleteByClause(ReUserRole.class, String.format(" USER_ID = '%s' AND ROLE_ID IN ( '%s' ) ", user.getId(),
                StringUtils.join(Utils.collection2FieldList(user.getRoles(), "id", String.class), "','")
        ));

        //removeUserFromCache(user);
    }

    /**
     * 给角色批量分配用户
     *
     * @param roleCheck 角色
     */
    //@CacheEvict(allEntries = true)
    public void grantAnyUsers(RoleCheck roleCheck, User currentUser) {

        //公司
        String corp_id = currentUser == null ? "" : currentUser.getCorp_id();
        //创建人
        String creator_id = currentUser == null ? "" : currentUser.getId();

        LocalDateTime now = LocalDateTime.now();
        List<UserCheck> users = roleCheck.getUsers();

        if (users != null && users.size() > 0) {

            StringBuilder clause = new StringBuilder(" ROLE_ID = ? AND USER_ID IN (")
                    .append(StringUtils.repeat("?", ",", users.size()))
                    .append(")");

            String[] userIds = users.stream().map(u -> u.getId()).toArray(String[]::new);

            int i = deleteByClause(ReUserRole.class, clause.toString(),
                    //参数列表
                    LIST_BUILDER(roleCheck.getId()).add(userIds).toObjectArray());

            log.debug("Remove user role relations [{}]", i);

            //要插入的关系
            List<ReUserRole> insertList = new ArrayList<>();
            users.stream().filter(u -> u.isChecked()).forEach(u -> {
                ReUserRole re = new ReUserRole();
                re.setCorp_id(corp_id);
                re.setUser_id(u.getId());
                re.setRole_id(roleCheck.getId());
                re.setCreator_id(creator_id);
                re.setCreate_time(now);
                insertList.add(re);
            });

            if (insertList.size() > 0) {
                insertList(insertList, false);
            }

            //更新session中的登录用户
            removeUserSession(userIds);

            //删除用户缓存
            //removeUserFromCache(userIds);
        }
    }


    /**
     * 批量分配角色
     *
     * @param userList 用户列表
     */
    public void grantAnyRoles(List<User> userList) {
        userList.forEach(this::grantAnyRoles);
    }

    /**
     * 分配角色，检查ischecked字段，true插入，false删除
     *
     * @param user 用户
     */
    //@CacheEvict(allEntries = true)
    public void grantAnyRoles(User user) {

        List<Role> roles = user.getRoles();
        if (roles != null && roles.size() > 0) {
            //角色主键
            List<String> roleIdList = Utils.collection2FieldList(roles, "id", String.class);
            //删除当前所有角色
            deleteByClause(ReUserRole.class, String.format(" USER_ID = '%s' AND ROLE_ID IN ('%s')",
                    user.getId(), String.join("','", roleIdList)));

            //要插入的角色
            List<String> insertList = roles.stream().filter(r -> Boolean.parseBoolean(r.getIschecked())).map(Role::getId).collect(Collectors.toList());
            //判断是否被选中

            if (insertList.size() > 0) {
                //添加新角色
                ReUserRole[] res = new ReUserRole[insertList.size()];
                LocalDateTime now = LocalDateTime.now();
                for (int i = 0; i < res.length; i++) {
                    res[i] = new ReUserRole();
                    res[i].setCorp_id(user.getCorp_id());
                    res[i].setUser_id(user.getId());
                    //角色主键
                    res[i].setRole_id(insertList.get(i));
                    res[i].setCreate_time(now);
                }
                insertArray(res, false);
            }

            //使用户session失效
            removeUserSession(new String[]{user.getId()});

            //清空用户缓存
            //removeUserFromCache(user);


        }
    }


    /**
     * 分配角色，删除原有角色，添加当前角色
     *
     * @param user
     */
    @Deprecated
    public void grantRoles(User user) {

        //删除用户原有角色
        deleteByClause(ReUserRole.class, String.format(" USER_ID = '%s'", user.getId()));

        LocalDateTime now = LocalDateTime.now();

        Collection<Role> rolelist = user.getRoles();
        if (rolelist == null || rolelist.size() == 0)
            return;

        //添加新角色
        ReUserRole[] res = new ReUserRole[rolelist.size()];
        Role[] roles = rolelist.toArray(new Role[rolelist.size()]);
        for (int i = 0; i < res.length; i++) {
            res[i] = new ReUserRole();
            res[i].setCorp_id(user.getCorp_id());
            res[i].setUser_id(user.getId());
            res[i].setRole_id(roles[i].getId());
            res[i].setCreate_time(now);
        }
        insertArray(res, false);

        removeUserSession(new String[]{user.getId()});

        //removeUserFromCache(user);
    }


    /**
     * 放入用户缓存
     * id对应多个账号
     * 账号对应UserDetails
     *
     * @param currentUser
     */
    protected void putUserInCache(User currentUser) {

        try {

            Cache userCache = retrieveUserCache();

            List<String> accountList = new ArrayList<>();

            String account = currentUser.getAccount();

            if (StringUtils.isNotEmpty(account)) {
                //userCache.acquireWriteLockOnKey(account);
                //try {
                userCache.put(account, currentUser);
                userCache.put("123", "4444");
                Object o1 = userCache.get("123").get();
                //log.debug("{}", o1);
                //
                //Cache.ValueWrapper valueWrapper = userCache.get(account);
                //
                //log.debug("{}", valueWrapper == null ? "" : valueWrapper.get());
                //} finally {
                //    userCache.releaseWriteLockOnKey(account);
                //}

                //Object nativeCache = userCache.getNativeCache();
                //
                //Object o = userCache.get(account).get();
                //log.debug("{}", o);
            }

            //手机号
            String mobile = currentUser.getMobile();
            if (currentUser.isMobile_enabled() && StringUtils.isNotBlank(mobile)) {
                accountList.add(mobile);

                //userCache.acquireWriteLockOnKey(mobile);
                //try {
                userCache.put(mobile, currentUser);
                //} finally {
                //    userCache.releaseWriteLockOnKey(mobile);
                //}
            }

            //邮件
            String email = currentUser.getEmail();
            if (currentUser.isEmail_enabled() && StringUtils.isNotBlank(email)) {

                accountList.add(email);

                //userCache.acquireWriteLockOnKey(email);
                //try {
                userCache.put(email, currentUser);
                //} finally {
                //    userCache.releaseWriteLockOnKey(email);
                //}
            }

            //微信
            String wechatno = currentUser.getWechatno();
            if (currentUser.isWechatno_enabled() && StringUtils.isNotBlank(wechatno)) {

                accountList.add(wechatno);

                //userCache.acquireWriteLockOnKey(wechatno);
                //try {
                userCache.put(wechatno, currentUser);
                //} finally {
                //    userCache.releaseWriteLockOnKey(wechatno);
                //}
            }

            //qq
            String qqno = currentUser.getQqno();
            if (currentUser.isQqno_enabled() && StringUtils.isNotBlank(qqno)) {

                accountList.add(qqno);
                userCache.put(qqno, currentUser);

                //userCache.acquireWriteLockOnKey(qqno);
                //try {
                //    userCache.putIfAbsent(new Element(qqno, currentUser));
                //} finally {
                //    userCache.releaseWriteLockOnKey(qqno);
                //}
            }

            //用户缓存
            String id = currentUser.getId();

            userCache.put(id, accountList);

            //userCache.acquireWriteLockOnKey(id);
            //try {
            //    userCache.putIfAbsent(new Element(id, accountList));
            //} finally {
            //    userCache.releaseWriteLockOnKey(id);
            //}

            Cache.ValueWrapper valueWrapper = userCache.get(account);

            if (valueWrapper != null) {
                Object o = valueWrapper.get();

                log.debug("{}", o);
            }

        } catch (Exception e) {
            log.error("将用户放入缓存失败", e);
        }

    }

    /**
     * 从用户缓存中获取
     *
     * @param account 用户账号
     * @return
     */
    protected UserDetails getUserFromCache(String account) {

        Cache userCache = retrieveUserCache();

        if (userCache != null) {
            //Cache.ValueWrapper valueWrapper = userCache.get(account);
            //Object o = valueWrapper.get();

            return userCache.get(account, User.class);
        } else
            return null;

        //userCache.acquireReadLockOnKey(account);
        //try {
        //    Element element = userCache.get(account);
        //    if (element != null) {
        //        result = (UserDetails) element.getObjectValue();
        //    }
        //} finally {
        //    userCache.releaseReadLockOnKey(account);
        //}
        //return result;
    }


    /**
     * 移除用户会话
     *
     * @param userids 用户主键列表
     */
    protected void removeUserSession(String[] userids) {
        if (userids != null && userids.length > 0) {

            Map<String, String> collect = Stream.of(userids).collect(toMap(u -> u, u -> u));

            //使失效
            sessionRegistry.getAllPrincipals().stream().filter(principal -> principal instanceof User).forEach(principal -> {

                User invalidateUser = (User) principal;

                if (collect.containsKey(invalidateUser.getId())) {

                    List<SessionInformation> allSessions = sessionRegistry.getAllSessions(principal, false);

                    //使失效
                    allSessions.forEach(si -> si.expireNow());
                }
            });
        }
    }

    /**
     * 更新用户权限角色
     *
     * @param userids 用户
     */
    //protected void updateAuthorities(String[] userids) {
    //
    //    if (userids != null && userids.length > 0) {
    //
    //        Map<String, String> collect = Stream.of(userids).collect(toMap(u -> u, u -> u));
    //
    //        for (Object principal : sessionRegistry.getAllPrincipals()) {
    //
    //            if (principal instanceof UserDetails) {
    //                //logger.debug(ReflectionToStringBuilder.toString(principal));
    //
    //                User currentUser = (User) principal;
    //
    //                if (collect.containsKey(currentUser.getId())) {
    //
    //                    currentUser.getAuthorities().clear();
    //
    //                    if (currentUser.isAdmin()) {
    //                        //如果是管理员权限
    //                        currentUser.getAuthorities().add(new SimpleGrantedAuthority(AuthConstants.ROLE_SYSTEM));
    //                    }
    //
    //                    //登录用户都拥有的权限角色
    //                    currentUser.getAuthorities().add(new SimpleGrantedAuthority(AuthConstants.ROLE_USER));
    //                    //登录用户自身ID作为权限判断
    //                    currentUser.getAuthorities().add(new SimpleGrantedAuthority(currentUser.getId()));
    //
    //                    //更新权限角色
    //                    List<Role> roles = queryByClause(Role.class, " AR.DR = 0 AND AR.ID IN ( SELECT ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE WHERE DR = 0 AND USER_ID = ?)",
    //                            currentUser.getId());
    //
    //                    if (roles != null) {
    //                        currentUser.setRoles(roles);
    //                        for (Role role : roles) {
    //                            currentUser.getAuthorities().add(new SimpleGrantedAuthority(role.getRolecode()));
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

    /**
     * 从用户缓存中删除
     *
     * @param currentUser 当前用户
     */
    @SuppressWarnings("unchecked")
    protected void removeUserFromCache(User currentUser) {

        Cache userCache = retrieveUserCache();
        userCache.evict(currentUser.getAccount());

        Cache.ValueWrapper valueWrapper = userCache.get(currentUser.getId());
        Object element = (valueWrapper == null ? null : userCache.get(currentUser.getId()).get());

        if (element != null) {

            List<String> accountList = (List<String>) element;
            accountList.forEach(userCache::evict);
        }
    }

    /**
     * 从缓存中移除用户
     *
     * @param ids 用户主键
     */
    protected void removeUserFromCache(String[] ids) {

        Cache userCache = retrieveUserCache();

        if (ids != null && ids.length > 0) {
            for (int i = 0; i < ids.length; i++) {

                Object element = userCache.get(ids[i]).get();

                if (element != null) {
                    List<String> accountList = (List<String>) element;

                    if (accountList != null && accountList.size() > 0) {
                        accountList.forEach(userCache::evict);
                    }
                }
            }
        }

    }

    /**
     * 获取用户缓存
     *
     * @return
     */
    private Cache retrieveUserCache() {
        return cacheManager.getCache(AuthConstants.CACHE_USER);
    }


    /**
     * 消费邮箱校验码
     *
     * @param email 邮箱
     * @param code  邮箱验证码
     * @return 是否成功
     */
    private boolean consumeEmailCode(String email, String code) {

        //检查邮箱校验码
        MailCheckCode mailCheckCode = getBaseDao().queryOneByClause(MailCheckCode.class,
                " MC.DR = 0 AND MC.USED <> 'Y' AND MC.RECEIVER = ? AND MC.CHECK_CODE = ? ",
                email, code);

        LocalDateTime now = LocalDateTime.now();
        if (mailCheckCode != null && mailCheckCode.getExpired_time().isAfter(now)) {
            mailCheckCode.setUsed_time(now);
            mailCheckCode.setUsed(true);

            //更新邮件验证码
            getBaseDao().update(mailCheckCode);

            return true;
        }
        return false;
    }

    /**
     * 消费短信验证码
     *
     * @param mobile 手机号码
     * @param code   手机验证码
     * @return 是否成功
     */
    private boolean consumeMobileCode(String mobile, String code) {
        SmsCode smsCode = getBaseDao().queryOneByClause(SmsCode.class, " ZSC.DR = 0 AND ZSC.IS_USED = 'N' AND ZSC.MOBILE = ? AND ZSC.CHECKCODE = ? ",
                mobile, code);

        LocalDateTime now = LocalDateTime.now();

        if (smsCode != null && smsCode.getExpired_time().isAfter(now)) {
            //使用时间
            smsCode.setUsed_time(now);
            smsCode.setIs_used(true);
            smsCode.setDr(1);

            //更新邮件验证码
            getBaseDao().update(smsCode);

            return true;
        }
        return false;
    }

    /**
     * 绑定邮箱
     *
     * @param id    用户主键
     * @param email 邮箱
     * @param code  邮箱验证码
     */
    public void bindEmail(String id, String email, String code) {

        if (consumeEmailCode(email, code)) {

            //更新用户
            User user = getBaseDao().queryByPrimaryKey(User.class, id);
            if (user == null) {
                throw new BusinessException("系统错误，登录用户不存在");
            }

            user.setEmail(email);
            user.setEmail_enabled(true);
            this.updatePartFields(user, new String[]{"email", "email_enabled"});
        } else {
            throw new BusinessException("邮箱验证码无效", 500);
        }
    }

    /**
     * 绑定手机
     *
     * @param id     用户主键
     * @param mobile 手机号码
     * @param code   手机验证码
     */
    public void bindMobile(String id, String mobile, String code) {

        if (consumeMobileCode(mobile, code)) {

            //更新用户
            User user = getBaseDao().queryByPrimaryKey(User.class, id);
            if (user == null) {
                throw new BusinessException("系统错误，登录用户不存在");
            }

            user.setMobile(mobile);
            user.setMobile_enabled(true);
            this.updatePartFields(user, new String[]{"mobile", "mobile_enabled"});

        } else {
            throw new BusinessException("手机验证码无效", 500);
        }
    }

    /**
     * 邮箱注册
     *
     * @param user 邮箱注册信息
     * @return 错误码
     */
    public User registerMail(UserRegisterInfo user) {
        if (consumeEmailCode(user.getEmail(), user.getEmail_verify_code())) {
            //注册用户
            return add(createUser(user));
        } else {
            throw new BusinessException("邮箱验证码无效", 500);
        }

    }

    /**
     * 手机注册
     *
     * @param user 手机号注册信息
     * @return 新增的用户信息
     */
    public User registerMobile(UserRegisterInfo user) {

        if (consumeMobileCode(user.getMobile(), user.getMobile_verify_code())) {
            //注册用户
            return add(createUser(user));
        } else {
            throw new BusinessException("手机验证码无效", 500);
        }
    }

    /**
     * 创建用户
     *
     * @param userRegister 注册信息
     * @return 用户信息
     */
    private User createUser(UserRegisterInfo userRegister) {
        User user = new User();

        //组织结构
        user.setCorp_id(userRegister.getCorp_id());
        user.setDept_id(userRegister.getDept_id());

        //账号密码
        user.setName(userRegister.getName());
        user.setAccount(userRegister.getAccount());
        user.setPassword(userRegister.getPassword());

        //邮箱
        user.setEmail(userRegister.getEmail());
        user.setEmail_enabled(true);

        //手机号
        user.setMobile(userRegister.getMobile());
        user.setMobile_enabled(true);

        //用户类型
        user.setExt_type(userRegister.getExt_type());

        user.setIs_account_non_expired(true);
        user.setIs_account_non_locked(true);
        user.setIs_credentials_non_expired(true);

        user.setEnabled(true);
        user.setEnabled_time(LocalDateTime.now());

        //是否创建公司
        if (userRegister.isCreate_corp()) {
            Corp corp = new Corp();
            corp.setName(StringUtils.defaultIfEmpty(user.getEmail(), user.getMobile()));
            corp.setExt_type("reg");
            corp.setPid(SysConstants.CORPORATION_ROOT_ID);
            corp.setCreator_id(SysConstants.USER_ADMIN_ID);
            insert(corp);

            user.setCorp_id(corp.getId());
        }

        return user;
    }


    /**
     * 检查用户是否启用
     *
     * @param users 用户列表
     */
    private void checkDisableUser(User[] users) {
        if (users != null && users.length > 0) {
            String[] ids = Stream.of(users).filter(u -> !u.isEnabled()).toArray(String[]::new);
            removeUserSession(ids);
        }
    }

    /**
     * 检查用户是否启用
     *
     * @param user
     */
    private void checkDisableUser(User user) {
        if (!user.isEnabled()) {
            //用户被禁用
            removeUserSession(new String[]{user.getId()});
        }
    }

    /**
     * 检查添加用户
     *
     * @param entity 用户实体
     */
    private void checkAddUser(User entity) {
        String account = StringUtils.trimToEmpty(entity.getAccount());
        String email = StringUtils.trimToEmpty(entity.getEmail());
        String mobile = StringUtils.trimToEmpty(entity.getMobile());

        if (account.length() == 0 && email.length() == 0 && mobile.length() == 0) {
            log.error("USER [ACCOUNT] [EMAIL] [MOBILE] NOT ALLOWED ALL EMPTY");
            throw new BusinessException("新增用户[用户名][邮箱][手机号]至少一个不为空");
        }

        //账号格式数字和英文字母
        if (account.length() > 0 && !ValidateUtils.isENG_NUM(entity.getAccount())) {
            log.error("USER [ACCOUNT] FORMAT INVALID, ONLY ALPHBAT AND NUMBER ALLOW [{}]", entity.getAccount());
            throw new BusinessException("新增用户[账号ACCOUNT]必须是英文和数字");
        }

        //校验邮箱格式
        if (email.length() > 0 && !ValidateUtils.isEmail(entity.getEmail())) {
            log.error("USER [EMAIL] FORMAT INVALID [{}] ", entity.getEmail());
            throw new BusinessException("新增用户[邮箱]格式不正确");
        }

        //校验手机号码
        if (mobile.length() > 0 && !ValidateUtils.isMobile(entity.getMobile())) {
            log.error("USER [MOBILE] FORMAT INVALID [{}]", entity.getMobile());
            throw new BusinessException("新增用户[手机号]格式不正确");
        }

        //校验账号、手机号、邮箱不能重复
        int userCount = getBaseDao().queryCount(User.class, " AU.DR = 0 AND (AU.ACCOUNT = ? OR AU.MOBILE = ? OR AU.EMAIL = ?)",
                entity.getAccount(), entity.getMobile(), entity.getEmail());
        if (userCount > 0) {
            log.error("USER [ACCOUNT] [EMAIL] [MOBILE] DUPLICATED");
            throw new BusinessException("新增用户[账号][手机号][邮箱]重复");
        }
    }

}
