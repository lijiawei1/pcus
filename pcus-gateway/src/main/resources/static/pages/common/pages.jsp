<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page import="java.util.Date" %>
<%
    Long time = new Date().getTime();
%>

<%--<link href="<c:url value='/js/lib/ligerUI/skins/Aqua/css/ligerui-all.css' />" rel="stylesheet" type="text/css" />--%>
<%--<link href="<c:url value='/js/lib/ligerUI/skins/Zap2016/css/all.css' />" rel="stylesheet" type="text/css" />--%>
<%--<link href="<c:url value='/js/lib/ligerUI/skins/ligerui-icons.css' />" rel="stylesheet" type="text/css" />--%>
<%--<link href="<c:url value='/css/common/header.css' />" rel="stylesheet" type="text/css" />  --%>

<link href="<c:url value='/js/lib/ligerUI/skins/Aqua/css/ligerui-all.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/js/lib/ligerUI/skins/CadetBlue/css/all.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/js/lib/ligerUI/skins/ligerui-icons.css' />" rel="stylesheet" type="text/css"/>
<%--<link href="<c:url value='/css/common/header.css' />" rel="stylesheet" type="text/css" />--%>
<%-- <link href="<c:url value='/css/common/common.css' />" rel="stylesheet" type="text/css"/>--%>
<link href="<c:url value='/css/tms/ligerui-style.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/css/tms/common-style.css' />" rel="stylesheet" type="text/css"/>

<link rel="stylesheet" type="text/css" id="mylink"/>
<script src="<c:url value='/js/lib/jquery/jquery-1.11.1.min.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/ligerUI/V133/js/ligerui.all.js'/>" type="text/javascript"></script>
<%-- <script src="<c:url value='/js/lib/ligerUI/js/core/base.js" type="text/javascript'/>"></script> --%>
<script src="<c:url value='/js/lib/jquery.cookie.js'/>"></script>
<script src="<c:url value='/js/lib/jquery.form.js'/>"></script>

<script src="<c:url value='/js/lib/jquery-validation/jquery.validate.min.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/jquery-validation/jquery.metadata.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/jquery-validation/messages_cn.js'/>" type="text/javascript"></script>

<!-- 扩展 -->
<script src="<c:url value='/js/lib/utils/json2.js'/>"></script>
<script src="<c:url value='/js/lib/LG.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/ligerui.expand.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/iconselector.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/common.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/utils/ajaxfileupload.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/utils/DateUtil.js'/>" type="text/javascript"></script>
<script src="<c:url value='/js/lib/utils/throttle.js'/>" type="text/javascript"></script>
<!-- 仿写 -->

<script>
    var rootPath = '${pageContext.request.contextPath}';
    //用户基本信息
    var user = {
        id: '${user.id}',
        name: '${user.name}',
        account: '${user.account}',
        email: '${user.email}',
        mobile: '${user.mobile}'
    };
    //页面参数
    var param = {
        //父页面菜单信息
        parentPageNo: '${pp.parentPageNo}',
        parentPageId: '${pp.parentPageId}',
        no: '${pp.no}',
        module: '${pp.module}',
        fun: '${pp.function}'
    };
    //动画效果
    (function addAnimate() {
        var fun = window.onload;
        window.onload = function () {
            if (typeof fun === "function") {
                fun();
            }
            if (Math.round(Math.random()) & 1) {
                if ($(".l-container").addClass("animation appearRTL").length <= 0) {
                    $("body").addClass("animation appearRTL");
                }
            }
            else {
                if ($(".l-container").addClass("animation appearBTT").length <= 0) {
                    $("body").addClass("animation appearBTT");
                }
            }
        }
    })();
</script>
<script src="<c:url value='/js/common/card.js'/>" type="text/javascript"></script>

<!-- 页面请求参数 -->
<%--<input id="param_no" value="${param.no}" hidden="hidden"/>--%>
<%-- <input id="param_page" value="${param.page}" hidden="hidden"/>
<input id="param_function" value="${param.function}" hidden="hidden"/>
<input id="param_module" value="${param.module}" hidden="hidden"/> --%>

