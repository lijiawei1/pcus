<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:set value="${pageContext.request.contextPath}" var="path" scope="request"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%--<link href="/js/lib/ligerUI/skins/Aqua/css/ligerui-all.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>--%>
<%--<link href="/js/lib/ligerUI/skins/CadetBlue/css/all.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>--%>
<link href="${path}/js/lib/ligerUI/skins/Aqua/css/tms.aqua.min.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<link href="${path}/js/lib/ligerUI/skins/CadetBlue/css/tms.cadetblue.min.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<link href="${path}/css/tms/font/iconfont.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<%-- <link href="/css/common/header.css" rel="stylesheet" type="text/css" /> --%>
<%-- <link href="/css/common/common.css" rel="stylesheet" type="text/css"/> --%>

<link rel="stylesheet" type="text/css" id="mylink"/>
<script src="${path}/js/lib/jquery/jquery-1.11.1.min.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/tms.ligerui.v133.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery.cookie.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/utils/json2.js?t=${applicationScope.sys_version}"></script>

<script src="${path}/js/lib/jquery-validation/jquery.validate.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/jquery.metadata.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/messages_cn.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<!-- 扩展 -->
<script src="${path}/js/lib/LG.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/common/header.jsheader.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/utils/throttle.js?t=${applicationScope.sys_version}" type="text/javascript"></script>