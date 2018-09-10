/**
 * Created by wujian on 2017/2/6.
 */
$(function () {
    var basePath = "/tms/report/";

    var layout,
        mainTree,
        mainTab;

    var $mainTree = $("#mainTree");


    //初始化界面
    layout = $("#layout").ligerLayout({
        leftWidth: 220,
        height: '100%',
        space: 1,
        heightDiff: 0,
        centerBottomHeight: 200,
        onHeightChanged: function (e) {
        }
    });

    //生成页签
    mainTab = $("#mainTab").ligerTab({
        width: '100%',
        height: '100%',
        heightDiff: 0,
        showSwitchInTab : true,
        showSwitch : true,
        autoMove: true,
        changeHeightOnResize: true,
        onAfterSelectTabItem: selectTabItem
    });

    //生成树
    mainTree = $mainTree.ligerTree({
        data: [
            //节点一
            {
                'text': '调度',
                'id': 'scheduling',
                'pid': null,
                'url': ''
            }, {
                'text': '单日调度车次',
                'id': 'D_dispatch',
                'pid': 'scheduling',
                'url': basePath + 'trans/dayCarsQuery'
            }, {
                'text': '单日外派车次',
                'id': 'D_send',
                'pid': 'scheduling',
                'url': basePath + 'trans/dayOuterCarsQuery'
            }, {
                'text': '单日改派车次',
                'id': 'D_change',
                'pid': 'scheduling',
                'url': basePath + 'trans/dayChangedCarsQuery'
            }, {
                'text': '单日车辆产值表',
                'id': 'D_p_value',
                'pid': 'scheduling',
                'url': basePath + 'trans/dayCarOutputQuery'
            }, {
                'text': '车辆资源表',
                'id': 'D_resource',
                'pid': 'scheduling',
                'url': basePath + 'trans/carResourceQuery/'
            }, {
                'text': '统计',
                'id': 'statistics',
                'pid': null,
                'url': ''
            }, {
                'text': '操作点检表',
                'id': 'OQ_op_table',
                'pid': 'statistics',
                'url': basePath + 'trans/billOperQuery'
            }, {
                'text': '操作单量',
                'id': 'OQ_op',
                'pid': 'statistics',
                'url': basePath + 'trans/orderOperQuery'
            }, {
                'text': '调度单量',
                'id': 'OQ_dispatch',
                'pid': 'statistics',
                'url': basePath + 'trans/transOperQuery'
            }, {
                'text': '柜型统计',
                'id': 'OQ_container',
                'pid': 'statistics',
                'url': basePath + 'trans/cntrTypeQuery'
            }, {
                'text': '司机',
                'id': 'driver',
                'pid': null,
                'url': ''
            }, {
                'text': "司机APP使用KPI",
                'id': "driverAppKpiQuery",
                'pid': "driver",
                'url': basePath + "sys/driverAppKpiQuery"
            }, {
                'text': "司机APP使用情况",
                'id': "driverAppLogQuery",
                'pid': "driver",
                'url': basePath + "sys/driverAppLogQuery"
            }, {
                'text': '单车产值统计',
                'id': '',
                'pid': 'driver',
                'url': '404'
            }, {
                'text': "里程报表",
                'id': "mileageReport",
                'pid': 'driver',
                'url': basePath + "settle/mileageQuery"
            }, {
                'text': '客服',
                'id': 'service',
                'pid': null,
                'url': ''
            }, {
                'text': '单日作业情况',
                'id': 'CS_day_work',
                'pid': 'service',
                'url': '404'
            }, {
                'text': '运输业务点检表',
                'id': 'CS_op_table',
                'pid': 'service',
                'url': '404'
            }, {
                'text': '运输业务费用统计表',
                'id': 'CS_fee',
                'pid': 'service',
                'url': '404'
            }, {
                'text': '准点率统计表',
                'id': 'CS_on_time',
                'pid': 'service',
                'url': '404'
            }, {
                'text': '用户操作分析',
                'id': 'operationalAnalysis',
                'pid': null,
                'url': ''
            }, {
                'text': "用户在线统计",
                'id': "userOnlineQuery",
                'pid': "operationalAnalysis",
                'url': basePath + 'sys/userOnlineQuery'
            }, {
                'text': "用户操作日志",
                'id': "userOperLogQuery",
                'pid': "operationalAnalysis",
                'url': basePath + 'sys/userOperQuery'
            }, {
                'text': "用户修改数据统计",
                'id': "userDelayLogQuery",
                'pid': "operationalAnalysis",
                'url': basePath + 'sys/userEditQuery'
            }, {
                'text': "录单延时数据",
                'id': "userDelayQuery",
                'pid': "operationalAnalysis",
                'url': basePath + 'sys/driverAppLogQuery'
            }
        ],
        nodeWidth: 200,
        idFieldName: 'id',
        textFieldName: 'text',
        parentIDFieldName: 'pid',
        slide: true,
        checkbox: false,
        isExpand: 2,
        needCancel: false,
        btnClickToToggleOnly: false,
        onSelect: selectTreeNode
    });

    //缓存所有的可选择节点
    var $mainTreeItem = $mainTree.find(".l-body");

    //选择树节点时，打开新页签
    function selectTreeNode(e) {
        var data = e.data;
        if(data.url){
            mainTab.addTabItem({
                tabid : data.id,
                text : data.text,
                url : data.url
            });
        }
    }

    //选择页签时，更新树的选择状态（请勿触发点击事件，否则引发循环）
    function selectTabItem(tabid) {
        $mainTreeItem.filter(".l-selected").removeClass("l-selected");
        if(tabid) {
            $("#" + tabid).children(".l-body").addClass("l-selected");
        }
    }
});