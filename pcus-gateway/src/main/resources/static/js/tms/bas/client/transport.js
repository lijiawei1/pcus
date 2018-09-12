/**
 * Created by amdin on 2017/5/22.
 */
defaultSearchFilter["and"].push({field: 'client_id', value: client_id, op: 'equal', type: 'string'});


var isDeleteBtn = disabledButtons.indexOf('deleteRoute') >= 0;
var isEditBtn = disabledButtons.indexOf('editRoute') >= 0;

$(function () {

    //初始化编辑按钮
    $mainGrid.on('click', 'a.row-edit-btn', function (e) {
        var index = $(this).data("index");
        var selected = mainGrid.getRow(index);
        refreshLua(selected);
        inlineClineDialogEdit(this);

        initSelect();
        initPara();
    });

    loadAllLoad();
    $("#loadList").on("click", "div.business-card.content>.top", function (e) {
        $("li.active").removeClass("active");
        var myItem = $(this).parent().parent();
        myItem.addClass("active");
        var id = myItem.find("i.edit").attr("data-id");
        defaultSearchFilter.or.splice(0, defaultSearchFilter.or.length);
        defaultSearchFilter.or.push([{field: 'place_a', value: id, op: 'equal', type: 'string'}, {
            field: 'place_b',
            value: id,
            op: 'equal',
            type: 'string'
        }]);
        //主动调用刷新按钮
        mainGrid.set('parms', [{name: 'where', value: getSearchGridData(mainGrid, '', defaultSearchFilter)}]);
        mainGrid.changePage('first');
        mainGrid.loadData();
    })
});


var modifyAdd = false;
var diaLogBox = $("#loadDialog");
var allloadunload = new Map();
$('.vertical-list-add').hide();


//默认数据
var emptyData_load = {
    pk_id: '',
    fname: '',
    sname: '',
    code: '',
    address: '',
    region: '',
    modify_time: '',
    modify_psn: '',
    remark: '',
    link_man: '',
    mobile: ''
};
var failForm = $("#failForm");

//初始化主表
var loadForm = $("#loadForm");
var moresForm = $("#moresForm");
var form_load_unload, form_mores_unload;

$.ajax({
    url: rootPath + "/tms/bas/loadunload/loadAllData",
    dataType: 'json',
    type: 'post',
    data: '',
    success: function (result) {
        $('.vertical-list-add').show();
        for (var i = result.length - 1; i >= 0; i--) {
            var item = result[i];
            allloadunload.set(item.text, item);
        }
        showLoad(result);
    },
    error: function (result) {
        LG.tip('数据加载失败')
    }
});


function showLoad(data) {
    var formOption_loadunload = {
        fields: [
            {
                display: "简称",
                name: "sname",
                newline: false,
                labelWidth: 80,
                width: 140,
                space: 30,
                type: "select",
                cssClass: "field",
                attr: {
                    maxlength: 50
                },
                options: {
                    data: data,
                    valueField: 'sname',
                    textField: 'sname',
                    autocompleteKeyField: 'sname',
                    autocomplete: true,
                    cancelable: true,
                    highLight: true,
                    isTextBoxMode: true,
                    keySupport: true,
                    onSelected: function (newValue, newText, rowData) {
                        if (newValue == "" || !rowData) return;
                        var row = rowData;
                        liger.get("load_code").setValue(row.text);
                        liger.get("load_fname").setValue(row.fname);
                        liger.get("load_address").setValue(row.address);
                        liger.get("load_link_man").setValue(row.link_man);
                        liger.get("load_region_c").setValue(row.region);
                        // $("#load_pk_id").val(row.pk_id);
                        $("#load_remark").val(row.remark);
                        liger.get("load_mobile").setValue(row.mobile);
                        if (row.province) {
                            $("input[name=load_selectarea]").citypicker('reset');
                            $("input[name=load_selectarea]").citypicker('destroy');
                            $("input[name=load_selectarea]").citypicker({
                                province: row.province,
                                city: row.city,
                                district: row.area
                            });
                        } else {
                            $("input[name=load_selectarea]").citypicker('reset');
                        }
                    }
                }
            },
            {
                display: "代码",
                name: "code",
                newline: false,
                labelWidth: 80,
                width: 140,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    maxlength: 50
                },
                validate: {required: true}
            },
            {
                display: "全称",
                name: "fname",
                newline: true,
                labelWidth: 80,
                width: 300,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    maxlength: 50
                },
                validate: {required: true}
            },
            {
                display: "省市区",
                name: "selectarea",
                newline: true,
                labelWidth: 80,
                width: 300,
                space: 30,
                type: "text",
                cssClass: "field",
                validate: {required: true}
            },
            {
                display: "详细地址",
                name: "address",
                newline: true,
                labelWidth: 80,
                width: 452,
                space: 30,
                type: "text",
                cssClass: "field",
                attr: {
                    maxlength: 200
                },

                validate: {required: true}
            },
            {
                display: "报价区域",
                name: "region",
                newline: true,
                labelWidth: 80,
                width: 452,
                space: 30,
                type: "select",
                comboboxName: "region_c",
                cssClass: "field",
                attr: {
                    maxlength: 200
                },
                options: {
                    autocomplete: true,
                    cancelable: true,
                    highLight: true,
                    isTextBoxMode: true,
                    keySupport: true,
                    url: rootPath + '/tms/bas/transport/getRegions',
                    onBeforeOpen: function (){
                        this._setUrl(this.options.url);
                    }
                },
                validate: {required: true},
            },
            {
                display: "联系人",
                name: "link_man",
                newline: true,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                attr: {
                    maxlength: 100
                },
                cssClass: "field"
            },
            {
                display: "联系方式",
                name: "mobile",
                newline: false,
                labelWidth: 80,
                width: 170,
                space: 30,
                type: "text",
                attr: {
                    maxlength: 100
                },
                cssClass: "field"
            },
            {
                display: "备注",
                name: "remark",
                newline: true,
                labelWidth: 80,
                width: 452,
                space: 10,
                rows: 4,
                attr: {
                    maxlength: 200
                },
                type: "textarea"
            },
            {
                name: "pk_id",
                type: "hidden"
            }
        ],
        validate: true,
        toJSON: JSON2.stringify,
        prefixID: "load_"
    };

    var girdSelectId = [],
        girdSelectValue = '',
        girdSelectText = '';
    var formOption_moresload = {
        fields: [
            {
                display: "代码",
                name: "code",
                newline: true,
                labelWidth: 80,
                height: 120,
                width: 420,
                type: "taginput",
                cssClass: "field",
                validate: {required: true},
                delayLoadGrid: false,
                options: {
                    data: data,
                    valueField: 'text',
                    textField: 'sname',
                    autoFiler: 'sname',
                    renderItem: function (data) {
                        var item = data.data;
                        return item.sname + ' - ' + item.text;
                    },
                    onAdded: function (value, text, data) {
                        $('#mores_sname').val(this.getText());
                    },
                    onRemoved: function (value, text, data) {
                        $('#mores_sname').val(this.getText());
                    }
                }
            }, {
                display: "简称",
                name: "sname",
                newline: true,
                labelWidth: 80,
                width: 420,
                space: 30,
                type: "textarea",
                cssClass: "field bigheight",
                attr: {
                    readonly: "readonly"
                },
                validate: {required: true},
                editor: {
                    height: 260
                }
            }
            // {
            //     name: "pk_id",
            //     type: "hidden"
            // }
        ],
        validate: true,
        toJSON: JSON2.stringify,
        prefixID: "mores_"
    };
    form_load_unload = loadForm.ligerForm(formOption_loadunload);
    form_mores_unload = moresForm.ligerForm(formOption_moresload);
}


var isLoadShow = true;
var moresBut = $('.mores-box');
moresBut.on("click", function () {
    moresForm.toggleClass('action');
    loadForm.toggleClass('action');
    isLoadShow = !isLoadShow
});

//打开对话框
function openDialogL(data) {
    modifyAdd = false;
    //消除校验格式
    LG.clearValid(loadForm);

    //设置时间格式有问题
    form_load_unload.setData(data);
    if (data.pk_id) {
        moresBut.hide()
        moresForm.css('left', '110%');
    } else {
        moresBut.show();
    }
    $.ligerDialog.open(dialogOption_load);
}

//对话框
var dialogOption_load = {
    target: diaLogBox,
    title: '资料编辑--装卸单位',
    width: 650,
    height: 380,
    buttons: [
        {
            text: '确定',
            onclick: function (item, dialog) {
                var url = 'add',
                    data = {};

                if (isLoadShow) {
                    if (!form_load_unload.valid()) {
                        form_load_unload.showInvalid();
                        return;
                    }
                    var nData = form_load_unload.getData();
                    if (nData.pk_id && nData.pk_id != "") {
                        url = 'update';
                    }
                    data = $.extend({}, nData, {
                        create_time: diaLogBox.find("input[name=load_create_time]").val(),
                        modify_time: diaLogBox.find("input[name=load_modify_time]").val(),
                        client_id: client_id,
                        province: diaLogBox.find("span[data-count=province]").text(),
                        city: diaLogBox.find("span[data-count=city]").text(),
                        area: diaLogBox.find("span[data-count=district]").text()
                    });
                    loadunload(item, data, url, dialog)
                } else {
                    if (!form_mores_unload.valid()) {
                        form_mores_unload.showInvalid();
                        return;
                    }
                    var nData = form_mores_unload.getData();
                    data = $.extend({}, nData, {
                        client_id: client_id
                    });
                    form_mores_unload.setData({code: '', sname: ''});
                    addBatch(data, item, dialog);
                    // var nData = form_mores_unload.getData(),
                    //     textArray = nData.code.split(',');
                    // for(var i = textArray.length - 1; i >= 0; i--){
                    //     var mapName = textArray[i];
                    //      data = $.extend({}, allloadunload.get(mapName), {
                    //         client_id: client_id
                    //     });
                    //     loadunload(item,data,url,dialog)
                    // }
                }
            }
        },
        {
            text: '取消',
            onclick: function (item, dialog) {
                form_mores_unload.setData({code: '', sname: ''});
                dialog.hidden();
            }
        }
    ]
};

//导入失败对话框
var dialogOption_importFail = {
    target: $("#importFailDialog"),
    title: '导入失败',
    width: 500, height: 120,
    buttons: [
        {
            text: '查看详细',
            onclick: function (item, dialog) {
                failForm.submit();
            }
        },
        {
            text: '取消',
            onclick: function (item, dialog) {
                dialog.hidden();
            }
        }
    ]
};

var isFirst_load = true;

function loadunload(item, datax, url, dialog) {
    LG.singleAjax({
        url: rootPath + "/tms/bas/loadunload/" + url,
        data: JSON.stringify(datax),
        contentType: "application/json",
        success: function (data, msg) {
            LG.tip('保存成功!');
            dialog.hide();
            addEmpInfo([data], data.pk_id);
        },
        error: function (message) {
            LG.showError(message);
        }
    }, item);
}

function addBatch(datax, item, dialog) {
    LG.singleAjax({
        url: rootPath + "/tms/bas/loadunload/addBatch",
        data: JSON.stringify(datax),
        contentType: "application/json",
        success: function (data, msg) {
            var html = template('msgInfo', {
                msgList: data
            });
            var dom =  $("#loadList");
            dom.html(html);
            verticalList.setStatus();
            dom.find("li:first-child").click();
            isDeleteBtn && dom.find('.delete').hide();
            isEditBtn && dom.find('.edit').hide();
            LG.tip(msg);
            dialog.hide();
        },
        error: function (message) {
            LG.showError(message);
        }
    }, item);
}

function addEmpInfo(data, pid) {
    if ($("i[data-id='" + pid + "']").parent().parent().find(".top").length > 0) {
        //更新数据
        var html = template('empInfo', {msgList: data});
        var topInfo = $("i[data-id='" + pid + "']").parent().parent().find(".top");
        topInfo.html(html);
    } else {
        var html = template('msgInfo', {msgList: data});
        var dom = $('#loadList');
        dom.append(html);
        isDeleteBtn && dom.find('.delete').hide();
        isEditBtn && dom.find('.edit').hide();
        verticalList.setStatus();
    }
}

//新增弹出窗自定义方法
function defaultAction_add_load() {
    $("input[name=load_selectarea]").citypicker();
    $("input[name=load_selectarea]").citypicker('reset');
    InitAddress();
}

function InitAddress() {
    if (isFirst_load) {
        $('input[name="load_address"]').autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/tms/bas/location/search?data=" + encodeURIComponent($('input[name="load_address"]').val()) + "&region=" + encodeURIComponent($('span[data-count=city]').text()),
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataFilter: function (data) {
                        return data;
                    },
                    success: function (data) {
                        response($.map(data.data, function (item) {

                            return {
                                label: item.address,
                                value: item.address,
                                province: item.province,
                                city: item.city,
                                area: item.district
                            }
                        }))
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert(errorThrown);
                    },

                });
            },
            select: function (event, ui) {
                if ($('span[data-count=province]').text().length == 0) {
                    $("input[name=load_selectarea]").citypicker('reset');
                    $("input[name=load_selectarea]").citypicker('destroy');
                    $("input[name=load_selectarea]").citypicker({
                        province: ui.item.province,
                        city: ui.item.city,
                        district: ui.item.area
                    });
                }
            }
        });
    }
    isFirst_load = false;
}

function loadAllLoad() {
    $.ajax({
        type: 'post',
        url: rootPath + "/tms/bas/loadunload/loadData",
        data: {client_id: client_id},
        cache: false,
        dataType: "json",
        success: function (data) {
            var html = template('msgInfo', {msgList: data});
            var dom = $("#loadList");
            dom.html(html);
            isDeleteBtn && dom.find('.delete').hide();
            isEditBtn && dom.find('.edit').hide();
            verticalList.setStatus();
            dom.find("li:first-child").click();
        }
    });
}

function myLoadAdd() {
    //显示弹出窗
    openDialogL(emptyData_load);
    defaultAction_add_load();
}

function myLoadEdit(id) {
    InitAddress();
    $.ajax({
        type: 'post',
        url: rootPath + "/tms/bas/loadunload/loadDataById",
        data: {pk_id: id},
        cache: false,
        dataType: "json",
        success: function (data) {
            // form_load_unload.setData();
            openDialogL(data);
            // defaultAction_add_load();
            if (data.province) {
                $("input[name=load_selectarea]").citypicker('reset');
                $("input[name=load_selectarea]").citypicker('destroy');
                $("input[name=load_selectarea]").citypicker({
                    province: data.province,
                    city: data.city,
                    district: data.area
                });
            }
            else {
                $("input[name=load_selectarea]").citypicker('reset');
                $("input[name=load_selectarea]").citypicker('destroy');
            }
        }
    });
}

function myLoadDelete(id) {
    $.ligerDialog.confirm('确定删除吗?', function (confirm) {
        if (!confirm) return;
        LG.ajax({
            url: rootPath + "/tms/bas/loadunload/deleteById?id=" + id + "&mainId=" + client_id,
            contentType: "application/json",
            success: function (data, msg) {
                LG.tip('操作成功!');
                $("i[data-id='" + id + "']").parent().parent().parent().remove();
            },
            error: function (message) {
                LG.showError(message);
            }
        })
    })
}

$('body').on('keydown', '[name="sname"]', function (e) {
    if (e.keyCode == 13) {
        var dom = $(this).parents('li.l-fieldcontainer').next().find('.l-button');
        dom.click();
    }
});