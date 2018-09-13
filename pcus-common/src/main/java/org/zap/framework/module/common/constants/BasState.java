package org.zap.framework.module.common.constants;

import java.util.LinkedHashMap;
import java.util.Map;

public class BasState {

    public final static Map<String, BasState> STATE_MAP = new LinkedHashMap<>();
    /**
     * 终结状态的单据
     */
    public final static Map<String, BasState> INVALID_STATE_MAP = new LinkedHashMap<>();

    public final static BasState STATE_10_NEW = new BasState("STATE_10_NEW", "新记录");
    public final static BasState STATE_11_USE = new BasState("STATE_11_USE", "使用中");
    public final static BasState STATE_15_INVALID = new BasState("STATE_15_INVALID", "已失效");

    public final static BasState STATE_20_SUBMITT = new BasState("STATE_20_SUBMIT", "已提交");
    public final static BasState STATE_30_AUDIT = new BasState("STATE_30_AUDIT", "已审核");

    static {

        STATE_MAP.put(STATE_10_NEW.getCode(), STATE_10_NEW);
        STATE_MAP.put(STATE_11_USE.getCode(), STATE_11_USE);
        STATE_MAP.put(STATE_15_INVALID.getCode(), STATE_15_INVALID);

        STATE_MAP.put(STATE_20_SUBMITT.getCode(), STATE_20_SUBMITT);
        STATE_MAP.put(STATE_30_AUDIT.getCode(), STATE_30_AUDIT);
    }

    public BasState(String code, String name) {
        this.code = code;
        this.name = name;
    }

    String code;

    String name;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    /**
     * 判断状态是否在
     *
     * @param state 待判断的状态
     * @param check
     * @return
     */
    public static boolean STATE_BEFORE(String state, BasState check) {
        return STATE_MAP.containsKey(state) ? check.getCode().compareTo(STATE_MAP.get(state).getCode()) > 0 : false;
    }

    public static boolean STATE_AFTER(String state, BasState check) {
        return STATE_MAP.containsKey(state) ? check.getCode().compareTo(STATE_MAP.get(state).getCode()) < 0 : false;
    }


    public static boolean STATE_BETWEEN(String state, BasState check_less, BasState check_greater) {
        return STATE_MAP.containsKey(state) ?
                check_less.getCode().compareTo(STATE_MAP.get(state).getCode()) <= 0 &&
                        check_greater.getCode().compareTo(STATE_MAP.get(state).getCode()) >= 0
                : false;
    }

    /**
     * @param state
     * @param check
     * @return
     */
    public static boolean STATE_EQUALS(String state, BasState check) {
        return STATE_MAP.containsKey(state) ?
                check.getCode().equals(STATE_MAP.get(state).getCode()) : false;
    }

    public static boolean STATE_NOT_EQUALS(String state, BasState check) {
        return !STATE_EQUALS(state, check);
    }

    /**
     * @param state
     * @param checks
     * @return
     */
    public static boolean STATE_IN(String state, BasState... checks) {
        if (!STATE_MAP.containsKey(state)) {
            return false;
        }
        BasState tos = STATE_MAP.get(state);
        for (int i = 0; i < checks.length; i++) {
            if (checks[i].getCode().equals(tos.getCode())) {
                return true;
            }
        }
        return false;
    }

    public static boolean STATE_NOT_IN(String state, BasState... checks) {
        return !STATE_IN(state, checks);
    }

    public static boolean STATE_IN(String state, Map<String, BasState> checkSet) {
        return checkSet.containsKey(state);
    }

    public static String STATE_NAME(String state) {
        return STATE_MAP.containsKey(state) ? STATE_MAP.get(state).getName() : "";
    }
}
