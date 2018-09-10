var failForm = $("#failForm");
var $uploadDlg = $("#uploadDlg");
var uploadDlg;


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

function excelTmpl() {
    //Excel模板下载
    $("#download").attr("action", "/tms/busi/order/excelTmpl")
    xlsUtil.exp($("#download"), mainGrid, '运单导入模板' + DateUtil.dateToStr('yyyy-MM-dd') + '.xls', {pk_id: client_id, contract_id: contract_id});
}
function excelImport() {
    //Excel模板导入
    if (!uploadDlg) {
        uploadDlg = $.ligerDialog.open({
            target: $uploadDlg,
            title: '导入线路',
            width: 500, height: 120, // top: 450, left: 280, // 弹出窗口大小
            buttons: [
                {
                    text: '只追加', onclick: function () {
                    upload();
                }
                },
                {
                    text: '追加并覆盖', onclick: function () {
                    upload(true);
                }
                },
                {
                    text: '取消', onclick: function () {
                    uploadDlg.hide();
                }
                }
            ]
        });
    } else {
        uploadDlg.show();
    }

    /**
     *
     * @param cover 是否覆盖旧记录
     * @returns {boolean}
     */
    function upload(cover) {
        // 上传文件
        var filepath = $("#fileupload").val();
        // debugger;
        if (filepath == "") {
            LG.showError("请选择上传文件");
            return false;
        } else {
            var stuff = filepath.match(/^(.*)(\.)(.{1,8})$/)[3];
            var type = "xls,xlsx";
            if (type.indexOf(stuff) < 0) {
                LG.showError('文件类型不正确,只能上传xls或xlsx');
                return;
            }
        }
        var url = basePath + 'excelImport';

        uploadDlg.hide();
        LG.showLoading('正在上传中...');

        var formData = new FormData();
        var uform = $("#uploadForm");

        var meta = {'报价': 'amount'};
        for (var i = 0; i < myEditFileds.length; i++) {
            var prop = myEditFileds[i].related_prop.toLowerCase();
            var prop_name = prop + "_name";
            var display = $.grep(gridOption.columns, function (item) {
                return item.name == prop_name;
            })[0].display;
            meta[display] = prop;
        }

        formData.append('excel',
            JSON2.stringify({
                pk_id: contract_id + "#" + client_id, //业务主键
                name: 'fileupload', //上传控件名称
                cover: cover || false, //是否覆盖
                meta: meta
            })
        );

        //选中的文件
        uform.find('input[type=file]').each(function (i, item) {
            var field_name = $(this).attr('name');
            var files = item.files;
            if (files && files.length > 0) {
                for (var f = 0; f < files.length; f++) {
                    formData.append(field_name, files[f]);
                }
            }
        });

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (result) {
                if (result.error) {
                    var op = $.extend({}, dialogOption_importFail, {content: result.message});
                    LG.hideLoading();
                    //显示查看详细的按钮
                    if (result.data) {
                        $("#failForm").attr("action", result.data);
                        $.ligerDialog.open(op);
                    } else {
                        LG.showError(result.message);
                    }
                } else {
                    LG.hideLoading();
                    LG.tip(result.message);
                    mainGrid.reload();
                }
            },
            error: function (message) {
            }
        });
    }
}