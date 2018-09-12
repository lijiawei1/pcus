<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/1
  Time: 18:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>常用运输线路</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="${path}/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="${path}/css/jquery-ui-css/Gray/jquery-ui-1.8.21.custom.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <style type="text/css">
        ul.ui-autocomplete {
            z-index: 9999;
        }

        .l-dialog-btn {
            width: 100px;
        }
        .c000{
            color:#000;
        }
        .c000:hover{
            color:#000
        }
        .mores-form{
            position: absolute;
            left:110%;
            top:0;
            animation: 1s left;
        }
        .mores-box{
            position: absolute;
            right: 0;
            top:0;
        }
        .falafel:after {
            content: "";
            background: #444;
            height: 60%;
            width: 10%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(0, -50%);
        }
        .falafel:before {
            content: "";
            background: #444;
            height: 10%;
            width: 60%;
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-40%, -50%);
        }
        .falafel {
            border: 1px solid #2C2C2C;
            font-size: 10px;
            height: 20px;
            position: relative;
            width: 20px;
            background: #ececec;
            border-radius: 0.2em;
        }
        .load-form{
            position: absolute;
            left: 0;
            top:0;
            animation: 1s left;
        }
        .load-dialog{
            position: relative;
        }
        .mores-form.action{
            left: 0;
        }
        .load-form.action{
            left: -110%;
        }
        .city-select-tab > a{
            padding: 8px 22px;
        }
        .city-select-tab > a{
            padding: 8px 22px;
        }
        .l-text-combobox{
            width: 98%;
        }
        .l-dialog-btn{
            width:85px;
        }

        .vertical-list-add{
            padding-left: 0;
            top: -33px;
            left: 0;
        }
        #moresForm{
            overflow: auto;
            height:302px;
        }
    </style>
</head>
<body>
<div id="layout">
    <div class="toolbar-wrapper search-toolbar-wrapper">
        <div class="hidden-search">
            <i class="l-icon l-icon-search" data-action="single-search"></i>
            <input class="hs-input" placeholder="在此输入关键字" data-action="single-search-input">
            <span class="status2 hs-btn limit-select" data-action="single-search">&gt;</span>
            <span class="status1 text">搜索</span>
            <span class="status2 text cancel">取消</span>
        </div>
        <div id="toptoolbar"></div>
    </div>
    <!-- 卡片界面 -->
    <div class="left-right-content">
        <div class="content-wrapper grid-wrapper inner">
            <!-- 列表界面 -->
            <div id="mainGrid"></div>
        </div>
    </div>
    <!-- 左右布局-选择 -->
    <div class="left-right-select">
        <div class="vertical-list-wrap inner">
            <div class="vertical-list">
                <ul id="loadList" class="vertical-list-inner real">
                </ul>
            </div>
            <div class="vertical-list-add">
                <div id="lToolBar"></div>
            </div>
            <div class="vertical-list-btn up disabled limit-select" data-action="vertical-list-slide"></div>
            <div class="vertical-list-btn down limit-select" data-action="vertical-list-slide"></div>
        </div>
    </div>
</div>
<!-- 增加弹出框 -->
<div id="mainDialog" style="display: none;">
    <form id="mainForm"></form>
</div>


<!-- 增加弹出框 -->
<div id="loadDialog" class="load-dialog" style="display: none;">
    <form id="loadForm" class="load-form"></form>
    <div class="mores-box">
        <div class="falafel"></div>
    </div>
    <form id="moresForm" class="mores-form"></form>
</div>
<div id="importFailDialog" style="display: none;">
    <form id="failForm" method="POST" target="_blank" action="">
    </form>
</div>

<!-- excel导出 -->
<div style="display: none">
    <form id="download" method="POST" target="_blank" action="${path}/tms/bas/transport/excelTmpl">
        <input type="text" name="pk_id"/>
        <input type="text" name="names"/>
        <input type="text" name="headers"/>
        <input type="text" name="file_name"/>
        <input type="text" name="sortname"/>
        <input type="text" name="sortorder"/>
    </form>
</div>

<!--Excel导入-->
<div id="uploadDlg" style="display: none;">
    <form id="uploadForm" enctype="multipart/form-data">
        <table style="height: 100%; width: 100%">
            <tr style="height: 40px">
                <td><input type="file" style="width: 200px" id="fileupload" name="fileupload"/></td>
            </tr>
        </table>
    </form>
</div>
</body>
<script>
    var client_id = '${client_id}';
    
    var mainId = client_id;
    var SELECTED = 'selected';

    //上下文路径
    var basePath = rootPath + '/tms/bas/transport/';

    //默认数据
    var emptyData = {
        pk_id: '',
        place_a: '',
        place_b: '',
        e_km: '',
        f_km: '',
        line_name: '',
        modify_time: '',
        modify_psn: '',
        remark: ''
    };

    //页面元素
    var $gridWrapper = $(".grid-wrapper"),
            $filterWrapper = $(".filter-wrapper"),
            $filterForm = $("#filterForm"),
            $uploadDlg = $("#uploadDlg"),
            $mainDlg = $("#mainDlg"), //编辑弹窗
            $mainForm = $("#mainForm"), //编辑表单
            $mainGrid = $("#mainGrid"); //显示表格

    //页面控件
    var toptoolbar, //工具栏
            filterForm, //快速查询
            uploadDlg, //上传对话框
            mainGrid, //列表
            mainForm, //编辑表单
            mainDlg; //弹窗

    var where = JSON2.stringify({
        op: 'and',
        rules: [{field: 'DR', value: '0', op: 'equal'}, {field: 'client_id', value: client_id, op: 'equal'}]
    });

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                //行内按钮
                display: '', align: '', minWidth: 50, width: '5%', sortable: false,
                render: function (item, index) {
                    return '<a class="row-edit-btn" data-index="' + index + '"><i class="iconfont l-icon-edit"></i></a>';
                },
                hide: disabledButtons.indexOf('update') >= 0
            },
            {display: '装卸点A', name: 'place_a_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '装卸点B', name: 'place_b_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '线路名称', name: 'line_name', align: 'left', minWidth: 50, width: '10%'},
            {display: '轻公里数 ', name: 'e_km', align: 'left', minWidth: 50, width: '10%'},
            {display: '重公里数', name: 'f_km', align: 'left', minWidth: 50, width: '10%'},
            {display: '备注', name: 'remark', align: 'left', minWidth: 50, width: '25%'}
        ],
        pageSize: 20,
        url: basePath + 'loadGrid',
        delayLoad: false,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        height: '100%',
        autoStretch: true,
        dataAction: 'server',
        checkbox: true,
        usePager: true,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        heightDiff: -23,
        rowHeight: 30,
        headerRowHeight: 28,
        rowSelectable: true,
        selectable: true,
        // frozen: true,
        rownumbers: true,
        selectRowButtonOnly: true,
        sortName: 'create_time',
        sortOrder: 'desc',
        parms: [{name: 'where', value: where}]
    };

    var filterFormOption = {
        fields: [
            {
                display: "线路名称",
                name: "line_name",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                cssClass: "field"
            },
            {

                name: "client_id",
                type: "hidden",
                cssClass: "field",
                options: {
                    value: client_id
                }
            }
        ]
    };

    var mainFormOption = {
        fields: [
            {display: "装卸点A",
                name: "place_a",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                comboboxName: "place_a_c",
                cssClass: "field",
                validate: {required: true},
                options: {
                     autocomplete: true,
                     highLight: true,
                     onRendered: function () {
                         refreshLua();
                     },
                     onBeforeOpen: function () {
                        refreshLua();
                     }
                }
            },
            {
                display: "装卸点B",
                name: "place_b",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "select",
                comboboxName: "place_b_c",
                cssClass: "field",
                validate: {required: true},
                options: {
                    autocomplete: true,
                    highLight: true,
                    onRendered: function () {
                        refreshLua();
                    },
                     onBeforeOpen: function () {
                        refreshLua();
                     }
                }
            },

            {
                display: "轻公里数",
                name: "e_km",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "number",
                cssClass: "field",
                attr: {
                    maxlength: 10
                },
                validate: {required: true}
            },
            {
                display: "重公里数",
                name: "f_km",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "number",
                cssClass: "field",
                attr: {
                    maxlength: 10
                },
                validate: {required: true},
            },
            {
                display: "线路名称",
                name: "line_name",
                newline: false,
                labelWidth: 80,
                width: 450,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    maxlength: 50
                },
                validate: {required: true},
            },
            {
                display: "备注",
                name: "remark",
                newline: false,
                labelWidth: 80,
                width: 452,
                space: 10,
                rows: 4,
                attr: {
                    maxlength: 200
                },
                type: "textarea"
            },
            {

                name: "pk_id",
                type: "hidden"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    };

    //对话框
    var dialogOption = {
        target: $("#mainDialog"),
        title: '资料编辑',
        width: 650,
        height: 320,
        buttons: [
            {
                text: '确定',
                onclick: function (item, dialog) {
                    //校验数据
                    if (!mainForm.valid()) {
                        mainForm.showInvalid();
                        return;
                    }

                    var selected = $mainForm.data(SELECTED);
                    //地址
                    var url = !!selected ? 'update' : 'add';
                    //数据
                    var data = $.extend({}, selected, mainForm.getData(), {
                        create_time: $mainForm.find("input[name=create_time]").val(),
                        modify_time: $mainForm.find("input[name=modify_time]").val(),
                        client_id: client_id
                    });

                    LG.singleAjax({
                        url: basePath + url,
                        data: JSON.stringify(data),
                        contentType: "application/json",
                        success: function (data, msg) {
                            LG.tip('保存成功!');
                            dialog.hide();
                            //刷新角色列表
                            mainGrid.reload();
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    }, item)

                }
            },
            {
                text: '取消',
                onclick: function (item, dialog) {
                    dialog.hidden();
                }
            }
        ]
    };

    //扩展按钮
    var toolbarOption = {
        items: [
            // {id: 'addRoute', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
            // {id: 'deleteRoute', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
            // {id: 'editRoute', text: '编辑', click: defaultAction, icon: 'edit', status: ['OP_INIT']},
            {
                text: '导入导出',
                icon: 'download',
                menu: {
                    items: [
                        {id: 'excelTmpl', text: '下载模板', click: excelTmpl, status: ['OP_INIT']},
                        {id: 'excelExport', text: '导出线路', click: excelExport, status: ['OP_INIT']},
                        {id: 'excelImport', text: '导入线路', click: excelImport,status: ['OP_INIT']}
                    ]
                }
            },
            {id: 'selectMenu', text: '返回', click: backtrackFun, icon: 'backtrack', status: ['OP_INIT']}
        ]
    };
    var btnClick = function (item) {
    };
    var luaData;
    var isFirst = true;
    //新增弹出窗自定义方法
    function defaultAction_add() {
        initSelect();
        initPara();
        //当右边选择了 装卸单位之后 选死A 暂时不做 和ligerui有点冲突
       // var id=  $("li.active").find("i.edit").attr("data-id");
       // if(id&&id!=""){
       //     var place_a_c = liger.get("place_a_c");
       //     place_a_c.setValue(id);
       // }
    }

    function initPara() {
        from = "";
        to = "";
        placea = "";
        placeb = "";
    }

    function initDrop() {
        var place_a_c = liger.get("place_a_c");
        place_a_c._setData(luaData);
        place_a_c.setValue(place_a_c.getValue());

        var place_b_c = liger.get("place_b_c");
        place_b_c._setData(luaData);
        place_b_c.setValue(place_b_c.getValue());
    }

    function refreshLua(selected) {
        $.ajax({
            url: basePath + "/getloadUnload?client_id=" + client_id,
            dataType: 'json',
            success: function (result) {
                luaData = result;
                initDrop();
                for (var i = luaData.length - 1; i >= 0; i--) {
                    var item = luaData[i];
                    if (selected && item.id == selected.place_a) {
                        placea = item.sname;
                        getPoint(item.address, false, 'a');
                    }
                    if (selected && luaData[i].id == selected.place_b) {
                        placeb = item.sname;
                        getPoint(item.address, false, 'b');
                    }
                };
            }
        })
    }

    var placea = "";
    var placeb = "";
    var from = "";
    var to = "";


    function initSelect() {
        if (isFirst) {
            liger.get("place_a_c").bind('selected', function (value, text) {
                for (var i = 0; i < luaData.length; i++) {
                    if (luaData[i].id == value) {
                        placea = luaData[i].sname;
                        //计算坐标
                        getPoint(luaData[i].address, true, 'a');
                        break;
                    }
                }
                setLineName();
            });


            liger.get("place_b_c").bind('selected', function (value, text) {
                for (var i = 0; i < luaData.length; i++) {
                    if (luaData[i].id == value) {
                        placeb = luaData[i].sname;
                        getPoint(luaData[i].address, true, 'b');
                        break;
                    }
                }
                setLineName();

            });
        }
        isFirst = false;
    }


    function getPoint(address, cal, type) {
        $.ajax({
            url: rootPath + "/tms/bas/location/address?data=" + encodeURIComponent(address),
            type: 'get',
            dataType: 'json',
            success: function (result) {
                if (result.result) {
                    var point = result.result.location.lat + "," + result.result.location.lng;
                    if(type == 'a'){from = point;}
                    if(type == 'b'){to = point;}
                    if (cal) {
                        caculateKm();
                    }
                }
            }
        })
    }


    function setLineName() {
        //mainForm.setData({line_name: placea + "至" + placeb})
        liger.get("line_name").setValue(placea + "-->" + placeb)
        // $("input[name=line_name]").val(placea+"至"+placeb);
    }

    function caculateKm() {
        if (from.length > 0 && to.length > 0) {
            $.ajax({
                url: rootPath + "/tms/bas/location/distance?from=" + from + "&to=" + to,
                type: 'get',
                dataType: 'json',
                success: function (result) {
                    if (result.result) {
                        var km = Math.round(result.result.elements[0].distance / 1000);
                        $("input[name=e_km]").val(km);
                        $("input[name=f_km]").val(km);
                    }
                }
            })
        }
    }

    function excelTmpl() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/transport/excelTmpl")
        xlsUtil.exp($("#download"), mainGrid, '线路导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {pk_id: client_id},
                ['装卸点A', '装卸点B', '线路名称', '轻公里数', '重公里数', '备注'],
                ['place_a_name', 'place_b_name', 'line_name', 'e_km', 'f_km', 'remark']
        );
    }

    function excelExport() {
        //Excel模板下载
        $("#download").attr("action", rootPath + "/tms/bas/transport/excelExport");
        xlsUtil.exp($("#download"), mainGrid, '线路' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {pk_id: client_id},
                ['装卸点A', '装卸点B', '线路名称', '轻公里数', '重公里数', '备注'],
                ['place_a_name','place_b_name', 'line_name', 'e_km','f_km','remark']
        );
    }
    function excelImport() {
        //Excel模板导入
        if (!uploadDlg) {
            uploadDlg = $.ligerDialog.open({
                target: $uploadDlg,
                title: '导入线路',
                width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
                buttons: [
                    {text: '只追加', onclick: function () {
                        upload();
                    }},
                    {text: '追加并覆盖', onclick: function () {
                        upload(true);
                    }},
                    {text: '取消', cls:'c000',onclick: function () {uploadDlg.hide();}}
                ]
            });
        } else {
            uploadDlg.show();
        }

        /**
         *
         * @param cover 是否覆盖旧记录
         * @returns {boolean}
         */
        function upload(cover) {
            // 上传文件
            var filepath = $("#fileupload").val();
            // debugger;
            if (filepath == "") {
                LG.showError("请选择上传文件");
                return false;
            } else {
                var stuff = filepath.match(/^(.*)(\.)(.{1,8})$/)[3];
                var type = "xls,xlsx";
                if (type.indexOf(stuff) < 0) {
                    LG.showError('文件类型不正确,只能上传xls或xlsx');
                    return;
                }
            }
            var url = basePath + 'excelImport';

            uploadDlg.hide();
            LG.showLoading('正在上传中...');

            var formData = new FormData();
            var uform = $("#uploadForm");
            formData.append('excel',
                    JSON2.stringify({
                        pk_id: client_id, //业务主键
                        name: 'fileupload', //上传控件名称
                        cover: cover || false, //是否覆盖
                        meta: {
                            '装卸点A': 'place_a',  //模板元数据
                            '装卸点B': 'place_b',
                            '线路名称': 'line_name',
                            '轻公里数': 'e_km',
                            '重公里数': 'f_km',
                            '备注': 'remark'
                        }
                    })
            );

            //选中的文件
            uform.find('input[type=file]').each(function (i, item) {
                var field_name = $(this).attr('name');
                var files = item.files;
                if (files && files.length > 0) {
                    for (var f = 0; f < files.length; f++) {
                        formData.append(field_name, files[f]);
                    }
                }
            });

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (result) {
                    if (result.error) {
                        var op = $.extend({}, dialogOption_importFail, {content: result.message});
                        LG.hideLoading();
                        //显示查看详细的按钮
                        if (result.data) {
                            $("#failForm").attr("action", result.data);
                            $.ligerDialog.open(op);
                        } else {
                            LG.showError(result.message);
                        }
                    } else {
                        LG.hideLoading();
                        LG.tip(result.message);
                        mainGrid.reload();
                    }
                },
                error: function (message) {}
            });
        }
    }
</script>
<script src="${path}/js/tms/common/single-table.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/bas/client/transport.js?t=${applicationScope.sys_version}"></script>
<script type="text/javascript">
    LG.powerToolBar($('#lToolBar'), {
        items: [{id: 'addRoute', text: '添加关联单位', click: myLoadAdd, icon: 'add', status: ['OP_INIT']}]
    });
</script>
<script id="empInfo" type="text/html">
    {{each msgList}}
    <div class="card">
        <div class="card-icon">
            <div class="text">{{$value.sname.substring(0,1)}}</div>
        </div>
        <div class="card-info">
            <div class="info-item">名称：{{$value.sname}}</div>
            <div class="info-item">地址：{{$value.address}}</div>
        </div>
    </div>
    {{/each}}
</script>


<script id="msgInfo" type="text/html">
    {{each msgList}}
    <li class="item">
        <div class="business-card content">
            <div class="top">
                <div class="card">
                    <div class="card-icon">
                        <div class="text">{{$value.sname.substring(0,1)}}</div>
                    </div>
                    <div class="card-info">
                        <div class="info-item">名称：{{$value.sname.length > 20 ? $value.sname.slice(0,21) + "..." : $value.sname}}</div>
                        <div class="info-item">地址：{{$value.address.length > 20 ? $value.address.slice(0,21) + "..." : $value.address}}</div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                    <i class="iconfont l-icon-delete delete" onclick="myLoadDelete('{{$value.pk_id}}')"></i>
                    <i class="iconfont l-icon-edit edit" data-id="{{$value.pk_id}}" onclick="myLoadEdit('{{$value.pk_id}}')"></i>
            </div>
        </div>
    </li>
    {{/each}}
</script>
</html>