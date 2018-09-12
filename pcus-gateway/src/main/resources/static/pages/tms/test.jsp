<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>订单明细</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
</head>
<style>
    .form-wrapper {
        height: 50%;
    }

    .form-wrapper .l-form-container .l-form > ul + .l-group {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px dashed #c1c1c1;
    }
</style>
<body>
<div id="layout">
    <div class="toolbar-wrapper">
        <div id="toptoolbar"></div>
    </div>
    <div class="form-wrapper">
        <div class="form-wrapper-inner">
            <form id="mainForm"></form>
        </div>
    </div>
    <div class="form-wrapper">
        <div class="form-wrapper-inner">
            <form id="subForm"></form>
        </div>
    </div>
    <div id="subFormList">
    </div>
</div>
</body>
<script>
    var $mainForm = $("#mainForm");
    var $subForm = $("#subForm");

    var mainForm = $mainForm.ligerForm({
        fields: [
            {
                display: '单据状态', group: "基础信息",
                name: 'state_name',
                width: 170,
                space: 30,
                newline: false,
                type: 'text',
//                options: {
//                    readonly: true
//                }
                validate: {
                    required: true,
                    range: [1, 100]
                }
            },
            {
                display: '单据', group: "重要信息",
                name: 'bill_name',
                width: 170,
                space: 30,
                newline: false,
                type: 'text',
//                options: {
//                    readonly: true
//                }
                validate: {
                    required: true,
                    range: [1, 100]
                }
            },
        ],
        validate: true,
        toJSON: JSON2.stringify
    });

    var subFormOption = {
        prefixID: "s_",
        fields: [
            {
                display: '子状态', group: "子表信息",
                name: 'sub_state_name',
                width: 170,
                space: 30,
                newline: false,
                type: 'text',
                options: {},
                validate: {
                    required: true,
                    range: [1, 100]
                }
            }
        ],
        validate: true,
        toJSON: JSON2.stringify
    };
    var subForm = $subForm.ligerForm(subFormOption);

    var CLS_L_FORM_CONTAINER = ".l-form-container";

    //主表容器
    var mainFormContainer = $mainForm.find(CLS_L_FORM_CONTAINER);
    //子表容器
    var subFormContainer = $subForm.find(CLS_L_FORM_CONTAINER);

    //插入节点
    var ul1 = mainFormContainer.children("ul:eq(1)");
//    subFormContainer.children().insertAfter(ul1);
    //整个表单插入
    $subForm.insertAfter(ul1);
    //加载
//    subFormContainer.parent().append(subFormContainer.children());
//    subFormContainer.remove();
    //移动
//    $subForm.insertAfter(ul1);
//    subForm.removeClass('l-form');
    subForm.valid();

//    console.log(subForm.getData());

//    mainForm.valid();
//    console.log(mainForm.getData());

//    $("#subFormList").appendChild($(<form>))

    //重构

    var $formGroups = [], formGroups = [],
            subFormList = $("#subFormList")
            ;
    for (var i = 0; i < 5; i++) {
//        $formGroups.push($("<form id=" + ("subForm" + i) + "></form>"));
        subFormList.append($("<form id=" + ("subForm" + i) + "></form>"));
        $formGroups.push($("#subForm" + i));

        //修改子列表的前缀
        var option = $.extend({}, subFormOption, {
            prefixID: "s" + i + "_"
        });

        //初始化
        var formGroup = $formGroups[i].ligerForm(option);
        formGroups.push(formGroup);
        $formGroups[i].insertAfter(ul1);
    }
//

    for (var i = 0; i < 5; i++) {
        formGroups[i].valid();
    }

//    console.log(mainForm.getData());

</script>
</html>