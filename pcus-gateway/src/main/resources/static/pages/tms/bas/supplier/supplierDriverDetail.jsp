<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>司机信息</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .form-wrapper{
            padding-bottom: 10px;
        }
        /*更改只读样式*/
        .l-form .l-text-readonly .l-text-field,
        .l-form .l-text-disabled .l-text-field{
            color: #000;
        }
        .l-form .l-text-readonly, .l-form .l-text-disabled {
            background-color: transparent;
            border-color: transparent;
        }
    </style>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div class="tabWrapper">
    <div class="tabWrapper-inner">
        <div id="mainTab">
            <div tabid="editTab" title="资料编辑" lselected="true" data-url="${path}/tms/settle/carbilldetail/loadCard?pk_id=${pk_id}">
                <div class="toolbar-wrapper form-toolbar">
                    <div class="l-toolbar" id="topToolBar"></div>
                </div>
                <div class="form-wrapper">
                    <div class="form-wrapper-inner">
                        <form id="mainForm"></form>
                    </div>
                </div>
            </div>
            <div tabid="linkmanGridTab" title="司机合同" data-url="${path}/tms/bas/driverContract/loadPage/${pk_id}">
                <iframe frameborder="0" name="linkmanGrid" ></iframe>
            </div>
        </div>
    </div>
</div>

</body>

<script>
    //页面元素
    var $mainTab = $("#mainTab"); //页签
    var mainTab;
    var driver = ${driver};
    var pk_id = `${pk_id}`;

    //配置
    var detailTabOption = {
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize:true,
        onAfterSelectTabItem:afterSelectTabItem
    }

    $(function () {
        //创建页签
        mainTab = $mainTab.ligerTab(detailTabOption);
        //初始化激活的标签项
        afterSelectTabItem(mainTab.getSelectedTabItemID());
    });

    //标签切换事件
    function afterSelectTabItem(tabid) {
        //初始化页签
        var $tg=$(".l-tab-content [tabid='"+ tabid +"']");
        if($tg.attr("data-init")!=="init"){
            $tg.children(".l-tab-loading").show();
            var url=$tg.attr("data-url");
            $tg.children("iframe").attr("src" , url).end().attr("data-init","init");
        }
    }

</script>

<script type="text/javascript">
    var basePath = rootPath + '/tms/bas/driver/';
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
    })(89,85,30);
    var mainForm = formPanel.ligerForm({
        inputWidth: defaultFieldWidth.w1,
        labelWidth: defaultFieldWidth.lw,
        space: defaultFieldWidth.sw,
        fields: [
            //客户基本资料
            {
                group: "客户基本资料",
                display: '司机姓名', name: 'name',
                cssClass: "field"
            }, {
                display: '联系电话', name: 'mobile',
                newline: false,
                cssClass: "field"

            },
            {display: '外协', name: 'outsourcing',  newline: false, type: 'checkbox'},

            {
                display: '短号', name: 'short_no',
                newline: false,
                cssClass: "field"
            },
            {
                display: '身份证号', name: 'id_no',
                newline: false,
                cssClass: "field"
            },{
                display: '备注',
                name: 'remark',
                type: 'text',
                newline: false,
                cssClass: "field"
            },
            //结算信息
            /*  {
             group: "结算信息", display: '业务范畴', name: 'settle_service_type',  newline: false, type: 'select',
             options: {
             url: basePath + "getServiceType",
             split: ',',
             isMultiSelect: true,
             cancelable: true,
             autocomplete: true,
             keySupport: true,
             isTextBoxMode: true,
             onSuccess:function (data) {
             var g = this;
             var oldId = g.selectedValue,
             text = [],
             value = [];
             data.forEach(function(item,index){
             if(oldId && oldId.indexOf(item.id) !== -1){
             text.push(item.text);
             value.push(item.id);
             }
             });
             g.setInputValue(value,text,false)
             }
             }
             }, {
             display: '币种', name: 'settle_currency',  newline: false, type: 'select',
             options: {
             url: '/tms/bas/dict/getData?query=currency'
             }
             },  {
             display: '汇率',
             name: 'settle_exchange',

             newline: false,
             type: 'number',
             validate: {range: [0, 999999]}
             },
             {
             display: '账单日',
             name: 'settle_billday',

             newline: false,
             type: 'int',
             validate: {range: [0, 31]}
             },
             {
             display: '信用天数',
             name: 'settle_credit_days',

             newline: false,
             type: 'int',
             validate: {range: [0, 9999]}
             },
             {
             display: '信用额度',
             name: 'settle_credit_amount',

             newline: false,
             type: 'number',
             validate: {range: [0, 999999999]}
             },
             {
             display: '结算方式', name: 'sellte_type',  newline: false, type: 'select', options: {
             url: '/tms/bas/dict/getData?query=settle_type',
             cancelable: true,
             autocomplete: true,
             keySupport: true,
             isTextBoxMode: true,
             onSuccess:function (data) {
             var g = this;
             data.forEach(function(item,index){
             if(item.id == g.selectedValue){
             g._changeValue(item.id,item.text);
             }
             });
             }
             }
             },
             {
             display: '付款方式', name: 'settle_pay_type',  newline: false, type: 'select', options: {
             url: '/tms/bas/dict/getData?query=pay_type',
             cancelable: true,
             autocomplete: true,
             keySupport: true,
             isTextBoxMode: true,
             onSuccess:function (data) {
             var g = this;
             data.forEach(function(item,index){
             if(item.id == g.selectedValue){
             g._changeValue(item.id,item.text);
             }
             });
             }
             }
             },
             {
             display: '银行', name: 'settle_bank',  newline: false, type: 'select', options: {
             url: '/tms/bas/dict/getData?query=bank',
             cancelable: true,
             autocomplete: true,
             keySupport: true,
             isTextBoxMode: true,
             onSuccess:function (data) {
             var g = this;
             data.forEach(function(item,index){
             if(item.id == g.selectedValue){
             g._changeValue(item.id,item.text);
             }
             });
             }
             }
             },
             {
             display: '银行账号', name: 'settle_bank_account',  newline: false, type: 'text', attr: {
             maxlength: 25
             },
             },
             {
             display: '银行户名', name: 'settle_bank_name',  newline: false, type: 'text', attr: {
             maxlength: 25
             },
             },
             {display: '生效日期', name: 'settle_begin_date',  newline: false, type: 'date'},
             {display: '失效日期', name: 'settle_end_date',  newline: false, type: 'date'},
             {
             display: '姓名', name: 'sellte_name',  newline: false, type: 'text', attr: {
             maxlength: 10
             },
             },
             {
             display: '电话',
             name: 'sellte_mobile',
             newline: false,
             type: 'text',
             validate: {isMobile: true}
             },
             {
             display: '邮箱', name: 'sellte_email',  newline: false, type: 'text', attr: {
             maxlength: 50
             },
             },
             {
             display: '结算日期', name: 'sellte_date_field', newline: false, type: 'select', options: {
             url: '/tms/bas/dict/getData?query=settle_date_field'
             }, validate: {required: true, messages: {required: '结算日期不能为空。'}}
             },
             {
             display: '银行详细', name: 'sellte_bank_detail', width: defaultFieldWidth.w2, newline: true, rows: 4, type: 'text', attr: {
             maxlength: 200
             },
             },
             {
             display: '开票信息', name: 'sellte_bill_info', width: defaultFieldWidth.w2, newline: true, rows: 4, type: 'text', attr: {
             maxlength: 200
             },
             },
             //法人信息
             {
             group: "法人信息", display: '姓名', name: 'legal_name',  newline: false, type: 'text', attr: {
             maxlength: 10
             },
             },

             {
             display: '身份证号', name: 'legal_id_no',  newline: false, type: 'text', attr: {
             maxlength: 20
             },
             },
             {display: '电话', name: 'legal_mobile',  newline: false, type: 'text', validate: {isMobile: true}},
             {
             display: '邮箱', name: 'legal_email',  newline: false, type: 'text', attr: {
             maxlength: 50
             },
             },
             {
             display: '性别', name: 'legal_sex',  newline: false, type: "radiolist", options: {
             data: [{id: 1, text: '男'}, {id: 2, text: '女'}]
             }
             },
             //备案信息
             {
             group: "备案信息", display: '备案人', name: 'record_name',  newline: true, type: 'text', attr: {
             maxlength: 10
             },
             },
             {
             display: '备案时间',
             name: 'record_time',
             newline: false,
             type: 'date'
             },*/
            {name: "pk_id", type: "hidden"},
            {name: "state", type: "hidden"},
            {name: "supplier_id", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify
    });


    //加载数据
    mainForm.setData(driver);

    var topToolBar = LG.powerToolBar($('#topToolBar'), {
        items: [
            {id: 'save', text: '保存', click: saveClient, icon: 'save', status: ['OP_INIT']},
            // {id: 'use', text: client.state === 'STATE_11_USE'? '失效' : '使用', click: setState, icon: client.state === 'STATE_11_USE'? 'stop' : 'use', status: ['OP_INIT']},
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    });


    function saveClient() {
        //提交数据
        if (mainForm.valid()) {
            var formData = $.extend({}, mainForm.getData());

            LG.ajax({
                url: basePath + "update",
                data: JSON2.stringify(formData, DateUtil.datetimeReplacer),
                contentType: 'application/json',
                dataType: "json",
                success: function () {
                    LG.tip('保存成功!');
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        }
    }


</script>
</html>
