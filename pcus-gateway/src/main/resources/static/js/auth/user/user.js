//上下文路径
var basePath = rootPath + '/auth/user/'

//空对象
var emptydata = {
    'id': '',
    'version': '0',
    'account': '',
    'name': '',
    'corp_id': '',
    'corpname': '',
    'password': '',
    'password1': '',
    'enabled_time': '',
    'expired_time': '',
    'enabled': '',
    'is_account_non_expired': true,
    'is_account_non_locked': true,
    'is_credentials_non_expired': true,
    'creator_name': '',
    'modifier_name': '',
    'creator_id': '',
    'modifier_id': '',
    'create_time': '',
    'modify_time': '',
    'ext': '',
    'ext_id': '',
    'mobile': '',
    'qqno': '',
    'wechatno': '',
    'email': '',
    'mobile_enabled': false,
    'qqno_enabled': false,
    'wechatno_enabled': false,
    'email_enabled': false,
    'admin': false,
    'remark': ''
}

//设置表单状态
var setFormStatus = function (form, enable, filter) {
    //设置可编辑字段
    form.setEnabled(['account', 'name', 'password', 'password1', 'enabled_time', 'expired_time', 'enabled',
        'mobile', 'qqno', 'wechatno', 'email', 'mobile_enabled', 'qqno_enabled', 'wechatno_enabled', 'email_enabled',
        'remark'], enable);
    setLeftStatus(!enable)
    setTopStatus(filter, !enable)
}

function addMask(target){
    var mask = $('<div class="customMask" style="display: none; height: 100%;background: #e1e1e1; font-size: 1px; left: 0; opacity: 0.5; overflow: hidden; position: absolute;top :0px; width: 100%; z-index: 9000;"></div>');
    target.append(mask);
}

//设置遮罩层，不可乱点
var setLeftStatus = function (enable) {
    if (enable){;
        $(".customMask").hide();
    }
    else{
        $(".customMask").show();
    }
}
//设置遮罩层，不可乱点
var setTopStatus = function (form, enable) {
//	$('#filterform').).css('z-index', enable ? 0 : -1)
    $('#filterform').css('opacity', enable ? 1 : 0.4)
    form.setEnabled(['filtercorp', 'filterfield', 'filtertype', 'filtername'], enable);
}

function out(value) {
    alert(JSON2.stringify(value))
}

/**
 * 初始化顺序
 */
$(function () {

    // console.log(basePath);

    //上下文信息
    var ctx = new PageContext()
    var filtertypeCount = 0, filterfieldCount = 0;


    //初始化界面
    var layout=$("#layout").ligerLayout({
        minLeftWidth:200,
        leftWidth: 200,
        height: '100%',
        space: 1,
        heightDiff: 0
    });

    addMask($(".l-layout-left"));

   var contentLayout = $("#content").ligerLayout({
        allowTopResize:false,
        topHeight: 197,
        height: '100%',
        space: 0,
        heightDiff: -25
    });

    var childrenTab = $("#children-tab").ligerTab({
        height: '100%',
        changeHeightOnResize: true,
        //width: '100%'
        heightDiff: -60
    });

    //界面状态改变触发事件
    var uiStatus = {
        //进入初始状态
        'OP_INIT': function () {
            setFormStatus(mainform, false, filterform);
        },
        //进入编辑状态
        'OP_EDIT': function () {
            //缓存当前页面的数据
            cm.setData(maindata.getData());
            //启用编辑
            setFormStatus(mainform, true, filterform)
        },
        //进入新增状态
        'OP_ADD': function () {
            cm.setData(maindata.getData());
            //清空角色列表
            roleGrid._clearGrid()
            setFormStatus(mainform, true, filterform)
        }
    }

    //角色列表
    var roleGrid = $("#roleGrid").ligerGrid({
        columns: [
            {display: '角色名称', name: 'rolename', align: 'left', minWidth: 180, width: '50%'},
            {display: '角色编码', name: 'rolecode', minWidth: 180, width: '50%'}
        ],
        pageSize: 10,
        url: basePath + 'loadPageRoles',
        delayLoad: true,		//初始化不加载数据
        width: '100%', height: '100%',autoStretch:true,heightDiff: -20,
        checkbox: false, usePager: true, enabledEdit: true, clickToEdit: false,
        fixedCellHeight: true, rowHeight: 30, headerRowHeight: 28
    });

    //角色选择树
    var roleTree = $("#roleTree").ligerTree({
        url: basePath + 'loadSelectRoles',
        data: [],
        idFieldName: 'id',
        // textFieldName: 'rolename',
        parentIDFieldName: 'pid',
        slide: false,
        delayLoad: true,
        checkbox: true,
        isExpand: true,
        nodeWidth: 150,
    })

    //卡片界面主表单ID
    var mainformid = '#mainform';
    //用户表单
    var mainform = $(mainformid).ligerForm({
        inputWidth: 168, labelWidth: 90, space: 29,
        fields: [
            {name: "id", type: "hidden"},
            {name: "version", type: "hidden"},
            {name: "old_account", type: "hidden"},
            {name: "corp_id", type: "hidden"},

            {
                display: "登录账号", name: "account", newline: true, type: "text",
                validate: {
                    required: true, checkUserUnique: true,
                    messages: {required: "登录账号不能为空", checkUserUnique: "登录账号在系统已存在"}
                }
            },
            {display: "用户名称", name: "name", newline: false, type: "text", validate: {required: true}},
            {display: "建立公司", name: "corpname", newline: false, type: "text"},

            {
                display: "邮箱", name: "email", newline: false, type: "text",
                validate: {checkEmailUnique: true}
            },
            {display: "邮箱登录", name: "email_enabled", newline: false, type: "checkbox"},
            {
                display: "手机", name: "mobile", newline: false, type: "text",
                validate: {checkMobileUnique: true}
            },
            {display: "手机登录", name: "mobile_enabled", newline: false, type: "checkbox"},
            {
                display: "QQ", name: "qqno", newline: false, type: "text",
                validate: {checkQqnoUnique: true}
            },
            {display: "QQ登录", name: "qqno_enabled", newline: false, type: "checkbox"},
            {
                display: "微信", name: "wechatno", newline: false, type: "text",
                validate: {checkWechatnoUnique: true}
            },
            {display: "微信登录", name: "wechatno_enabled", newline: false, type: "checkbox"},
            {display: "管理员", name: "admin", newline: false, type: "checkbox", options: {disabled: true}},
            {
                display: "生效时间", name: "enabled_time", newline: false, type: "date",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}
            },
            {
                display: "失效时间", name: "expired_time", newline: false, type: "date",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}
            },
            {display: "启用标志", name: "enabled", newline: false, type: "checkbox"},

            //审计字段
            {display: "备注", name: "remark", newline: false, type: "text", width: 457},
            {display: "最后登录IP", name: "last_login_ip", newline: false},
            {
                display: "最后登录时间", name: "last_login_time", newline: false, type: "date",
                editor: {showTime: true, format: "yyyy-MM-dd hh:mm:ss"}
            },
            {name: "is_account_non_expired", type: "hidden"},
            {name: "is_account_non_locked", type: "hidden"},
            {name: "is_credentials_non_expired", type: "hidden"},

            {name: "ext", type: "hidden"},
            {name: "ext_id", type: "hidden"},

            {name: "creator_id", type: "hidden"},
            {display: "创建人", name: "creator_name", newline: false, type: "text"},
            {display: "创建时间", name: "create_time", newline: false, type: "text"},
            {name: "modifier_id", type: "hidden"},
            {display: "修改人", name: "modifier_name", newline: false, type: "text"},
            {display: "修改时间", name: "modify_time", newline: false, type: "text"}
        ],
        toJSON: JSON2.stringify
    });

    //审计字段
    mainform.setEnabled(['id', 'version', 'corp_id', 'corpname', 'creator_name', 'create_time', 'modifier_name', 'modifier_name', 'modify_time', 'ext', 'ext_id', 'last_login_ip', 'last_login_time'], false)
    //字段格式增强(时间)
    var maindata = new FormPlus(mainform, mainformid, ['create_time', 'modify_time', 'last_login_time', 'expired_time', 'enabled_time'])
    //初始化人员
    var mainTree = $("#mainTree").ligerTree({
//		url: basePath + 'list.do',
        //data: corpdata,
        nodeWidth: 200,
        idFieldName: 'id',
        textFieldName: 'name',
        parentIDFieldName: 'pid',
        slide: false,
        checkbox: false,
        isExpand: true,
        onSelect: function onSelect(node) {
            cm.setData(node.data);
            mainform.setData(emptydata);
            mainform.setData(node.data);
            $('#mainform').find('input[name="old_account"]').val(node.data.account);

            roleGrid.setParm('id', node.data.id);
            roleGrid.reload();
        },
        onSuccess: function (data) {
            var obj = cm.getData();
            if (obj && obj.id) {
                mainTree.selectNode(obj.id)
            }
        }
    })

    function btnClick(item) {
        switch (item.id) {
            case "add":
                cm.setCardStatus('OP_ADD')
                add()
                break;
            case "update":
                var id = $('#mainform').find('input[name="id"]').val()
                if (id) {
                    cm.setCardStatus('OP_EDIT')
                    f_validate()
                } else {
                    LG.showError("请选择用户")
                }
                break;
            case "remove":
                remove()
                break
            case "save":
                save()
                break
            case "refresh":
                refresh()
                break
            case "cancel":
                //取消后重新加载缓存的数据，包括子表
                var data = cm.getData();
                if (data && data.id) {
                    mainTree.selectNode(data.id)
                }
                cm.setCardStatus('OP_INIT')
                break
            case "retrieve":
                out(maindata.getData())
                break
            case "resetPwd":
                $.ligerDialog.confirm('确定重置用户密码为1?', function (confirm) {
                    if (confirm)
                        resetPwd()
                })
                break
            case "grantRoles":
                grantRoles()
                break
        }
    }

    function remove() {
        var user = maindata.getData()
        if (!user || !user.id) {
            LG.showError("请选择用户");
            return;
        }
        //TODO 删除前检查用户是否有其它约束
        $.ligerDialog.confirm('确定删除吗?', function (confirm) {
            if (confirm) {
                LG.showLoading('正在删除...');
                LG.ajax({
                    url: basePath + 'remove.do ',
                    data: {
                        id: user.id,
                        version: user.version,
                        modifier_id: ctx.user_id
                    },
                    success: function (data, msg) {
                        LG.hideLoading();
                        mainform.setData(emptydata)
                        refresh()
                        LG.showSuccess("删除成功")
                    },
                    error: function (message) {
                        LG.showError(message);
                    }
                });
            }
        })
    }

    //获取角色
    function grantRoles() {

        //当前选中的用户
        var user = maindata.getData();
        if (!user || !user.id) {
            LG.showError("请选择用户");
            return;
        }

        if(!user.corp_id){
            LG.showError("请选择公司");
            return;
        }

        roleTree.clear();
        roleTree.loadData(null, basePath + 'loadSelectRoles', {
            id: user.id,
            corp_id: user.corp_id
        });

        $.ligerDialog.open({
            target: $("#selectRole"),
            title: '请选择角色',
            buttons: [
                {
                    text: '确定', onclick: function (item, dialog) {
                    //提交分配
                    var selected = roleTree.getChecked();
                    var params = {
                        id: $('#mainform').find('input[name="id"]').val(),
                        corp_id: $('#mainform').find('input[name="corp_id"]').val(),
                        account: $('#mainform').find('input[name="account"]').val(),
                    }

                    //标记选中的角色
                    var hash = {};
                    if (selected && selected.length > 0) {

                        for (var i = 0; i < selected.length; i++) {
                            var roleData = selected[i]['data'];
                            hash[roleData.id] = true;
                        }
                    }

                    //将所有的角色传回去
                    var roleList = roleTree.getData();

                    //保留这种古老的写法
                    if (roleList && roleList.length > 0) {
                        for (var i = 0, j = 0; i < roleList.length; i++) {
                            var roleData = roleList[i];

                            if (roleData.children && roleData.children.length > 0) {
                                //遍历角色
                                var length = roleData.children.length;
                                for (var k = 0; k < length; k++) {
                                    var role = roleData.children[k];
                                    params['roles[' + j + '].id'] = role.id;
                                    params['roles[' + j + '].rolename'] = role.text || '';
                                    params['roles[' + j + '].ischecked'] = hash[role.id] || false;
                                    j++;
                                }
                            }
                        }
                    }

                    LG.ajax({
                        url: basePath + 'grantAnyRoles.do ',
                        data: params,
                        success: function (data, msg) {
                            LG.showSuccess('分配成功!')
                            mainform.setData(data)
                            cm.setCardStatus('OP_INIT')
                            dialog.hide()

                            //刷新角色列表
                            roleGrid.reload()
                        },
                        error: function (message) {
                            LG.showError(message);
                            //detailWin.hide();
                        }
                    })

                }
                },
                {
                    text: '取消', onclick: function (item, dialog) {
                    dialog.hidden();
                }
                }
            ]
        });
    }

    function resetPwd() {
        var id = $('#mainform').find('input[name="id"]').val()

        LG.ajax({
            url: basePath + 'resetPwd.do ',
            data: maindata.getData(),
            success: function (data, msg) {
                LG.showSuccess('重置成功!')
                mainform.setData(data)
                cm.setCardStatus('OP_INIT')
                refresh()
            },
            error: function (message) {
                LG.tip(message);
                //detailWin.hide();
            }
        });

    }

    function add() {
        //设置默认的公司
        var selected = filterform.getEditor("filtercorp")
        mainform.setData($.extend(emptydata, {
            //默认公司
            corp_id: selected ? selected.getValue() : ctx.corp_id,
            corpname: selected ? selected.getText() : ctx.corpname,
            //默认创建人
            creator_id: ctx.user_id,
            creator_name: ctx.name,
        }))

        f_validate()
    }

    //保存
    function save() {
        if (!LG.validator.form()) {
            LG.showInvalid();
            return;
        }
        var status = cm.getCardStatus()
        var url = basePath
        if (status == 'OP_EDIT') {
            url += 'update.do'
        } else if (status == 'OP_ADD') {
            url += 'add.do'
        } else {
            LG.showError("非法界面状态")
        }

        LG.ajax({
            url: url,
            data: maindata.getData(),
            success: function (data, msg) {
                LG.showSuccess('保存成功!')
                cm.setData(data)
                cm.setCardStatus('OP_INIT')
                refresh()
            },
            error: function (message) {
                LG.showError(message);
            }
        });
    }

    //获取过滤条件，重新加载左侧用户数据
    function refresh() {
        //过滤条件
        var filterData = {}
        //过滤字段
        var filterFields = ['filtercorp', 'filterfield', 'filtertype', 'filtername']
        for (var i = 0; i < filterFields.length; i++) {
            //不能用fiterform.getEditor().getValue(),有问题
            filterData[filterFields[i]] = $('#filterform').find('input[name="' + filterFields[i] + '"]').val()
        }
        mainTree.clear()
        mainTree.loadData(null, basePath + 'loadUsers.do', filterData)
    }

    /*************************************************************validator******************************************************/
    function f_validate() {
        // 增加表单校验
        $.metadata.setType("attr", "validate");
        LG.validate($('#mainform'), {debug: true});
    }

    //异步验证用户名
    $.validator.addMethod("checkUserUnique", function (value, element) {
        var userdata = {
            account: $('#mainform').find('input[name="account"]').val(),
            id: $('#mainform').find('input[name="id"]').val(),
        }
        return checkUnique(value, element, userdata)
    }, "用户账号在系统已存在");

    $.validator.addMethod("checkEmailUnique", function (value, element) {
        var userdata = {
            email: $('#mainform').find('input[name="email"]').val(),
            id: $('#mainform').find('input[name="id"]').val(),
        }
        return checkUnique(value, element, userdata)
    }, "邮箱在系统已存在");

    $.validator.addMethod("checkMobileUnique", function (value, element) {
        var userdata = {
            mobile: $('#mainform').find('input[name="mobile"]').val(),
            id: $('#mainform').find('input[name="id"]').val(),
        }
        return checkUnique(value, element, userdata)
    }, "手机号码在系统已存在");

    $.validator.addMethod("checkWechatnoUnique", function (value, element) {
        var userdata = {
            wechatno: $('#mainform').find('input[name="wechatno"]').val(),
            id: $('#mainform').find('input[name="id"]').val(),
        }
        return checkUnique(value, element, userdata)
    }, "微信号码在系统已存在");

    $.validator.addMethod("checkQqnoUnique", function (value, element) {
        var userdata = {
            qqno: $('#mainform').find('input[name="qqno"]').val(),
            id: $('#mainform').find('input[name="id"]').val(),
        }
        return checkUnique(value, element, userdata)
    }, "QQ号码在系统已存在");

    function checkUnique(value, element, userdata) {
        var result = false;

        $.ajax({
            cache: false,
            async: false,
            url: basePath + "checkUserUnique.do",
            data: userdata,
            dataType: 'json',
            type: 'get',
            success: function (data) {
                result = data
            },
            error: function (result, b) {
                result = true
            }
        })
        return result
    }

    var validator = $('#mainform').validate({
        //调试状态，不会提交数据的
        debug: true,
        errorPlacement: function (lable, element) {

            if (element.hasClass("l-textarea")) {
                element.addClass("l-textarea-invalid");
            } else if (element.hasClass("l-text-field")) {
                element.parent().addClass("l-text-invalid");
            }
            $(element).removeAttr("title").ligerHideTip();
            $(element).attr("title", lable.html()).ligerTip();
        },
        success: function (lable) {
            var element = $("#" + lable.attr("for"));
            if (element.hasClass("l-textarea")) {
                element.removeClass("l-textarea-invalid");
            } else if (element.hasClass("l-text-field")) {
                element.parent().removeClass("l-text-invalid");
            }
            $(element).removeAttr("title").ligerHideTip();
        },
        submitHandler: function () {
            alert("Submitted!");
        }
    });

    //过滤框
    var filterform = $('#filterform').ligerForm({
        inputWidth: 150, labelWidth: 70, space: 10,
        fields: [
            {
                display: "公司", name: "filtercorp", textField: 'filtercorpname', newline: false, type: "select",
                editor: {
                    valueField: 'id',
                    textField: 'name',
                    treeLeafOnly: false,
                    width: 200,
                    selectBoxWidth: 200,
                    // selectBoxHeight: 500,
                    cancelable: true,
//			        会调用_initData，触发选择事件
//					initValue: ctx.corp_id,
//					initText: ctx.corpname,
                    tree: {
                        url: basePath + 'loadCorps.do',
                        idFieldName: 'id',
                        textFieldName: 'name',
                        parentIDFieldName: 'pid',
                        slide: false,
                        checkbox: false,
                        isExpand: true,
                        nodeWidth:130,
                        onSuccess: function (data) {
//							会触发5次onSelected事件
//							filterform.setData({
//			        			'filtercorp' : ctx.corp_id,
//			        			'filtercorpname' : ctx.corpname
//			        		})
                            //加载完毕设置公司为当前登录用户所在公司
                            //只触发1次onSelected事件，简直无情
                            filterform.getEditor("filtercorp")._changeValue(ctx.corp_id, ctx.corpname, true)
                        }
                    },
                    onSelected: function (newvalue) {
                        refresh()
                    }
                }
            },
            {
                display: "过滤字段", name: "filterfield", newline: false, type: "select",
                editor: {
                    cancelable: false,
                    //触发了onSelected事件
                    value: 'USERNAME',
                    //initIsTriggerEvent: true,
                    data: [
                        {text: '登录账号', id: 'USERNAME'},
                        {text: '用户名称', id: 'NAME'},
                    ],
                    onSelected: function (value, text) {
                        if (filterfieldCount++ > 0) {
                            refresh()
                            mainform.setData(emptydata)
                        }
                    }
                }
            },

            {
                display: "类型", name: "filtertype", newline: false, type: "select",
                editor: {
                    cancelable: false,
                    //触发了onSelected事件
                    value: 'ALL',
                    //initIsTriggerEvent: true,
                    data: [
                        {text: '所有用户', id: 'ALL'},
                        {text: '锁定用户', id: 'LOCKED'},
                        {text: '一般用户', id: 'PLAIN'},
                    ],
                    onSelected: function (newvalue) {
                        if (filtertypeCount++ > 0) {
                            refresh()
                            mainform.setData(emptydata)
                        }
                    }
                }
            },
            {
                display: "过滤类容", name: "filtername", newline: false, type: "text", editor: {
                onBlur: function () {
                    refresh()
                    mainform.setData(emptydata)
                }
            }
            },
        ]
    })

    //工具栏,
    var topitems = {
        add: {id: 'add', text: '增加', click: btnClick, icon: 'add', status: ['OP_INIT']},
        update: {id: 'update', text: '修改', click: btnClick, icon: 'edit', status: ['OP_INIT']},
        remove: {id: 'remove', text: '删除', click: btnClick, icon: 'delete', status: ['OP_INIT']},
        save: {id: 'save', text: '保存', click: btnClick, icon: 'save', status: ['OP_ADD', 'OP_EDIT']},
        cancel: {id: 'cancel', text: '取消', click: btnClick, icon: 'cancel', status: ['OP_ADD', 'OP_EDIT']},
        refresh: {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']},
        resetPwd: {id: 'resetPwd', text: '重置密码', click: btnClick, icon: 'resetpassword', status: ['OP_INIT']},
        grantRoles: {id: 'grantRoles', text: '分配角色', click: btnClick, icon: 'distribution', status: ['OP_INIT']},
//    	  { id: 'retrieve', text: '取数', click: btnClick, icon: 'view', status: ['OP_INIT', 'OP_ADD', 'OP_EDIT'] },{ line:true },
    }

    var toptoolbar = $("#toptoolbar").ligerToolBar();

    //按钮状态控制
    var cm = new CardManager(toptoolbar, uiStatus, topitems);
    cm.setCardStatus('OP_INIT');

    //高度自适应
    (function autoSetGridHeight(){
        var $filterForm=$("#filterform"),
            $layoutCenter=$("#layout-center"),
            $content=$("#content"),
            $contentForm=$("#mainform"),
            $tabContent=$("#children-tab").children(".l-tab-content:eq(0)");
        var debounceResetHeight = debounce(function () {
            var contentHeight = $layoutCenter.height()-$filterForm.height()-98,
                contentFormHeight = $contentForm.height() + 23;
            if(contentFormHeight>180) contentFormHeight=165;
            var centerHeight = contentHeight - contentFormHeight -1;
            $content.height(contentHeight);
            $content.children(".l-layout-top:eq(0)").height(contentFormHeight - 15);
            $content.children(".l-layout-center:eq(0)").height(centerHeight + 15);
            $content.children(".l-layout-center:eq(0)").children(".l-layout-content").height(centerHeight);
            $tabContent.height(centerHeight-10);
            //表格
            roleGrid.setHeight(centerHeight-10);
        }, 200, true);
        debounceResetHeight();
        $(window).resize(function () {
            debounceResetHeight();
        });
    })();
});