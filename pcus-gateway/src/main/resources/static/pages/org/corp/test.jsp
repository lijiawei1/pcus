<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
<jsp:include page="../../common/pages.jsp"/>
<script src="<c:url value='/js/org/test.js'/>"></script>

</head>
<body style="padding: 0px">

	<!-- 菜单栏 -->
	<div class="l-page-top">
		<div id="toptoolbar"></div>
	</div>
	<div id="layout">
		<div position="center" title="基本信息" >
			<!-- 卡片界面 -->
			<div>
				<form id="detailform"></form>
			</div>
		</div>
	</div>
</body>