<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/12/19
  Time: 10:02
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>结算信息</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .form-wrapper{
            padding-bottom: 10px;
        }
    </style>
</head>
<body>
<div class="toolbar-wrapper form-toolbar">
    <div class="l-toolbar">
        <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" data-action="select-menu">
            <span>返回</span>

            <div class="l-icon l-icon-backtrack"></div>
        </div>
    </div>
</div>
<div class="form-wrapper">
    <div class="form-wrapper-inner">
        <form id="mainForm"></form>
    </div>
</div>

<script type="text/javascript">
    var basePath = rootPath + '/tms/bas/client/';
    var formPanel = $("#mainForm");
    //页面-父容器(考虑滚动条),labelWidth,space
    var defaultFieldWidth = (function getInputWidth(diff, lw, sw) {
        var clientWidth = document.documentElement.clientWidth,
                w,
                n;
        if(clientWidth > 1366){
            n = 4;
        }
        else{
            n = 3;
        }
        w =  Math.floor((clientWidth - ((lw + sw)  * n + diff)) * (Math.floor(100/n ))/100);//截取小数点后两位（向下取整）

        var o = {
            lw: lw,
            sw: sw,
            w1: w,
            w2: (w << 1) + lw + sw, //2倍
            w3: (w + lw + sw) * 2 + w,//3倍
            wA: (w + lw + sw) * (n - 1) + w//整行
        };

        if(o.w3 > o.wA) o.w3 = o.wA;

        return o;
    })(89,110,30);
    var mainForm = formPanel.ligerForm({
        inputWidth: defaultFieldWidth.w1,
        labelWidth: defaultFieldWidth.lw,
        space: defaultFieldWidth.sw,
        fields: [
            //结算信息
            {
                group: "结算信息", display: '业务范畴', name: 'settle_service_type',  newline: false, type: 'select',
                options: {
                    url: basePath + "getServiceType",
                    split: ',',
                    isMultiSelect: true, disabled: true
                }
            },
            {
                display: '币种', name: 'settle_currency',  newline: false, type: 'select',
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=currency', disabled: true
                }
            },
            {
                display: '汇率',
                name: 'settle_exchange',

                newline: false,
                type: 'number',
                validate: {range: [0, 999999]},
                options: {
                    disabled: true
                }
            },
            {
                display: '账单日',
                name: 'settle_billday',

                newline: false,
                type: 'int',
                validate: {range: [0, 31]},
                options: {
                    disabled: true
                }
            },
            {
                display: '信用天数',
                name: 'settle_credit_days',

                newline: false,
                type: 'int',
                validate: {range: [0, 9999]},
                options: {
                    disabled: true
                }
            },
            {
                display: '信用额度',
                name: 'settle_credit_amount',

                newline: false,
                type: 'number',
                validate: {range: [0, 999999999]},
                options: {
                    disabled: true
                }
            },
            {
                display: '结算方式', name: 'settle_type',  newline: false, type: 'select', options: {
                url: rootPath + '/tms/bas/dict/getData?query=settle_type', disabled: true
            }
            },
            {
                display: '付款方式', name: 'settle_pay_type',  newline: false, type: 'select', options: {
                url: rootPath + '/tms/bas/dict/getData?query=pay_type', disabled: true
            }
            },
            {
                display: '银行', name: 'settle_bank',  newline: false, type: 'select', options: {
                url: rootPath + '/tms/bas/dict/getData?query=bank', disabled: true
            }
            },
            {
                display: '银行账号', name: 'settle_bank_account',  newline: false, type: 'text', attr: {
                maxlength: 25
            },
                options: {
                    disabled: true
                }
            },
            {
                display: '银行户名', name: 'settle_bank_name',  newline: false, type: 'text', attr: {
                maxlength: 25
            },
                options: {
                    disabled: true
                }
            },
            {
                display: '生效日期', name: 'settle_begin_date',  newline: false, type: 'date', options: {
                disabled: true
            }
            },
            {
                display: '失效日期', name: 'settle_end_date',  newline: false, type: 'date', options: {
                disabled: true
            }
            },
            {
                display: '姓名', name: 'sellte_name',  newline: false, type: 'text', attr: {
                maxlength: 10
            },
                options: {
                    disabled: true
                }
            },
            {
                display: '电话',
                name: 'sellte_mobile',

                newline: false,
                type: 'text',
                validate: {isMobile: true},
                options: {
                    disabled: true
                }
            },
            {
                display: '邮箱', name: 'sellte_email',  newline: false, type: 'text', attr: {
                maxlength: 50
            },
                options: {
                    disabled: true
                }
            },
            {
                display: '银行详细', name: 'sellte_bank_detail', width: defaultFieldWidth.w2, newline: true, rows: 4, type: 'text', attr: {
                maxlength: 200
            },
                options: {
                    disabled: true
                }
            },
            {
                display: '开票信息', name: 'sellte_bill_info', width: defaultFieldWidth.w2, newline: true, rows: 4, type: 'text', attr: {
                maxlength: 200
            },
                options: {
                    disabled: true
                }
            },
            {name: "pk_id", type: "hidden"},
            {name: "state", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify,
        pageSizeOptions:[30,50,100,500,1000],
        pageSize:50
    });

    //加载数据

    var client = ${client};
    mainForm.setData(client);

    //设置不可用

</script>
</body>
</html>
