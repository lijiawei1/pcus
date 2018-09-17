package org.zap.framework.module.sys.service;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zap.framework.dao.service.BusiService;
import org.zap.framework.module.auth.entity.User;
import org.zap.framework.module.sys.entity.Dictionary;
import org.zap.framework.orm.extractor.BeanListExtractor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class DictService extends BusiService {

    /**
     * 加载数据字典
     *
     * @param user
     * @param authorizable
     * @return
     */
    public Object loadDict(User user, boolean authorizable) {

        //加载权限列表，合并
//        return queryByClause(Dictionary.class, clause(user, authorizable));

        List<Dictionary> query = getBaseDao().query(clause(user, authorizable), new BeanListExtractor<>(Dictionary.class));

        Map<String, List<Dictionary>> collect = query.stream().collect(
                Collectors.groupingBy(a -> a.getId())
        );

        List<Map<String, Object>> dictionaryList = new ArrayList<>();

        collect.entrySet().forEach(e -> {
            List<Dictionary> value = e.getValue();

            Dictionary reduce = value.stream().reduce(new Dictionary(), (acc, element) -> {
                if (StringUtils.isNotBlank(element.getRemark())) {
                    acc.setRemark(StringUtils.join(new String[]{acc.getRemark(), element.getRemark()}, ","));
                }
                return acc;
            });

            reduce.setId(value.get(0).getId());
            reduce.setDict_name(value.get(0).getDict_name());
            reduce.setDict_code(value.get(0).getDict_code());

            //合并字符串
            Map<String, Object> a = new HashMap<>();
            a.put("id", reduce.getId());
            a.put("dict_name", reduce.getDict_name());
            a.put("dict_code", reduce.getDict_code());

            //转化
            if (StringUtils.isNotBlank(reduce.getRemark())) {
                String[] split = reduce.getRemark().split(",");
                if (split != null && split.length > 0) {
                    Stream.of(split).forEach(s -> {
                        String[] kv = s.split(":");
                        //如果键值非空
                        if (StringUtils.isNotBlank(kv[0])) {
                            Object o = a.get(kv[0]);
                            boolean oldValue = BooleanUtils.toBoolean((String) o);
                            boolean newValue = BooleanUtils.toBoolean(kv[1]);
                            a.put(kv[0], String.valueOf(oldValue || newValue));
                        }
                    });
                }
            }
            dictionaryList.add(a);
        });

        return dictionaryList;
    }

    /**
     * @param user
     * @param authorizable
     * @return
     */
    private String clause(User user, boolean authorizable) {

        return " SELECT SD.DICT_NAME, SD.DICT_CODE, SD.ID, P.REMARK FROM ZAP_SYS_DICT SD LEFT JOIN ZAP_AUTH_PRIVILEGE P ON SD.ID = P.OBJECT_ID" +
        " WHERE SD.DR = 0 " +
                (user.isAdmin() ? "" :
                        (" AND SD.ID IN  (SELECT OBJECT_ID FROM ZAP_AUTH_PRIVILEGE WHERE DR = 0 AND " +
                                " ( SUBJECT_ID = '" + user.getId() + "' OR SUBJECT_ID IN (SELECT UR.ROLE_ID FROM ZAP_AUTH_RE_USER_ROLE UR WHERE UR.USER_ID = '" + user.getId() + "')) AND "
                                //是否可访问
                                + (authorizable ? "AUTHORIZABLE = 'Y')" : "`ACCESSIBLE` = 'Y')")
                                + " ORDER BY SD.DICT_NAME"));
    }

}
