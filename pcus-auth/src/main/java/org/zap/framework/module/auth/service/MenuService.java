package org.zap.framework.module.auth.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.module.auth.entity.Menu;
import org.zap.framework.module.auth.entity.SubMenu;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.orm.extractor.BeanListExtractor;
import org.zap.framework.util.MathUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 菜单权限服务
 */
@Service
@Transactional
public class MenuService extends BusiService {

    /**
     * 添加菜单入口
     * @param entity
     *
     */
    public void add(Menu entity) {

        //最大编号
        Menu maxNo = baseDao.queryOneByClause(Menu.class, " AM.DR = 0 AND AM.PID = ? ORDER BY AM.NO DESC", entity.getPid());

        if (maxNo == null) {
            entity.setNo(entity.getNo() + "001");
        } else {
            //编码长度为3位
            String last3 = maxNo.getNo().substring(StringUtils.length(maxNo.getNo()) - 3);
            entity.setNo(StringUtils.trimToEmpty(entity.getNo()) + StringUtils.leftPad(String.valueOf(Integer.parseInt(last3) + 1), 3, "0"));
        }

        entity.setMlevel(entity.getMlevel() > 0 ? entity.getMlevel() : entity.getMlevel() + 1);

        LocalDateTime now = LocalDateTime.now();
        entity.setCreate_time(now);
        entity.setModify_time(now);

        baseDao.insert(entity);

    }

    /**
     * 添加菜单入口
     * 插入到编码最小空缺值
     * @param entity
     */
    public void addMinOpening(Menu entity, String startno) {

        Assert.notNull(entity.getPid(), "父菜单主键不能为空");

        List<Menu> query = baseDao.query("SELECT AM.NO FROM ZAP_AUTH_MENU AM WHERE AM.DR = 0 AND AM.PID = ? AND AM.NO >= ? ORDER BY AM.NO DESC",
                new Object[]{ entity.getPid(), StringUtils.defaultIfEmpty(startno, "000") },
                new BeanListExtractor<>(Menu.class));

        if (query.size() == 0) {
            entity.setNo(StringUtils.trimToEmpty(entity.getNo()) + StringUtils.defaultIfEmpty(startno, "001"));
        } else {

            String[] nos = query.stream().map(m -> m.getNo()).toArray(String[]::new);

            String minOpening = MathUtils.getMinOpening(nos, 3);
            entity.setNo(minOpening);
        }

        entity.setMlevel(entity.getMlevel() > 0 ? entity.getMlevel() : entity.getMlevel() + 1);

        LocalDateTime now = LocalDateTime.now();
        entity.setCreate_time(now);
        entity.setModify_time(now);

        baseDao.insert(entity);
    }

    /**
     * 返回被禁用的按钮
     *
     * @param no   页面编码
     * @param user 登录用户
     */
    public List<String> loadButtonCodes(String no, User user) {
        if (user.isAdmin()) {
            return new ArrayList<>();
        }

        //所有受控按钮
        List<Menu> list = baseDao.queryByClause(Menu.class, " AM.DR = 0 AND AM.MLEVEL = 3 AND AM.VISIBLE = 'Y' AND AM.NO LIKE '"
                + no + "' || '%' AND AM.ID NOT IN (SELECT OBJECT_ID FROM ZAP_AUTH_PRIVILEGE WHERE DR = 0 AND `ACCESSIBLE` = 'Y' AND ( SUBJECT_ID = '" + user.getId()
                + "' OR SUBJECT_ID IN (SELECT UR.ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE UR WHERE UR.USER_ID = '" + user.getId() + "')))");

        return list.stream().map(Menu::getCode).collect(Collectors.toList());
        //return Utils.collection2FieldList(list, "code", String.class);
    }

    /**
     * 加载子系统的菜单，必须传入父菜单的编码
     * @param user 登录用户
     * @param subCode 父菜单编码
     * @param tree 是否属性
     * @return
     */
    public List<SubMenu> loadSubMenus(User user, String subCode, boolean tree) {
        Menu menu = queryOneByClause(Menu.class, "AM.DR = 0 AND AM.CODE = ?", subCode);
        return menu == null || StringUtils.isEmpty(menu.getNo()) ?  new ArrayList<>() : loadMenus(user, menu.getNo(), tree);
    }


    /**
     * 通过菜单编码加载子菜单树，必须保证父菜单编码全局唯一
     *
     * @param user 用户
     * @param tree
     * @return
     */
    public List<SubMenu> loadMenus(User user, String parentPageNo, boolean tree) {
        return tree ? tree(SubMenu.class, clause(user, parentPageNo)) : list(SubMenu.class, clause(user, parentPageNo));
    }

    /**
     * 统一用户菜单加载条件
     *
     * @param user
     * @param parentPageNo
     * @return
     */
    private String clause(User user, String parentPageNo) {

        return " AM.DR = 0 AND AM.VISIBLE='Y' AND AM.NO LIKE '" + parentPageNo + "%' "
                //判断是否管理员
                + (user.isAdmin() ? "" : new StringBuffer("AND AM.ID IN  (SELECT OBJECT_ID FROM ZAP_AUTH_PRIVILEGE WHERE DR = 0 AND" +
                " ( SUBJECT_ID = '" + user.getId() + "' OR SUBJECT_ID IN (SELECT UR.ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE UR WHERE UR.USER_ID = '" + user.getId() + "')) AND ")
                //是否可访问
                .append("`ACCESSIBLE` = 'Y')").toString())
                + " ORDER BY AM.MORDER";
    }


    /**
     * 加载菜单
     *
     * @param user         用户
     * @param authorizable 通过可授权过滤数据，加载普通菜单时是false
     * @param tree         是否加载树形结构
     * @return
     */
    public List<Menu> loadMenus(User user, boolean authorizable, boolean tree, boolean visible) {
        if (tree) {
            return tree(Menu.class, clause(user, authorizable, visible));
        } else {
            return list(Menu.class, clause(user, authorizable, visible));
        }
    }

    /**
     * 统一用户菜单加载条件
     *
     * @param user
     * @param authorizable
     * @return
     */
    private String clause(User user, boolean authorizable, boolean visible) {

        return "AM.DR=0 AND AM.UNINTERCEPT = 'N' AND AM.MLEVEL IN (1, 2 " + (authorizable ? ",3" : "") + ")" + (visible ? " AND AM.VISIBLE='Y' " : "")
                //判断是否管理员
                + (user.isAdmin() ? "" : new StringBuffer("AND AM.ID IN  (SELECT OBJECT_ID FROM ZAP_AUTH_PRIVILEGE WHERE DR = 0 AND" +
                " ( SUBJECT_ID = '" + user.getId() + "' OR SUBJECT_ID IN (SELECT UR.ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE UR WHERE UR.USER_ID = '" + user.getId() + "')) AND ")
                //是否可访问
                .append(authorizable ? "`AUTHORIZABLE` = 'Y')" : "`ACCESSIBLE` = 'Y')").toString())
                + " ORDER BY AM.MORDER";
    }

    private static Logger logger = LoggerFactory.getLogger(MenuService.class);

}
