<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2016/11/25
  Time: 14:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>车辆监控</title>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style type="text/css">
        iframe {
            margin: -46px 0 0;
            padding: 0;
            height: 100%;
            width: 100%;
        }
        .wrapper100-inner{
            border: none;
            overflow: hidden;
        }
    </style>
</head>
<body>
<div class="toolbar-wrapper form-toolbar">
    <div class="l-toolbar">
        <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" onclick="refresh();">
            <span>刷新</span>
            <div class="l-icon l-icon-refresh"></div>
        </div>
        <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" data-action="select-menu">
            <span>返回</span>
            <div class="l-icon l-icon-backtrack"></div>
        </div>
    </div>
</div>
<div class="wrapper100">
    <div class="wrapper100-inner">
        <iframe id="myCarInfo" name="myCarInfo" src="${result}" frameborder="0"></iframe>
    </div>
</div>
<script type="text/javascript">
    function refresh() {
        location.reload();
    }

    var result = '${result}';
    if (result == "") {
        alert("尚未检测到车辆信息。");
    }


</script>
</body>
</html>
