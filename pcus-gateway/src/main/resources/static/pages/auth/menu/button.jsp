<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<jsp:include page="../../common/pagesV2.jsp"/>
</head>
<body>
<div class="l-container">
	<input id="parentId" hidden="hidden" value=""/>
	<input id="parentNo" hidden="hidden" value=""/>
	<input id="mlevel" hidden="hidden" value=""/>
	<!-- 菜单栏 -->
	<div class="l-page-top">
		<div id="toptoolbar"></div>
	</div>
	<div class="l-page-top">
		<div>
			<form id="filterform"></form>
		</div>
	</div>
	<div id="layout">
		<div id="layout-center" position="center" title="功能" >
			<!-- 列表界面 -->
			<form id="mainform">
				<div id="mainGrid"></div>
			</form>
		</div>
		  <!-- 防止DIV的越界 -->
	  	<div class="l-clear"></div>
		<ul class="iconlist"></ul>
	</div>
</div>
</body>
<script>
	//当前选中的父菜单编码
	<%--var parentId = '${param.pid}', parentNo = '${param.no}', mlevel = '${param.mlevel}';--%>
	<%--console.log(parentId);--%>
	<%--console.log(parentNo);--%>
	<%--console.log(mlevel);--%>
</script>
<%--<script src="<c:url value='/js/auth/menu/button.js'/>"></script>--%>
<%--<script src="<c:url value='/js/lib/iconselector.js'/>"></script>--%>
</html>