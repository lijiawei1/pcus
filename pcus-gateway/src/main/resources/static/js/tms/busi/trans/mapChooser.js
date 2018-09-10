var mapWin;
function openMapWin() {
    if (mapWin) {
        mapWin.show();
        return;
    }

    // mapWin = $.ligerDialog.open({
    //     title: '选取车辆',
    // })

    mapWin = $.ligerDialog.open({
        url: '/tms/busi/trans/loadMapChooser',
        height: 480,
        width: 320,
        buttons: [{
            text: '确定', onclick: function (item, dialog) {
                alert(item.text);
            }
        }, {
            text: '取消', onclick: function (item, dialog) {
                dialog.close();
            }
        }]
    });


}