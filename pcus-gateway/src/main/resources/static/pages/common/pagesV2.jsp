<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<c:set value="${pageContext.request.contextPath}" var="path" scope="request"/>
<script src="${path}/js/lib/jquery/jquery-1.11.1.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<%
    //测试环境使用散装脚本
    String url = request.getRemoteHost();
    if ("127.0.0.1".equals(url)) {
%>
<link href="${path}/js/lib/ligerUI/skins/Aqua/css/ligerui-all.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<link href="${path}/js/lib/ligerUI/skins/CadetBlue/css/all.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<%--<link href="/js/lib/ligerUI/skins/ligerui-icons.css" rel="stylesheet" type="text/css"/>--%>
<link href="${path}/css/tms/font/iconfont.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>

<link href="${path}/css/tms/common-style.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>

<link rel="stylesheet" type="text/css" id="mylink"/>

<script src="${path}/js/lib/ligerUI/V133/js/core/base.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/core/inject.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerAccordion.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerButton.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerCheckBox.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerCheckBoxList.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerComboBox.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerDateEditor.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerDialog.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerDrag.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerEasyTab.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerFilter.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerForm.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerGrid.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerLayout.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerListBox.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerMenu.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerMenuBar.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerMessageBox.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerPanel.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerPopupEdit.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerPortal.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerRadio.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerRadioList.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerResizable.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerSpinner.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerTab.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerTextBox.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerToolBar.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerTree.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerTip.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerWindow.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerSet.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/bootstrap/bootstrap-tagsinput.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerUI/V133/js/plugins/ligerTagInput.js?t=${applicationScope.sys_version}" type="text/javascript"></script>


<!-- 插件 -->
<script src="${path}/js/lib/jquery-validation/1.15/jquery.validate.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/jquery.metadata.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/1.15/localization/messages_zh.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<script src="${path}/js/lib/jquery.cookie.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/jquery.form.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/utils/json2.js?t=${applicationScope.sys_version}"></script>
<script src="${path}/js/lib/validate.plugin.js?t=${applicationScope.sys_version}"></script>

<!-- 扩展 -->
<script src="${path}/js/lib/LG.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/ligerui.expand.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<script src="${path}/js/lib/iconselector.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/ajaxfileupload.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/DateUtil.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/throttle.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/common.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<script src="${path}/js/lib/utils/ligerSearchForm.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

<script src="${path}/js/lib/utils/template.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/cntrUtil.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/gps.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/priceBaseUtil.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/utils/xlsUtil.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<% } else { %>
<link href="${path}/js/lib/ligerUI/skins/Aqua/css/tms.aqua.min.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<link href="${path}/js/lib/ligerUI/skins/CadetBlue/css/tms.cadetblue.min.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>

<link href="${path}/css/tms/font/iconfont.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>
<link href="${path}/css/tms/common-style.min.css?t=${applicationScope.sys_version}" rel="stylesheet" type="text/css"/>

<script src="${path}/js/tms.ligerui.v133.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/1.15/jquery.validate.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/jquery.metadata.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/lib/jquery-validation/1.15/localization/messages_zh.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/tms.util.min.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<% } %>

<script>
    //部署版本号
    var sys_version = '${applicationScope.sys_version}';
    //系统环境
    var sys_envr = '${applicationScope.sys_envr}';

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

    //页面权限
    <%--console.log('${page_permission}');--%>
    var disabledButtons = JSON.parse('${page_permission}' || '[]');

    //设置默认验证（取消默认忽略:hidden元素），解决下拉框无法验证的问题
    $.validator.setDefaults({ignore: []});

    //扩展String
    (function () {
        String.prototype.padLeft = function (padChar, width) {
            var ret = this;
            while (ret.length < width) {
                if (ret.length + padChar.length < width) {
                    ret = padChar + ret;
                }
                else {
                    ret = padChar.substring(0, width - ret.length) + ret;
                }
            }
            return ret;
        };
        String.prototype.padRight = function (padChar, width) {
            var ret = this;
            while (ret.length < width) {
                if (ret.length + padChar.length < width) {
                    ret += padChar;
                }
                else {
                    ret += padChar.substring(0, width - ret.length);
                }
            }
            return ret;
        };
        String.prototype.trim = function () {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        };
        String.prototype.trimLeft = function () {
            return this.replace(/^\s+/, '');
        };
        String.prototype.trimRight = function () {
            return this.replace(/\s+$/, '');
        };
        String.prototype.caption = function () {
            if (this) {
                return this.charAt(0).toUpperCase() + this.substr(1);
            }
            return this;
        };
        String.prototype.reverse = function () {
            var ret = '';
            for (var i = this.length - 1; i >= 0; i--) {
                ret += this.charAt(i);
            }
            return ret;
        };
        String.prototype.startWith = function (compareValue, ignoreCase) {
            if (ignoreCase) {
                return this.toLowerCase().indexOf(compareValue.toLowerCase()) == 0;
            }
            return this.indexOf(compareValue) == 0
        };
        String.prototype.endWith = function (compareValue, ignoreCase) {
            if (ignoreCase) {
                return this.toLowerCase().lastIndexOf(compareValue.toLowerCase()) == this.length - compareValue.length;
            }
            return this.lastIndexOf(compareValue) == this.length - compareValue.length;
        };
    })()

</script>
<script src="${path}/js/common/card.js?t=${applicationScope.sys_version}" type="text/javascript"></script>
<script src="${path}/js/tms/constant/constant.js?t=${applicationScope.sys_version}" type="text/javascript"></script>

