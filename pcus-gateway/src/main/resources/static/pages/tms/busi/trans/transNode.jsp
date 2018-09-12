<%--
  Created by IntelliJ IDEA.
  User: Shin
  Date: 2016/11/2
  Time: 20:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>节点信息</title>
    <meta name="renderer" content="webkit">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <style>
        .form-wrapper{
            padding-bottom:10px;
        }
    </style>
</head>
<body>
<div class="toolbar-wrapper form-toolbar">
    <div class="l-toolbar">
        <div class="l-toolbar-item l-panel-btn l-toolbar-item-hasicon" data-action="select-menu">
            <span>返回</span>
            <div class="l-icon l-icon-backtrack"></div>
        </div>
    </div>
</div>
<div class="form-wrapper">
    <div class="form-wrapper-inner">
        <div class="node-list" id="node-list" ></div>
    </div>
</div>
<script id="node-list-html" type="text/html">

    <div class="node-infor clearfix">

        {{each processList as process pi}}

        <!-- node-item 开始-->
        <div class="node-item {{process.lighten ? 'active' : ''}}">
            <div class="node-name">
                {{ process.node_name }}
            </div>
            <div class="node-num">
                {{ process.node_num }}
            </div>

            <div class="node-finish-wrap">
                <div class="circle-line-wrap">
                    <i class="circle"></i>
                    <i class="circle"></i>
                    <i class="circle big"></i>
                    <i class="circle"></i>
                    <i class="circle"></i>
                    <i class="circle big"></i>
                    <i class="circle"></i>
                    <i class="circle"></i>
                    <i class="circle big"></i>
                </div>
                <div class="node-finish-infor">
                    <p>{{process.finish_time}}</p>
                    <p>耗时{{process.cost_time}}</p>
                </div>
            </div>

            <div class="node-item-infor-wrap">
                {{each process.nodeList as node ni}}

                <div class="node-item-infor {{node.lighten ? 'active' : ''}}">
                    <div class="item-name">
                        <span class="iconfont {{ni < (process.nodeList.length -1) ? 'l-icon-times' : 'l-icon-finish'}}"></span>
                        {{node.operation + (node.lighten ? '(' + node.formatted_last_time + ')' : '[未执行]')}}
                    </div>
                    <div class="item-infor">
                        <p>{{node.formatted_create_time}}</p>
                        <p>{{node.username}}</p>
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
        {{if pi < (processList.length-1)}}
        <!-- node-item 结束-->
        <div class="node-process {{process.process_css}}" style="width: {{processWidth}}%;">

        </div>
        {{/if}}
        {{/each}}
    </div>
</script>
</body>
<script>
    var basePath = rootPath + '/tms/busi/transNode/';
    //主单主键
    var bill_id = "${mst_id}";

    LG.ajax({
        url: basePath + "loadList/" + bill_id,
        contentType: 'application/json',
        success: function (data, msg) {
            var html = template("node-list-html", {processList: data, t: new Date().getTime(), processWidth: Math.floor(100 / (data.length - 1))});
            $("#node-list").append(html);
        },
        error: function (message) {
            LG.showError(message);
        }
    });

    //加载节点信息
    function loadNode() {
    }

</script>
</html>
