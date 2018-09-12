<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/24
  Time: 14:18
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>应付账单卡片列表</title>
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
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li class="active"><a href="javascript:void(0);">${pp.function}</a></li>
</ol>
<div class="tabWrapper">
    <div class="tabWrapper-inner">
        <div id="mainTab">
            <div tabid="editTab" title="基本信息" lselected="true" data-url="${path}/tms/bas/clientlinkman/loadPage">
                <div class="toolbar-wrapper form-toolbar">
                    <div class="l-toolbar" id="toptoolbar"> </div>
                </div>
                <div class="form-wrapper">
                    <div class="form-wrapper-inner">
                        <form id="mainForm"></form>
                    </div>
                </div>
            </div>
            <div tabid="linkmanGridTab" title="应收明细" data-url="${path}/tms/settle/recievedetail/loadPage?pk_id=${pk_id}">
                <iframe frameborder="0" name="linkmanGrid"></iframe>
            </div>

            <div tabid="logGridTab" title="操作日志" data-url="${path}/tms/bas/log/loadLogCommonPage?bill_id=${pk_id}">
                <iframe frameborder="0" name="logGrid"></iframe>
            </div>
        </div>
    </div>
</div>

</body>

<script>

    //页面元素
    var $mainTab = $("#mainTab"); //页签

    var mainTab;

    //配置
    var detailTabOption = {
        height: '100%',
        width: '100%',
        heightDiff: -6,
        changeHeightOnResize: true,
        onAfterSelectTabItem: afterSelectTabItem
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
        var $tg = $(".l-tab-content [tabid='" + tabid + "']");
        if ($tg.attr("data-init") !== "init") {
            $tg.children(".l-tab-loading").show();
            var url = $tg.attr("data-url");
            $tg.children("iframe").attr("src", url).end().attr("data-init", "init");
        }
    }

</script>

<script type="text/javascript">
    var basePath = rootPath + '/tms/settle/recieve/';
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
            {
                display: '账单号',
                group: '账单基本信息',
                name: 'bill_no',

                newline: false,
                type: 'text',
                options: {readonly: true}
            },
            {
                display: '结算单位', name: 'com_name',  newline: false, type: 'text', options: {readonly: true}
            },
            {
                display: '年', name: 'bill_year',  newline: false, type: 'text', options: {readonly: true}
            },
            {
                display: '月', name: 'bill_month',  newline: false, type: 'text', options: {readonly: true}
            },
            {
                display: '应付账单总额',
                name: 'bill_amount',

                newline: false,
                type: 'text',
                options: {readonly: true}
            },
            {
                display: '账单税金', name: 'tax_amount',  newline: false, type: 'text', options: {readonly: true}
            },
            {
                display: '结算币种',
                name: 'currency',

                newline: false,
                type: 'text',
                options: {readonly: true, value: "人民币"}
            },
            {
                display: '记账公司', name: 'name',  newline: false, type: 'text', options: {readonly: true}
            },
            {name: "pk_id", type: "hidden"},
            {name: "state", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify,
        pageSizeOptions:[30,50,100,500,1000],
        pageSize:50
    });

    
    var toptoolbar = LG.powerToolBar($('#toptoolbar'), {
                        items: [
                            { id: 'audit', text: '审核', icon: 'audit', click: audit },
                            { id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrackFun }
                        ]
                    });

    //加载数据

    var client = ${client};
    mainForm.setData(client);


    function audit() {
        $.ligerDialog.confirm('是否确认审核账单？', function (yes) {
            if (yes) {
                var order_id = [];
                $.ajax({
                    url: basePath + 'audit',
                    data: {ids: client.pk_id},
                    success: function (data, msg) {
                        if (JSON2.parse(data).error) {
                            LG.showError(JSON2.parse(data).message);
                        } else {
                            LG.tip("审核成功。");
                        }
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            }
        });
    }

</script>

</html>
