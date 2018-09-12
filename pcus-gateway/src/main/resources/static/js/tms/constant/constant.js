var BILL_CONST = {
    BILL_MAIN: "MAIN",
    BILL_SUB: "SUB",
    ORG_LOAD: "LOAD",
    ORG_UNLOAD: "UNLOAD",

    DATA_BILL_MAIN: [
        {
            id: "MAIN",
            text: "主单"
        },
        {
            id: "SUB",
            text: "副单"
        }
    ],

    CNTR_PICKUP_EMPTY :"CPE", //提吉
    CNTR_PICKUP_FULL:"CPF", //提重
    CNTR_RETURN_EMPTY:"CRE", //还吉
    CNTR_RETURN_FULL:"CRF", //还重
    CNTR_PICKUP_EMPTY_RETURN_FULL: "CPERF", //提吉还重
    CNTR_PICKUP_FULL_RETURN_EMPTY: "CPFRE", //提重还吉
    CARGO_LOAD_AND_UNLOAD: "CLAU",

    DATA_TASK_TYPE_INNER: [
        {
            id: 'INNER_ADD_GAS',
            text: "加气"
        },
        {
            id: 'INNER_YEAR_AUDIT',
            text: "年审"
        }
    ],

    DATA_TASK_TYPE: [
        {
            id: 'INNER_ADD_GAS',
            text: "加气"
        },
        {
            id: 'INNER_YEAR_AUDIT',
            text: "年审"
        },
        {
            id: "CPE",
            text: "提吉"
        },
        {
            id: "CPF",
            text: "提重"
        },
        {
            id: "CRE",
            text: "还吉"
        },
        {
            id: "CRF",
            text: "还重"
        },
        {
            id: "CPFRE",
            text: "提重还吉"
        },
        {
            id: "CPERF",
            text: "提吉还重"
        },
        {
            id: "CLAU",
            text: "散货整车"
        },
        {
            id: "CGO_RET",
            text: "单程"
        },
        {
            id: "CGO_DEP",
            text: "回程"
        },
        {
            id: "CGO_MUL",
            text: "多趟"
        }
    ]
}

/**
 * 定义常用常量
 * @type {{cntr_type: string, fee_prop: string, urgent_order: string, oper_unit: string, car_type: string, cargo_type: string}}
 */
var DICT_CODE = {
    cntr_type: 'cntr_type', //柜型
    fee_prop: 'fee_prop', //计费关联属性
    fee_type: 'fee_type', //费用类型
    urgent_order: 'urgent_order', //急单类型
    oper_unit: 'oper_unit', //操作单位
    car_type: 'car_type', //车型
    cargo_type: 'cargo_type', //货物类型
    currency: 'currency', //币种
    client_busi: 'client_busi' //自定义业务
};

/**
 * 状态常量
 * @type {{STATE_10_NEW: string, STATE_11_USE: string, STATE_15_INVALID: string, STATE_20_SUBMIT: string, STATE_30_AUDIT: string, STATE_40_NEW: string, STATE_41_SUBMITTED: string, STATE_60_DISPATCHING: string, STATE_63_DISPATCHED: string, STATE_66_NOTICED: string, STATE_67_ACCEPTED: string, STATE_71_LOAD: string, STATE_72_DEPART: string, STATE_75_ARRIVED: string, STATE_77_UNLOAD: string, STATE_79_FINISH: string, STATE_89_RECEIPTED: string}}
 */
var TMS_STATE = {

    STATE_10_NEW: 'STATE_10_NEW',
    STATE_11_USE: 'STATE_11_USE',
    STATE_15_INVALID: 'STATE_15_INVALID',
    STATE_20_SUBMITTED: 'STATE_20_SUBMITTED',
    STATE_30_AUDIT: 'STATE_30_AUDIT',

    STATE_40_NEW: 'STATE_40_NEW',
    STATE_41_SUBMITTED: 'STATE_41_SUBMITTED',
    STATE_45_NOTICED: 'STATE_45_NOTICED',

    STATE_60_ACCEPTED: 'STATE_60_ACCEPTED',
    STATE_61_DEPART: 'STATE_61_DEPART',
    STATE_69_REFUESED: 'STATE_69_REFUESED',

    STATE_71_PICKUP_CNTR: 'STATE_71_PICKUP_CNTR',
    STATE_73_LOAD: 'STATE_73_LOAD',
    STATE_75_UNLOAD: 'STATE_75_UNLOAD',
    STATE_76_UNLOAD_CNTR: 'STATE_76_UNLOAD_CNTR',
    STATE_77_RETURN_CNTR: 'STATE_77_RETURN_CNTR',
    STATE_79_FINISH: 'STATE_79_FINISH',
    STATE_90_RECEIPTED: 'STATE_90_RECEIPTED',
    STATE_91_STOPPED: 'STATE_91_STOPPED',
    STATE_92_CANCEL: 'STATE_92_CANCEL'
}

var TMS_STATE_NAME = {

    STATE_10_NEW: '新记录',
    STATE_11_USE: '使用中',
    STATE_15_INVALID: '已失效',
    STATE_20_SUBMITTED: '已提交',
    STATE_30_AUDIT: '已审核'
}

/**
 * 业务类型
 * @type {{}}
 */
var TMS_BUSI_TYPE = {

    TYPE_FRONT_ACRGO: 'TYPE_FRONT_CARGO',
    TYPE_FRONT_CNTR_IMPORT: 'TYPE_FRONT_CNTR_IMPORT',
    TYPE_FRONT_CNTR_EXPORT: 'TYPE_FRONT_CNTR_EXPORT',
    TYPE_FRONT_DISTR: 'TYPE_FRONT_DISTR',

    TYPE_ORDER_CARGO: 'TYPE_ORDER_CARGO',
    TYPE_ORDER_CNTR_IMPORT: 'TYPE_ORDER_CNTR_IMPORT',
    TYPE_ORDER_CNTR_EXPORT: 'TYPE_ORDER_CNTR_EXPORT',
    TYPE_ORDER_DISTR: 'TYPE_ORDER_DISTR',
    TYPE_ORDER_EXPENSE_BILL: 'TYPE_ORDER_EXPENSE_BILL',

    TYPE_TRANS_CARGO: 'TYPE_TRANS_CARGO',
    TYPE_TRANS_CNTR_IMPORT: 'TYPE_TRANS_CNTR_IMPORT',
    TYPE_TRANS_CNTR_EXPORT: 'TYPE_TRANS_CNTR_EXPORT',
    TYPE_TRANS_DISTR: 'TYPE_TRANS_DISTR'

}

/**
 * 查询常量
 * @type {{}}
 */
var selectMonth = [];
var selectYear = [];
var year = new Date().getFullYear() - 1;
for (var i = 0; i < 5; i++) {
    var temp = {text: year + i, id: (year + i) + ''};
    selectYear.push(temp);
}
for (var i = 0; i < 12; i++) {
    var temp = {text: i + 1, id: (i + 1) + ''};
    selectMonth.push(temp);
}

var QUERY_CONST = {
    SELECT_MONTH: selectMonth,
    SELECT_YEAR: selectYear,
};
