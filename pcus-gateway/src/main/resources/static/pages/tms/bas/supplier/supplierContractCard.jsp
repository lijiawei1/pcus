<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/2
  Time: 18:45
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>合同信息</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <script src="${path}/js/lib/utils/ajaxfileupload.js?t=${applicationScope.sys_version}"></script>
</head>
<body>
<ol class="breadcrumb container" id="breadcrumb">
    <span>当前位置：</span>
    <li>${pp.module}</li>
    <li>${pp.function}</li>
    <li class="active"><a href="javascript:void(0);">${pp.detailFunction}</a></li>
</ol>
<div class="tabWrapper">
    <div class="tabWrapper-inner">
        <div id="mainTab">
            <div tabid="editTab" title="单据编辑" lselected="true" data-url="${path}/tms/bas/clientlinkman/loadPage">
                <div class="toolbar-wrapper form-toolbar">
                    <div class="l-toolbar" id="toptoolbar"> </div>
                </div>
                <div class="form-wrapper">
                    <div class="form-wrapper-inner">
                        <form id="mainForm"></form>
                        <div class="card-wrap">
                            <ul class="card-list horizontal-list clearfix" id="card-list">

                            </ul>
                            <div id="uploadDiv">
                                <input id="uploadFileInput" type="file" name="uploadFileInput" style="display: none;"/>
                            </div>

                            <div class="card-add" id="addCard">
                                <div class="business-card add contract-card">
                                    <div class="top">
                                        <i class="iconfont l-icon-plus plus"></i>
                                    </div>
                                    <div class="bottom">
                                        添加附件
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div tabid="linkmanGridTab" title="价格合约" data-url="${path}/tms/bas/contractitem_s/loadPage?pk_id=${pk_id}">
                <iframe frameborder="0" name="linkmanGrid" id="linkmanGrid"></iframe>
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
        if ($tg.attr("data-init") !== "init" || $tg.attr("data-url").indexOf("contractitem") > 0) {
            $tg.children(".l-tab-loading").show();
            var url = $tg.attr("data-url");
            $tg.children("iframe").attr("src", url).end().attr("data-init", "init");
        }
    }

</script>

<script type="text/javascript">
    var basePath = rootPath + '/tms/bas/contract_s/';
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
    })(89,120,30);
    var mainForm = formPanel.ligerForm({
        inputWidth: defaultFieldWidth.w1,
        labelWidth: defaultFieldWidth.lw,
        space: defaultFieldWidth.sw,
        fields: [
            //客户基本资料
            {
                group: "合同基本信息",
                display: '合同编号',
                name: 'contract_no',

                newline: false,
                type: 'text',
                options: {
                    readonly: true,
                    disabled: true
                }
            },
            {
                display: '合同名称',
                name: 'contract_name',

                newline: false,
                type: 'text',
                validate: {
                    required: true, messages: {required: '合同名称不能为空。'}
                }, attr: {
                maxlength: 50
            },
            },
            {
                display: '自定义编号', name: 'contract_own',  newline: false, type: 'text', attr: {
                maxlength: 50
            },
            },
            {
                display: '甲方', name: 'first_id',  newline: false, type: 'select',
                options: {
                    url: basePath + "getSupplier"
                },
                validate: {required: true, messages: {required: '乙方不能为空。'}}
            },
            {
                display: '甲方公司应用范围', name: 'service_range',  newline: false, type: 'text', attr: {
                maxlength: 50
            },
            },
            {
                display: '业务范畴', name: 'service_type',  newline: false, type: 'select',
                options: {
                    url: basePath + "getServiceType",
                    split: ',',
                    isMultiSelect: true
                },
            },
            {
                display: '甲方签订人', name: 'sign_psn',  newline: false, type: 'text', attr: {
                maxlength: 20
            },
            },
            {
                display: '乙方', name: 'second_id',  newline: false, type: 'select',
                options: {
                    url: basePath + "getClient",
                    disabled: true
                },
            },
            {
                display: '合同币种', name: 'currency',  newline: false, type: 'select',
                options: {
                    url: rootPath + '/tms/bas/dict/getData?query=currency'
                },
                validate: {required: true, messages: {required: '合同币种不能为空。'}}
            },
            {
                display: '生效日期',
                name: 'begin_date',

                newline: false,
                type: 'date',
                validate: {required: true, messages: {required: '生效日期不能为空。'}}
            },
            {
                display: '失效日期',
                name: 'end_date',

                newline: false,
                type: 'date',
                validate: {required: true, messages: {required: '失效日期不能为空。'}}
            },
            {
                display: '签订地点', name: 'contract_place',  newline: false, type: 'text', attr: {
                maxlength: 50
            },
            },
            {
                display: "备注",
                name: "remark",
                newline: true,
                width: defaultFieldWidth.w2,
                space: 10,
                type: "text",
                attr: {
                    maxlength: 200
                },
            },
            {name: "pk_id", type: "hidden"},
            {name: "state", type: "hidden"}
        ],
        validate: true,
        toJSON: JSON2.stringify
    });


    //加载数据

    var client = ${client};
    mainForm.setData(client);

    var toptoolbar = LG.powerToolBar($('#toptoolbar'), {
        items: [
            {
                id: 'unUse', text: client.state == "STATE_11_USE" ? '失效' : '使用', icon: client.state == "STATE_11_USE" ? 'stop' : 'use', click: setState
            },
            {
                id: 'update', text: '保存', icon: 'save', click: saveClient
            },
            {
                id: 'backtrack', text: '返回', icon: 'backtrack', click: backtrackFun
            }
        ]
    });
    (disabledButtons.indexOf('addAttach') >= 0) && $('#addCard').hide();

    function setState() {
        var nowState = client.state;
        var type = "1";
        if (nowState == "STATE_11_USE") {
            type = "0";
        }
        LG.ajax({
            url: basePath + "unUse?id=" + client.pk_id + "&type=" + type,
            contentType: 'application/json',
            dataType: "json",
            success: function () {
                LG.showSuccess('操作成功!', function () {
                    location.reload();
                });

            //    if (type == "1") {
            //        $("#stateName").text("失效");
            //        $("#stateIcon").removeClass("l-icon-use").addClass("l-icon-stop");
            //    }
            //    else {
            //        $("#stateName").text("使用");
            //        $("#stateIcon").removeClass("l-icon-stop").addClass("l-icon-use");
            //    }

            },
            error: function (message) {
                LG.showError(message);
            }
        });

    }


    function saveClient() {
        //提交数据
        if (mainForm.valid()) {
            var formData = $.extend({}, mainForm.getData());

            LG.ajax({
                url: basePath + "update.do",
                data: JSON2.stringify(formData, DateUtil.datetimeReplacer),
                contentType: 'application/json',
                dataType: "json",
                success: function () {
                    LG.tip('保存成功!');
                    //刷新列表页面grid
                    // var iframe = parent.window.frames['005001'];
                    // iframe.mainGrid.reload();
                },
                error: function (message) {
                    LG.showError(message);
                }
            });
        }
    }

    // 手机号码验证
    jQuery.validator.addMethod("isMobile", function (value, element) {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        var length = value.length;
        if (length == 0) {
            return true
        }
        ;
        return this.optional(element) || ( /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|170)+\d{8})$/.test(value) || tel.test(value));
    }, "请正确填写联系方式。");

</script>
<script type="text/javascript">

    var isdelete = !(disabledButtons.indexOf('delAttach') >= 0);
    //加载附件列表
    $(function () {
        $.ajax({
            url: basePath + 'getAttach?id=' + '${pk_id}',
            dataType: 'json',
            success: function (data) {
                var html = template('msgInfo', {msgList: data});
                $("#card-list").html(html);
                isdelete && $("#card-list").find('.delete').hide();
            }
        })
    });

    function delFile(id) {
        $.ligerDialog.confirm("是否确认删除合同附件？", function (yes) {
            if (yes) {
                LG.ajax({
                    url: basePath + "delAttach.do?id=" + id,
                    dataType: "json",
                    success: function () {
                        $("#card-list").find("li[data-id=" + id + "]").remove();
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            }
        })

    }

    function download(obj) {
        window.open($(obj).attr("data-url"));
    }

    $("div.business-card.add").on("click", function () {
        $("#uploadFileInput").click();
    });

    $("#uploadDiv").on("change", function () {
        $.ajaxFileUpload({
                    url: basePath + "uploadFile?id=" + '${pk_id}',             //需要链接到服务器地址
                    secureuri: false,
                    fileElementId: 'uploadFileInput',                         //文件选择框的id属性
                    dataType: 'json', //服务器返回的格式，可以是json
                    success: function (data, status)             //相当于java中try语句块的用法
                    {
                        var list = [];
                        list.push(data);
                        var html = template('msgInfo', {msgList: list});
                        $("#card-list").append(html);
                    },
                    error: function (data, status, e)             //相当于java中catch语句块的用法
                    {
                        alert("服务器异常");
                    }
                }
        );
    });
</script>

<script id="msgInfo" type="text/html">
    {{each msgList}}
    <li class="item" data-id="{{$value.pk_id}}">
        <div class="contract-card-wrap">
            <div class="business-card content contract-card">
                <div class="top">
                    <div class="card">
                        <div class="card-icon">
                            <i class="iconfont l-icon-word"></i>
                        </div>
                        <div class="card-info">
                            <div class="info-item">{{$value.file_name}}</div>
                            <div class="info-item">{{$value.upload_time.substring(0,10)}}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <i class="iconfont l-icon-download download" onclick="download(this)"
                       data-url="{{$value.file_url}}"></i>
                    <i class="iconfont l-icon-delete delete" onclick="delFile('{{$value.pk_id}}')"></i>
                </div>
            </div>
        </div>
    </li>
    {{/each}}
</script>
</html>
