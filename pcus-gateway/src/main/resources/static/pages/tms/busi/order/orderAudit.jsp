<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/12/9
  Time: 10:14
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>核单</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <script src="${path}/js/lib/utils/ajaxfileupload.js?t=${applicationScope.sys_version}"></script>
    <link href="${path}/css/city-picker/city-picker.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="${path}/css/jquery-ui-css/Gray/jquery-ui-1.8.21.custom.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <link href="${path}/css/tms/listicon.css?t=${applicationScope.sys_version}" rel="stylesheet">
    <style>
        [data-rotate=rotate0] {
            -ms-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        [data-rotate=rotate90] {
            -ms-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            transform: rotate(90deg);
        }

        [data-rotate=rotate180] {
            -ms-transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
            -o-transform: rotate(180deg);
            -moz-transform: rotate(180deg);
            transform: rotate(180deg);
        }

        [data-rotate=rotate270] {
            -ms-transform: rotate(270deg);
            -webkit-transform: rotate(270deg);
            -o-transform: rotate(270deg);
            -moz-transform: rotate(270deg);
            transform: rotate(270deg);
        }

        .grid-wrapper {
            height: 98%;
            overflow: hidden;
        }

        .img-wrapper {
            height: 70%;
            overflow: hidden;
            margin-top: -40px;
            padding: 70px 10px 5px;
            box-sizing: border-box;
            position: relative;
        }

        .tabWrapper {
            width: auto;
            height: calc(100% - 20px);
            padding-top: 0;
            margin: 10px 10px;
            position: relative;
        }

        .form-wrapper {
            padding-top: 0;
            padding-bottom: 0;
        }

        .form-wrapper-inner {
            margin: 0;
            border-radius: 0;
        }

        .tabWrapper .l-tab-content {
            border: 1px solid #d6d6d6;
            border-radius: 0;
        }

        .tabWrapper .l-tab-links ul {
            background-color: transparent;
        }

        .tabWrapper .l-tab-links li {
            float: left;
            width: 50%;
            background-color: transparent;
            box-sizing: border-box;
        }

        .tabWrapper .l-tab-links li:first-child {
            padding-right: 3px;
        }

        .tabWrapper .l-tab-links li:last-child {
            padding-left: 3px;
        }

        .tabWrapper .l-tab-links li:hover {
            background-color: transparent;
        }

        .tabWrapper .l-tab-links li a {
            width: 100%;
            margin: 0;
            color: #9a9a9c;
            border-radius: 10px;
            background-color: #d6dae6;
        }

        .tabWrapper .l-tab-links li.l-selected,
        .tabWrapper .l-tab-links li.l-selected:hover {
            background-color: transparent;
        }

        .tabWrapper .l-tab-links li:hover {

        }

        .tabWrapper .l-tab-links li.l-selected a {
            color: #17a0f5;
            background-color: #fff;
        }

        .mainForm-wrapper {
            height: 50%;
            overflow: auto;
        }

        .left-right-select {
            padding-bottom: 45px;
        }

        .drag-con {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            border: 1px solid #d6d6d6;
        }

        .drag-inner {
            position: absolute;
        }

        .zoom-btn-wrapper {
            position: absolute;
            top: 45px;
            left: 10px;
            z-index: 10;
        }

        .zoom-btn {
            float: left;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
        }

        .zoom-btn:hover {
            color: #17a0f5;
        }

        .zoom-btn + .zoom-btn {
            margin-left: 20px;
        }

        .vertical-list-wrap{
            height: 30%;
            padding: 26px 10px 0;
            margin: 16px auto 0;
        }
        .vertical-list-wrap .vertical-list-add{
            left: 10px;
            top: 0;
        }
        .vertical-list-inner>.item:first-child{
            padding: 0;
        }
        .vertical-list{
            width:100%;
            border: 1px solid #dedede;
            overflow: auto;
        }
        .vertical-table{
            display: table;
            height: 100%;
        }
        .vertical-list-inner{
            display: table-row;
            position: relative;
            height: 100%;
        }
        .vertical-list .item{
            display: table-cell;
            min-width: 120px;
            height: 100%;
            overflow: hidden;
            margin: 0 8px;
        }
        .vertical-list-inner>.item+.item{
            padding: 0;
            border: none;
        }
        .vertical-list .item .item-img{
            height: 100%;
        }
        .vertical-list .item .img-wrap{
             height: calc(100% - 28px);
            overflow: hidden;
         }
        .vertical-list .item img{
            width: 100px;
            padding: 10px;
        }
        .vertical-list .item span{
            line-height: 28px;
        }

        /*更改普通输入框样式*/
        .l-form .l-text,
        .l-form .l-textarea,
        .l-form .l-textarea:hover,
        .l-form .l-textarea:focus {
            border-color: #cecece;
            background-image: none;
        }

        /*更改只读样式*/
        .l-form .l-text-readonly .l-text-field,
        .l-form .l-text-disabled .l-text-field {
            color: #000;
        }

        .l-form .l-text-readonly, .l-form .l-text-disabled {
            background-color: transparent;
            border-color: transparent;
        }
        .quick-search{
            margin-left: 10px;
        }
        .right-box .inner{
            background-color: #eff2f9;
        }
        .l-text .list-icon, .l-text-combobox .icon-type{
            position: absolute;
            right: -32px;
            z-index: 10;
            top: 2px;
        }
    </style>
</head>
<body>
<div>
    <div id="uploadDiv">
        <input id="uploadFileInput" type="file" name="uploadFileInput" style="display: none;"/>
    </div>
    <div class="toolbar-wrapper">
        <div class="l-toolbar" id="toptoolbar"> </div>
    </div>
    <div id="layout">
        <div position="left" class="content-wrapper grid-wrapper inner">
            <!-- 图片界面 -->
            <div class="img-wrapper">
                <div class="drag-con" id="drag-con">
                    <div class="drag-inner" id="drag">
                        <img id="drag-img" src="">
                    </div>
                </div>
                <div class="zoom-btn-wrapper clearfix">
                    <div class="zoom-btn limit-select" data-action="zoom-o">原始</div>
                    <div class="zoom-btn limit-select" data-action="zoom-in">放大</div>
                    <div class="zoom-btn limit-select" data-action="zoom-out">缩小</div>
                    <div class="zoom-btn limit-select" data-action="rotate-left">向左旋转</div>
                    <div class="zoom-btn limit-select" data-action="rotate-right">向右旋转</div>
                </div>
            </div>
            <div class="vertical-list-wrap">
                <div class="vertical-list-add" onclick="myLoadAdd();">
                    <i class="l-icon l-icon-add  limit-select"></i> 上传图片${data_order.bs_catalog}
                </div>
                <div class="vertical-list">
                    <div  class="vertical-table">
                        <ul id="loadList" class="vertical-list-inner real">
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 表单界面 -->
            <%--<div class="mainForm-wrapper">--%>

            <%--<form id="mainForm"></form>--%>

            <%--</div>--%>
            <!-- 快速搜索 -->
            <div class="quick-search">A
            </div>
        </div>
        <!-- 页签 -->
        <div position="center" class="inner">
            <div class="tabWrapper ">
                <div class="tabWrapper-inner">
                    <div id="mainTab">
                        <div tabid="editTab" title="单据编辑" lselected="true">
                            <div class="form-wrapper">
                                <div class="form-wrapper-inner">
                                    <form id="mainForm"></form>
                                </div>
                            </div>
                        </div>
                        <div id="detailGridTab" tabid="detailGridTab" title="货物信息" data-url="${path}/tms/busi/orderDetail/loadPage/${order_id}">
                            <iframe frameborder="0" name="detailGrid"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
<script src="${path}/js/lib/jquery.mousewheel.min.js?t=${applicationScope.sys_version}"></script>
<script>
    $(function () {
        var LayoutWidthName = 'orderAuditLayoutWidth' + user.id;
        var leftWidth = localStorage[LayoutWidthName] ? localStorage[LayoutWidthName] : ($(window).width() * 0.65);
        var headerLayout = $("#layout").ligerLayout({
            height: '100%',
            width: '100%',
            leftWidth : leftWidth,
            allowLeftCollapse: false,
            onEndResize: function () {
                localStorage.setItem(LayoutWidthName, this.left.width());
            }
        });
        headerLayout.layout.find('.l-layout-header').hide();

        //创建页签
        var mainTab = $("#mainTab").ligerTab({
            height: '100%',
            width: '100%',
            changeHeightOnResize: true,
            onAfterSelectTabItem: afterSelectTabItem
        });
        //初始化激活的标签项
        afterSelectTabItem(mainTab.getSelectedTabItemID());
        //标签切换事件
        function afterSelectTabItem(tabid) {
            //初始化页签
            var $tg = $(".l-tab-content [tabid='" + tabid + "']");
            if ($tg.attr("data-init") !== "init") {
                $tg.children(".l-tab-loading").show();
                $tg.children("iframe").attr("src", $tg.attr("data-url")).end().attr("data-init", "init");
            }
        }
    });

    function myback() {
        //确认数据
//        console.log(manager);
        if (manager.confirmChanged && !manager.confirmChanged()) {
            e.stopPropagation();
            return false
        }
        else {
            manager.backConfirm = true;
        }

        var p$ = parent.$;
        p$("#transGridTabSub").remove();
        p$("#transGridTab").show()[0].contentWindow.$("body").trigger("backFromSubPage");
    }
</script>
<script>
    $(function () {
        //更改图片，调用imgCheck.reset(src);
        window.imgCheck = (function imgCtrl() {
            var $dragCon = $("#drag-con"),
                    $drag = $("#drag"),
                    $dragImg = $("#drag-img"),
                    imgWidth = $dragImg.width(),//原始宽度
                    imgHeight = $dragImg.height(), //原始高度
                    maxWidth = imgWidth * 3,
                    maxHeight = imgHeight * 3,
                    widthStep = imgWidth * 0.05,
                    heightStep = imgHeight * 0.05,
                    lastWidth = imgWidth,
                    lastHeight = imgHeight;

            $drag.attr("data-rotate", "rotate0");

            $drag.ligerDrag({proxy: false, posFromCss: true});
            $dragCon.mousewheel(function (event, delta) {
                if (delta > 0) {
                    zoom(widthStep, heightStep);
                }
                else if (delta < 0) {
                    zoom(-widthStep, -heightStep);
                }
            });
            $(".img-wrapper").on("click", "[data-action]", function () {
                var $this = $(this),
                        action = $this.attr("data-action");
                switch (action) {
                    case "zoom-in":
                        zoom(widthStep, heightStep);
                        break;
                    case "zoom-out":
                        zoom(-widthStep, -heightStep);
                        break;
                    case "zoom-o":
                        lastWidth = imgWidth;
                        lastHeight = imgHeight;
                        $dragImg.width(imgWidth);
                        $dragImg.height(imgHeight);
                        break;
                    case "rotate-left":
                        rotate("l");
                        break;
                    case "rotate-right":
                        rotate("r");
                        break;
                }
            });

            return {
                reset: reset
            }

            function zoom(ws, hs) {
                var targetW = lastWidth + ws,
                        targetH = lastHeight + hs;
                if (targetW > 20 && targetH > 20 && targetW < maxWidth && targetH < maxHeight) {
                    lastWidth = targetW;
                    lastHeight = targetH;
                    $dragImg.width(targetW);
                    $dragImg.height(targetH);
                }
            }

            function rotate(dir) {
                var currentStatus = Number($drag.attr("data-rotate").slice(6));
                if (dir === "l") {
                    currentStatus += 90;
                }
                else {
                    currentStatus -= 90;
                }
                if (currentStatus > 270) {
                    currentStatus = 0;
                }
                else if (currentStatus < 0) {
                    currentStatus = 270;
                }
                $drag.attr("data-rotate", "rotate" + currentStatus);
            }

            function reset(imgSrc) {
                if (imgSrc) {
                    var image = new Image(),
                            $image = $(image);
                    image.onload = function () {
                        imgWidth = image.width,//原始宽度
                                imgHeight = image.height, //原始高度
                                maxWidth = imgWidth * 3,
                                maxHeight = imgHeight * 3,
                                widthStep = imgWidth * 0.05,
                                heightStep = imgHeight * 0.05,
                                lastWidth = imgWidth,
                                lastHeight = imgHeight;

                        $drag.css({left: 0, top: 0}).html($image).attr("data-rotate", "rotate0");
                    }
                    image.onerror = function () {
                        $drag.html("");
                    }
                    $dragImg = $image;
                    image.src = imgSrc;
                }
                else {
                    $drag.html("");
                }
            }
        })();
    });
</script>
<script type="text/javascript">
    var trans_id = '${trans_id}';
    var order_id = '${order_id}';
    var trans = ${transNodes};
    //单据主键
    var pk_id = order_id,                       //运单主键
        bs_catalog = '${bs_catalog}',
        data_bill = ${bill},
        data_order = ${order},              //运单
        data_trans = ${trans},              //任务
        data_clients = ${clients},          //客户
        data_clientLinkmans = ${clientLinkmans},
        data_suppliers = ${suppliers},      //供应商
        data_dict = ${dict},                //数据字典
        data_loadOrg = ${loadOrg};          //供应商
    var data_region = ${region};

    //计价基准
    var price_base = priceBaseUtil.processPriceBase(data_dict);
    var remap_price_base = price_base.remap; //映射
    var data_price_base = price_base.base;

    //散货整车业务
    if (bs_catalog == 'CARGO') {
        $("#detailGridTab").attr("data-url", rootPath + "/tms/busi/transDetail/loadPage/" + trans_id);
        $('li[tabid="detailGridTab"]').click();
    }
</script>

<script src="${path}/js/lib/city-picker/city-picker.data.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/city-picker/city-picker.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms/jquery-ui.min.js?t=${applicationScope.sys_version}"></script>

<script src="${path}/js/tms/busi/order/orderAudit.js?t=${applicationScope.sys_version}"></script>
<%--通过业务分类加载不同的模板,散货整车业务加载任务模板--%>
<c:if test="${bs_catalog == 'DISTR'}">
    <script src="${path}/js/tms/busi/order/orderAuditCard.js?t=${applicationScope.sys_version}"></script>
</c:if>
<c:if test="${bs_catalog == 'CNTR'}">
    <script src="${path}/js/tms/busi/order/orderCardConfig/${clientTemplate}.js?t=${applicationScope.sys_version}"></script>
    <script src="${path}/js/tms/busi/order/orderAuditTransCntr.js?t=${applicationScope.sys_version}"></script>
</c:if>
<c:if test="${bs_catalog=='CARGO'}">
    <script src="${path}/js/tms/busi/order/orderAuditCargo.js?t=${applicationScope.sys_version}"></script>
</c:if>
<script>
    LG.powerToolBar($('#toptoolbar'), {
        items: [
            { id: 'refresh', text: '刷新', icon: 'refresh', click: refresh },
            { id: 'updateAudit', text: '回单', icon: 'submit', click: save },
            { id: 'backtrack', text: '返回', icon: 'backtrack', click: myback }
        ]
    });
</script>

<script id="msgInfo" type="text/html">
    {{each msgList}}

    <li class="item" data-id="{{$value.pk_id}}">
        <div class="item-img">
            <div class="img-wrap">
                <img src="{{$value.file_url}}">
            </div>
            <span class="title">{{$value.file_name}}</span>
            <span class="close" onclick="deleteImg('{{$value.pk_id}}')">&times;</span>
        </div>
    </li>

    {{/each}}
</script>

<script id="searchInfo" type="text/html">
    {{each msgList}}
    <a class="qs-item" data-action="{{$value.id}}" href="javascript:;" onclick="quickQuery(this)">{{$value.text.replace("已","")}}</a>
    {{/each}}
</script>
</body>
</html>
