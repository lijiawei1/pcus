

    var SELECTED = 'selected',
        ID_FIELD = "pk_id";

    //默认增删改查刷新
    var defaultAction = function (item) {
        var l_create_psn,l_create_time,l_modify_psn,l_modify_time;
        switch (item.id) {
            case "add":
                //打开对话框
                openDialog(emptyData);
                $mainForm.data(SELECTED, null);
                var username = parent.username;
                if (!username) {
                    username = parent.parent.username;
                }

                l_create_psn = liger.get("create_psn");
                l_create_psn && l_create_psn.setValue(username);

                l_create_time = liger.get("create_time");
                l_create_time && l_create_time.setValue(DateUtil.dateToStr());

                if(typeof defaultAction_add === "function" ) defaultAction_add();
                break;
            case "edit":
                var selected = mainGrid.getSelected();
                if (!selected) {
                    LG.showError('请选择行');
                    return;
                }
                //打开对话框
                openDialog(emptyData);
                mainForm.setData(selected);
                $mainForm.data(SELECTED, selected);
                var username = parent.username;
                if (!username) {
                    parent.parent.username;
                }

                l_modify_psn = liger.get("modify_psn");
                l_modify_psn && l_modify_psn.setValue(username);

                l_modify_time = liger.get("modify_time");
                l_modify_time && l_modify_time.setValue(DateUtil.dateToStr());
                break;
            case "delete":
                var selected = mainGrid.getCheckedRows();
                if( (selected == null) || (selected == '') || (selected == 'undefined') )
                {
                    LG.showError('请选择行');
                    return;
                };

                //适配不同的主表
                $.ligerDialog.confirm('确定删除吗?', function (confirm) {

                    if (!confirm) return;

                    //待删除主键列表
                    var ids = $.map(selected, function (item, index) {
                        return item[ID_FIELD];
                    }).join(',');
                    var data = {ids: ids};

                    if (typeof mainId != "undefined") {
                        data = $.extend(data, {
                            mainId: mainId
                        })
                    }
                    // $.ajax({
                    //     url: basePath + 'remove',
                    //     data: data,
                    //     success: function (data, msg) {
                    //         if(JSON2.parse(data).error){
                    //             LG.showError(JSON2.parse(data).message);
                    //         }else{
                    //             LG.showSuccess('删除成功');
                    //         }
                    //         //刷新角色列表
                    //         mainGrid.reload();
                    //     },
                    //     error: function (message) {
                    //         LG.showError(message);
                    //     }
                    // });

                    LG.ajax({
                        url: basePath + 'remove',
                        data: data,
                        success: function (data, msg) {
                            LG.tip('删除成功！');
                            //刷新角色列表
                            mainGrid.reload();
                        },
                        error: function (message) {
                            LG.showError(message);
                        }
                    });
                });
                break;
            case "refresh":
                mainGrid.reload();
                break;
            default:
                //扩展按钮动作
                if (btnClick) {
                    btnClick(item);
                }

                break;
        }
    };

    //默认动作
    var defaultActionOption = {
        items: [
            {id: 'add', text: '增加', click: defaultAction, icon: 'add', status: ['OP_INIT']},
            // {id: 'edit', text: '修改', click: defaultAction, icon: 'edit', status: ['OP_INIT']},
            {id: 'delete', text: '删除', click: defaultAction, icon: 'delete', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: defaultAction, icon: 'refresh', status: ['OP_INIT']}
        ]
    };
    //扩展工具条动作，当存在id相同的项时，会自动覆盖
    // (function(){
    //     var items=defaultActionOption.items,
    //         itemHash={};
    //     for(var i=0,len=items.length;i<len;i++){
    //         itemHash[items[i].id]=i;
    //     }
    //     try{
    //         if (toolbarOption && toolbarOption.items && toolbarOption.items.length > 0) {
    //             $.each(toolbarOption.items, function(idx, val) {
    //                 if(typeof itemHash[val.id] !== "undefined"){
    //                     items[itemHash[val.id]]=val;
    //                 }
    //                 else{
    //                     items.push(val);
    //                 }
    //             });
    //         }

    //         if (disabledButtons && disabledButtons.length > 0) {
    //             var array = [];
    //             $.each(defaultActionOption.items, function (i, v) {
    //                 if (disabledButtons.indexOf(v.id) == -1) {
    //                     array.push(v);
    //                 }
    //             });
    //             defaultActionOption.items = array;
    //         }
    //     }catch(e) {
    //         console.log(e);
    //     }
    // })();

    //初始化查询框
    filterForm = $filterForm.ligerForm(filterFormOption);

    //初始化主表
    mainForm = $mainForm.ligerForm(mainFormOption);

    //初始化工具栏
    // console.log(toolbarOption);
    if (toolbarOption && Array.isArray(toolbarOption.items)) {
        var defaultOption = {};
        for (var i = defaultActionOption.items.length - 1; i >= 0; i--) {
            var item = defaultActionOption.items[i];
            defaultOption[item.id] = i;
        }
        for (var i = toolbarOption.items.length - 1; i >= 0 ;i--){
            var item = toolbarOption.items[i];
            defaultOption[item.id] >= 0 && defaultActionOption.items.splice(defaultOption[item.id], 1);
        }
        defaultActionOption.items = defaultActionOption.items.concat(toolbarOption.items);
    }
    toptoolbar = LG.powerToolBar($("#toptoolbar"), defaultActionOption);

    //初始化表格
    mainGrid = $mainGrid.ligerGrid(gridOption);

    //初始化搜索按钮
    var searchBtn = createButton({
        appendTo: $("#searchBtn"),
        width: 80,
        text: '查询',
        click: function () {
            //判断是否有其他操作
            if (filterForm.valid()) {
                //表格查询
                mainGrid.set('parms', [{name: 'where', value: getSearchFormData(true)}]);
                mainGrid.changePage('first');
                mainGrid.loadData();
                //如果是在高级搜索里，则需关闭高级搜索
                var $advanced=$(this).parents(".advanced-search-wrap");
                if($advanced.length>0){
                    $advanced.children('[data-action="close-advanced-search"]').trigger("click");
                }
            }
            else {
                filterForm.showInvalid();
            }
        }
    });

    //重置按钮
    createButton({
        appendTo: $("#resetBtn"),
        width: 80,
        text: '重置',
        click: function () {
            var editors = filterForm.editors;
            for (var i in editors) {
                var editor = liger.get(editors[i].control.element);
                if (editor instanceof $.ligerui.controls.TextBox) {
                    editor.setValue("");
                    $(editors[i].control.element).val("");
                } else if (editor instanceof $.ligerui.controls.ComboBox || editor instanceof $.ligerui.controls.DateEditor) {
                    if (!$(editor.wrapper).hasClass("l-text-readonly"))
                        editor.clear();
                }
            }

            mainGrid.set('parms', [{name: 'where', value: getSearchFormData(true)}])
        }
    });

    function createButton(options) {
        var p = $.extend({
            appendTo: $('body')
        }, options || {});
        var btn = $('<div class="" style="width:60px"><span></span></div>');
        if (p.icon) {
            btn.removeClass("buttonnoicon");
            btn.append('<div class="button-icon"> <img src="' + p.icon + '" /> </div> ');
        }
        //绿色皮肤
        if (p.green) {
            btn.removeClass("button2");
        }
        if (p.width) {
            btn.width(p.width);
        }
        if (p.click) {
            btn.click(p.click);
        }
        if (p.text) {
            $("span", btn).html(p.text);
        }
        if (typeof (p.appendTo) == "string") p.appendTo = $(p.appendTo);
        btn.appendTo(p.appendTo);
        return btn;
    }

    var defaultSearchFilter = {
        and:[],
        or:[]
    };
    //获得搜索表单的数据
    function getSearchFormData(dr) {
        return filterForm.getSearchFormData(dr,defaultSearchFilter);
    }

    //打开对话框
    function openDialog(data) {
        //消除校验格式
        LG.clearValid($mainForm);

        // 设置时间格式有问题
        mainForm.setData(data);

        $.ligerDialog.open(dialogOption);
    }


    function inlineClineDialogEdit(obj) {
        var index = $(obj).data("index");
        var selected = mainGrid.getRow(index);
        var l_modify_psn,l_modify_time;
        openDialog(emptyData);
        mainForm.setData(selected);
        $mainForm.data(SELECTED, selected);

        l_modify_time = liger.get("modify_time");

        if (l_modify_time != null && l_modify_time.getValue() != null) {
            var username = parent.username;
            if (!username) {
                username = parent.parent.username;
            }
            l_modify_psn = liger.get("modify_psn");
            l_modify_psn && l_modify_psn.setValue(username);
            l_modify_time.setValue(DateUtil.dateToStr());
        }
    }

    //单框搜索
    //本事件的e，输入的值，触发源，触发源的e
    $("body").on("single-search",function(e, value, target, target_e){
        value = $.trim(value);

        if(typeof defaultSearchFilter === "undefined"){
            defaultSearchFilter = {
                and:[],
                or:[]
            };
        }

        mainGrid.set('parms', [{name: 'where', value: mainGrid.getSearchGridData(true,value,defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    });

    $(".l-fieldcontainer").on("keydown",":input[name=sname]",function(event){
        var $this = $(this);
        switch(event.keyCode){
            case 13 :
                $this.parents("ul.clearfix").children('li').eq(1).children(".l-button").trigger("click");
                return;
            case 27 :
                $this.blur();
                return
        }
    });

    function getSearchGridData(grid, value, defaultSearch) {
        return  grid.getSearchGridData(true,value,defaultSearch);
    }