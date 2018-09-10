var trans_code = '';
$(function () {
    //加载照片列表
    loadAllImg(trans_id, '');
    var html = template('searchInfo', {msgList: trans});
    $(".quick-search").html(html);
});


function loadAllImg(trans_id, trans_code) {
    $.ajax({
        type: 'get',
        url: rootPath + "/tms/busi/orderAudit/getTransImg?trans_id=" + trans_id + "&trans_code=" + trans_code,
        cache: false,
        dataType: "json",
        success: function (data) {
            var html = template('msgInfo', {msgList: data});
            $("#loadList").html(html);
            verticalList.setStatus();
            $("#loadList").find("li:first-child").click();
        }
    });
}

$("#loadList").on("click", "li.item", function () {
    $("li.item.active").removeClass("active");
    $(this).addClass("active");
    imgCheck.reset($(this).find("img").attr("src"));
});

//点击快捷搜索
function changeLoad(trans_code) {
    imgCheck.reset("");
    loadAllImg(trans_id, trans_code);
}

function quickQuery(obj) {
    $("a.qs-item.visited").removeClass("visited");
    $(obj).addClass("visited");
    trans_code = $(obj).attr("data-action");
    //定位form位置
    var text = $(obj).text();
    var allGroup = $(".l-group");
    if (text.indexOf("柜") >= 0) {
        for (var i = 0; i < allGroup.length; i++) {
            if ($(allGroup[i]).find("span").text() == "柜信息") {
                changePosition($(allGroup[i]));
                break;
            }
        }
    }
    if (text.indexOf("装") >= 0) {
        for (var i = 0; i < allGroup.length; i++) {
            if ($(allGroup[i]).find("span").text() == "装货单位信息") {
                changePosition($(allGroup[i]));
                break;
            }
        }
    }
    if (text.indexOf("卸") >= 0) {
        for (var i = 0; i < allGroup.length; i++) {
            if ($(allGroup[i]).find("span").text() == "卸货单位信息") {
                changePosition($(allGroup[i]));
                break;
            }
        }
    }
    changeLoad(trans_code);

}
function changePosition(obj) {
    var height = obj.offset().top - $(".form-wrapper-inner").offset().top + $(".form-wrapper-inner").scrollTop();
    $(".form-wrapper-inner").scrollTop(height);
}


function myLoadAdd() {
    if (trans_code == '') {
        LG.showError("请选择上传图片相关的节点。");
        return;
    }
    $("#uploadFileInput").click();
}

$("#uploadDiv").on("change", function () {
    $.ajaxFileUpload({
            url: rootPath + "/tms/busi/orderAudit/uploadFile?trans_id=" + trans_id + "&trans_code=" + trans_code,             //需要链接到服务器地址
            secureuri: false,
            fileElementId: 'uploadFileInput',                         //文件选择框的id属性
            dataType: 'json', //服务器返回的格式，可以是json
            success: function (data, status)             //相当于java中try语句块的用法
            {
                if (data.error) {
                    LG.showError(data.message);
                }
                else {
                    var list = [];
                    var result = data.data;
                    var oldCount = $("#loadList").children("li").length + 1;
                    result.file_name = $("a.qs-item.visited").text() + "" + oldCount + "." + result.suffix;
                    list.push(result);
                    var html = template('msgInfo', {msgList: list});
                    $("#loadList").append(html);
                    verticalList.setStatus();
                }
            },
            error: function (data, status, e)             //相当于java中catch语句块的用法
            {
                alert("服务器异常");
            }
        }
    );
});


function deleteImg(id) {
    $.ligerDialog.confirm('是否确认删除图片', function (yes) {
        if (yes) {
            LG.ajax({
                url: rootPath + "/tms/busi/orderAudit/deleteFile?id=" + id,
                success: function (data, msg) {
                    LG.tip('删除成功!');
                    //移除图片
                    $("li[data-id='" + id + "']").remove();
                    verticalList.setStatus();
                },
                error: function (message) {
                    LG.showError(message);
                }
            })
        }
    });
}