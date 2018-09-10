(function () {

    //上下文路径
    var basePath = rootPath + '/tvs/gps/';

    //模板引擎设置
    // template.config('cache', false);

    //右侧树高度偏移
    var TREE_WRAPPER_DIFF = 30;
    //页签界面默认高度
    var TAB_WRAPPER_HEIGHT;
    //表格外部默认高度
    var GRID_WRAPPER_HEIGHT;

    // 自动刷新时间;
    var loadTvsDataTime = null;

    if (document.documentElement.clientHeight < 600) {
        TAB_WRAPPER_HEIGHT = 250;
        GRID_WRAPPER_HEIGHT = 222;
    }
    else {
        TAB_WRAPPER_HEIGHT = 300;
        GRID_WRAPPER_HEIGHT = 272;
    }

    //定位数据状态
    var STATUS = {
        NORMAL: 0, //默认状态
        RUNNING: 1, //运行
        PARKING: 2, //停车
        WARNING: 3, //报警
        ABNORMAL: 4 //异常
    };

    var $layoutCenter = $("#layout-center"), //布局中部
        $mainTab = $("#monitTab"), //页签
        $tabAllQty, //全部数量
        $tabRunningQty, //运行数量
        $tabParkingQty, //停车数量
        $tabWarningQty, //报警数量
        $tabAbnormalQty, //异常数量
        $mainTreeWrapper = $("#mainTreeWrapper"), //树外部
        $mapWrapper = $("#mapWrapper"), //地图外部
        $tabWrapper = $(".tabPanelWrapper"), //标签外部
        $gridWrapper = $(".gridWrapper"), //表格外部
        $mainGrid = $("#mainGrid"),
        $runningGrid = $("#runningGrid"),
        $parkingGrid = $("#parkingGrid"),
        $warningGrid = $("#warningGrid"),
        $abnormalGrid = $("#abnormalGrid"),
        $centerWrapper = $('#centerWrapper');

    //页面控件
    var layout,
        mainMap,
        mainTree,
        mainTab,
        mainGrid,
        runningGrid,
        parkingGrid,
        warningGrid,
        abnormalGrid,
        grids = {};

    //
    var timer, //定时器
        active; //当前页面是否活动

    //初始化表格选项
    var gridOption = {
        columns: [
            {
                display: '车牌', name: 'Vehicle', align: 'left', minWidth: 60, width: 100, align: 'center',
                render: render('Vehicle')
            },
            {
                display: '定位时间', name: 'GPSTime', minWidth: 60, width: 130, align: 'right',
                render: render('GPSTime')
            },
            {
                display: '里程(km)', name: 'Odometer', minWidth: 60, width: 90, align: 'right',
                render: render('Odometer')
            },
            {
                display: '速度(km/h)', name: 'Speed', minWidth: 60, width: 90, align: 'right',
                render: render('Speed')
            },
            {
                display: '车辆状态', name: 'Status', minWidth: 60, width: 240,
                render: render('Status')
            },
            {
                display: '报警状态', name: 'none', minWidth: 60, width: 180,
                render: render('none')
            },
            {
                display: '地标', name: 'AreaName', minWidth: 60, width: 120,
                render: render('AreaName')
            },
            {
                display: '道路', name: 'RoadName', minWidth: 60, width: 180,
                render: render('RoadName')
            },
            {
                display: '位置', name: 'postion', minWidth: 60, width: 240,
                render: render(['Provice', 'City', 'District'])
            },
            {
                display: '异常信息', name: 'ExStatus', minWidth: 60, width: 240,
                render: render('ExStatus')
            }

        ],
        pageSize: 100,
        // url: basePath + 'loadPageRoles',
        // data: { "Rows": []},
        delayLoad: true,		//初始化不加载数据
        checkbox: true,
        width: '100%',
        isSingleCheck:true,
        height: '100%',
        heightDiff: -15,
        // height: GRID_WRAPPER_HEIGHT,
        dataAction: 'local',
        usePager: false,
        enabledEdit: false,
        clickToEdit: false,
        fixedCellHeight: true,
        rowHeight: 30,
        headerRowHeight: 28,
        rownumbers: true,
        // selectRowButtonOnly: true,
        onDblClickRow: function (data, row, element) {
            dataRender.locate(row);
            this.select(row);
        },
        onCheckRow: function (data, row, element) {
            dataRender.locate(row);
            return true;
        },
        onUnSelectRow: function (data,id,obj) {
            dataRender.locate(row);
        }
    };

    //初始化界面
    layout = $("#layout").ligerLayout({
//        leftWidth: 200,
        topHeight: 40,
        leftWidth: 220,
        height: '100%',
        space: 0,
        heightDiff: 0,
        allowRightResize: false,
        allowTopResize: false,
        onHeightChanged: function (e) {
            //修正选择树的高度
            $mainTreeWrapper.height(e.layoutHeight - TREE_WRAPPER_DIFF * 2);
            statusMgr.resize(e.middleHeight);
            $mainTreeWrapper.height(e.layoutHeight - TREE_WRAPPER_DIFF * 2);
        }
    });

    //调整左侧选择树的高度
    $mainTreeWrapper.height($mainTreeWrapper.height() - TREE_WRAPPER_DIFF);

    //初始化人员树
    mainTree = $("#mainTree").ligerTree({
        url: '/pages/tvs/data/monitTree.json',
        //data: corpdata,
        nodeWidth: 200,
        idFieldName: 'ID',
        textFieldName: 'Name',
        parentIDFieldName: 'pID',
        slide: true,
        checkbox: true,
        checkWhileSelect: true,
        isExpand: 2,
        singleOpen: true,
        selectable: function () {
            return false;
        },
        onSelect: function onSelect(node) {
//            cm.setData(node.data);
//            mainform.setData(emptydata);
//            mainform.setData(node.data);
//            $('#mainform').find('input[name="old_account"]').val(node.data.account);

//            roleGrid.setParm('id', node.data.id);
//            roleGrid.reload();
        },
        onSuccess: function (data) {
//            var obj = cm.getData();
//            if (obj && obj.id) {
//                mainTree.selectNode(obj.id)
//            }
        }
    });


    //初始化标签页
    mainTab = $("#monitTab").ligerTab({
        height: '100%',
        //width: '100%'
        //heightDiff: -29
        onAfterSelectTabItem: function (tabid) {
            // log(tabid)
            //设置当前选中的页签tabid
            dataRender.setTabid(tabid);
            switch (tabid) {
                case 'mainGridTab':
                    runningGrid = $runningGrid.ligerGrid(gridOption);
                    statusMgr.refresh();
                    break;
                case 'runningGridTab':
                    runningGrid = $runningGrid.ligerGrid(gridOption);
                    statusMgr.refresh();
                    break;
                case 'parkingGridTab':
                    parkingGrid = $parkingGrid.ligerGrid(gridOption);
                    statusMgr.refresh();
                    break;
                case 'warningGridTab':
                    warningGrid = $warningGrid.ligerGrid(gridOption);
                    statusMgr.refresh();
                    break;
                case 'abnormalGridTab':
                    abnormalGrid = $abnormalGrid.ligerGrid(gridOption);
                    statusMgr.refresh();
                    break;
            }

        },
    });

    //初始化工具栏
    var toptoolbar = $("#toptoolbar").ligerToolBar({
        items: [
            {id: 'start', text: '启动监控', click: btnClick, icon: 'start', status: ['OP_INIT']},
            {id: 'stop', text: '停止监控', click: btnClick, icon: 'stop', status: ['OP_INIT']},
            {id: 'setting', text: '监控设置', click: btnClick, icon: 'monitorsettings', status: ['OP_INIT']},
            {id: 'loadData', text: '加载数据', click: btnClick, icon: 'loading', status: ['OP_INIT']},
            {id: 'refresh', text: '刷新', click: btnClick, icon: 'refresh', status: ['OP_INIT']},
            {id: 'fix', text: '适应', click: btnClick, icon: 'suit', status: ['OP_INIT']},
            {id: 'max', text: '最大化', click: btnClick, icon: 'maximizing', status: ['OP_INIT']},
            {id: 'min', text: '最小化', click: btnClick, icon: 'minimize', status: ['OP_INIT']},
            {id: 'track', text: '显示轨迹', click: btnClick, icon: 'displaytrack', status: ['OP_INIT']},
            {id: 'veh', text: '显示车辆地图', click: btnClick, icon: 'displayvehiclemap', status: ['OP_INIT']},
        ]
    });

    //初始化隐藏停止监控
    $("div[toolbarid=stop]").css("display", "none");

    //初始化地图
    mainMap = (function () {
        var x = 113.4;
        var y = 22.06;
        var ggPoint = new BMap.Point(x, y);
        //地图初始化
        var bm = new BMap.Map("allmap");
        bm.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
        // bm.centerAndZoom(ggPoint, 15);
        bm.addControl(new BMap.NavigationControl());

        bm.centerAndZoom(ggPoint, 12);
        bm.setCurrentCity("珠海");
        return bm;
    })();

    var timeout = false; //启动及关闭按钮
    function loadTvsData(type) {
        if (timeout) return;
        if (active) {
            //当前是互动界面
            dataRender.refreshData(type || 'loadTvsData');
        }
        loadTvsDataTime = window.setTimeout(loadTvsData, 20000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
    }

    function btnClick(item) {
        switch (item.id) {
            case 'start':
                //启动定时器
                timeout = false;
                if (loadTvsDataTime) {
                    window.clearTimeout(loadTvsDataTime);
                }
                loadTvsData('loadData');

                $("div[toolbarid=start]").css("display", "none");
                $("div[toolbarid=stop]").css("display", "");
                break;
            case 'stop':
                //清除定时器
                timeout = true;
                $("div[toolbarid=start]").css("display", "");
                $("div[toolbarid=stop]").css("display", "none");
                break;
            case 'setting':

                break;
            case 'loadData':
                dataRender.refreshData('loadData');
                break;
            case 'refresh':
                LG.ajax({
                    url: basePath + 'refresh',
                    data: {},
                    success: function (data, message, code) {},
                    error: function () {}
                });
                break;
            case 'fix':
                statusMgr.fix();
                break;
            case 'max':
                statusMgr.max();
                break;
            case 'min':
                //最小化
                statusMgr.min();
                break;
            case 'track':
                LG.ajax({
                    url: basePath + 'playTrack',
                    data: {
                        vehicle: '粤C16352',
                        btime: '2016-06-27 00:00:00',
                        etime: '2016-06-27 23:59:59'
                    },
                    success: function (data, message, code) {
                        window.open(data, 'newwindow', 'height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
                    },
                    error: function () {

                    }
                });
            case 'veh':
                LG.ajax({
                    url: basePath + 'vehicleMap',
                    data: {
                        vehicle: '粤C16352',
                    },
                    success: function (data, message, code) {
                        window.open(data, 'newwindow', 'height=600,width=800,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
                    },
                    error: function () {

                    }
                });
            default:
                break;
        }
    }

    //上一次双击选中的数据
    var oldSelectData = null;
    /**
     * 数据展现管理器
     * @type {{grids, gridOptions, tabid, setTabid, getGrid, initGrid}}
     */
    var dataRender = (function (grids, mainTree, gridOption, mp) {
        return {
            //车辆树控件
            tree: mainTree,
            //表格控件
            grids: grids,
            //信息框
            infoWins: {},
            //表格控件选项
            gridOptions: gridOption || {},
            //页签主键，默认主页签
            tabid: 'mainGridTab',
            //地图控件
            map: mp,
            //保存加载的GPS数据
            data: {},
            //跟踪的车牌号
            trail: '',

            /**
             * 设置当前页签主键
             * @param id 页签主键
             */
            setTabid: function (id) {
                var g = this;
                g.tabid = id;
            },

            /**
             * 展现地图点
             */
            renderMap: function (type) {
                var g = this;

                //获取GPS定位点
                var points = $.map(g.data.mainGrid.Rows, function (item) {
                    return new BMap.Point(item.bdLon, item.bdLat);
                });
                function translateCallback(data) {
                    // log(data);
                    if (data.status === 0) {
                        //清除上次定位的数据
                        g.map.clearOverlays();

                        if (type === 'loadData'){
                            if (data.points.length > 3) {
                                var city = mostCity(data.points);
                                g.map.centerAndZoom(city, 10);
                            } else {
                                g.map.centerAndZoom(data.points[0], 10);
                            }
                        }

                        for (var i = 0, length = data.points.length; i < length; i++) {
                            var row = g.data.mainGrid.Rows[i];
                            // 有牌子
                            var item = data.points[i];
                            var marker = new BMap.Marker(item);
                            // if (row.TransData && row.TransData.state_name){
                            //     var iconUrl = null;
                            //     switch (row.TransData.state_name) {
                            //         case '已回单': iconUrl = 'http://127.0.0.2:8090/images/tvs/gray.png'; break;
                            //         case '新计划': iconUrl = 'http://127.0.0.2:8090/images/tvs/cyan.png'; break;
                            //         case '调度中': iconUrl = 'http://127.0.0.2:8090/images/tvs/orange.png'; break;
                            //         case '运输中': iconUrl = 'http://127.0.0.2:8090/images/tvs/pink.png'; break;
                            //         case '已拒绝': iconUrl = 'http://127.0.0.2:8090/images/tvs/purple.png'; break;
                            //         case '已中止': iconUrl = 'http://127.0.0.2:8090/images/tvs/yellow.png'; break;
                            //     }
                            //     var icon = new BMap.Icon();
                            //     icon.setImageUrl(iconUrl);
                            //     // icon.setSize( new BMap.Size(19, 25));
                            //     marker.setIcon(icon);
                            // }
                            if (type === 'loadTvsData'){
                                var label = new BMap.Label(row.Vehicle + ' ' + row.GPSTime.substring(11) + ' ' + row.Speed + 'km/h', {offset: new BMap.Size(20, -10)});
                                marker.setLabel(label);// log(g.trail + "===" + row.Vehicle);
                                if (g.trail && g.trail === row.Vehicle) {
                                    // log('回调后定位：' + g.trail);
                                    g.map.centerAndZoom(data.points[i], 15);
                                }
                                //更新选中
                                if (!oldSelectData || row.Vehicle == oldSelectData.Vehicle) {
                                    oldSelectData = $.extend({}, row);
                                    g.grids.mainGrid.select(g.grids.mainGrid.rows[i].__id);
                                }
                            }
                            g.map.addOverlay(marker);
                            addClickHandler(marker, row);
                        }
                        if (oldSelectData != null) {
                            dataRender.locate(oldSelectData);
                        }
                    } else {
                        log('定位失败：' + data.status);
                    }
                }

                function addClickHandler(marker, row) {
                    marker.addEventListener("click", function (e) {
                        openInfo(e, row);
                    });
                }

                function openInfo(e, row) {
                    var p = e.target;
                    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                    g.openInfoWin(row, point)

                }

                function mostCity(){
                    var data = g.data.mainGrid.Rows,
                        array = [];
                    for (var i = data.length - 1; i >= 0;i--){
                        var item = data[i];
                        array.push(item.City);
                    }
                    var obj = array.reduce(function (p, n) {
                        return (p[n]++ || (p[n] = 1),(p.max=p.max>=p[n]?p.max:p[n]),(p.key=p.max>p[n]?p.key:n),p);
                    }, {});
                    return obj.key;
                }

                translateCallback({
                    status: 0,
                    points: points
                });
                //
                // setTimeout(function () {
                //     var convertor = new BMap.Convertor();
                //     convertor.translate(points, 1, 5, translateCallback);
                // }, 1000);
            },

            /**
             * 打开定位信息窗口
             * @param data
             * @param point
             */
            openInfoWin: function (data, point) {
                var title = (data.TransData && data.TransData.bill_no) || data.Vehicle;
                if (!title) {
                    console.error("数据结构错误!");
                    return
                }
                var g = this;
                //创建信息窗口对象
                var infoWindow;
                var html = template('markerInfo', data);
                if (!g.infoWins[title]) {
                    g.infoWins[title] = new BMap.InfoWindow(html, {
                        width: 300,     // 信息窗口宽度
                        height: 200,     // 信息窗口高度
                        title: title, // 信息窗口标题
                        enableMessage: false//设置允许信息窗发送短息
                    });
                }
                infoWindow = g.infoWins[title];
                infoWindow.setContent(html);
                g.map.openInfoWindow(infoWindow, point); //开启信息窗口
            },

            /**
             * 跳转到定位点并显示信息
             * 如果开启了监控，将会跟踪此节点
             * @param data
             */
            locate: function (data) {
                oldSelectData = data;
                var g = this;
                var point = new BMap.Point(data.bdLon, data.bdLat);

                //记录跟踪的车辆
                g.trail = data.Vehicle;
                g.openInfoWin(data, point);
            },

            /**
             * 展现数据到表格
             *
             * @param tabid 页签主键
             * @returns {*}
             */
            renderGrid: function (tabid) {
                var g = this;
                g.tabid = tabid || g.tabid;

                switch (g.tabid) {
                    case 'mainGridTab':
                        if (!grids.mainGrid) {
                            //初始化表格
                            grids.mainGrid = $mainGrid.ligerGrid(g.gridOptions);
                            $mainGrid.find('.l-grid-hd-cell-btn-checkbox').hide();
                        }
                        //加载数据
                        grids.mainGrid.loadData(g.data.mainGrid || []);
                        return grids.mainGrid;
                    case 'runningGridTab':
                        if (!grids.runningGrid) {
                            //初始化表格
                            grids.runningGrid = $runningGrid.ligerGrid(g.gridOptions);
                            $runningGrid.find('.l-grid-hd-cell-btn-checkbox').hide();
                        }
                        grids.runningGrid.loadData(g.data.runningGrid || []);
                        return grids.runningGrid;
                    case 'parkingGridTab':
                        if (!grids.parkingGrid) {
                            grids.parkingGrid = $parkingGrid.ligerGrid(g.gridOptions);
                            $parkingGrid.find('.l-grid-hd-cell-btn-checkbox').hide();
                        }
                        grids.parkingGrid.loadData(g.data.parkingGrid || []);
                        return grids.parkingGrid;
                    case 'warningGridTab':
                        if (!grids.warningGrid) {
                            grids.warningGrid = $warningGrid.ligerGrid(g.gridOptions);
                            $warningGrid.find('.l-grid-hd-cell-btn-checkbox').hide();
                        }
                        grids.warningGrid.loadData(g.data.warningGrid || []);
                        return grids.warningGrid;
                    case 'abnormalGridTab':
                        if (!grids.abnormalGrid) {
                            grids.abnormalGrid = $abnormalGrid.ligerGrid(g.gridOptions);
                            $abnormalGrid.find('.l-grid-hd-cell-btn-checkbox').hide();
                        }
                        grids.abnormalGrid.loadData(g.data.abnormalGrid || []);
                        return grids.abnormalGrid;
                }
            }
            ,
            /**
             * 刷新数据
             * @param data
             */
            refreshData: function (type) {
                var g = this;

                //获取选中的节点
                var checked = getCheckedLeafNode.call(g.tree);

                if (checked && checked.length > 0) {
                    //获取选中的车牌号
                    var truckNos = $.map(checked, function (item) {
                        if (item.data.Type != 0)
                            return item.data.Name;
                        else
                            return null;
                    }).join(',');
                    //请求接口获取监控数据
                    LG.ajax({
                        url: basePath + 'vehcileInfo',
                        // url: '/pages/tvs/data/trucksList.json',
                        data: {
                            vehicle: truckNos
                        },
                        success: function (data, message, code) {
                            if (data != null) {
                                //加载到表格中
                                dataRender.setData(data);
                                //渲染到地图上
                                dataRender.renderMap(type);
                            }

                        },
                        error: function (message, code) {
                            LG.showError('车辆定位信息获取失败:' + message);
                        }
                    })
                }

                function getCheckedLeafNode() {
                    var g = this, p = this.options;
                    if (!p.checkbox) return null;
                    var nodes = [];
                    $(".l-checkbox-checked", g.tree).each(function (index,itme){
                        var $this = $(this).parents('li').eq(0);
                        var treedataindex = parseInt($this.attr("treedataindex"));
                        // if($this.children(".l-children").length) return; //忽略非叶子节点
                        nodes.push({ target: this, data: g._getDataNodeByTreeDataIndex(g.data, treedataindex) });
                    });
                    return nodes;
                }
            },

            /**
             * 设置列表数据
             * @param data 获取到的列表数据
             */
            setData: function (data) {
                var g = this;
                g.data = {};
                //先获取表格里的数据 然后进行比对 如果有则更新 没有则新增
                //TODO:可以优化成直接修改grid的数据 不要重新加载数据
                var copyData = data;
                // var olddata = grids.mainGrid.getData("nochanged", true);
                // var copyData = olddata;
                // for (var i = 0; i < data.length; i++) {
                //     var contains = false;
                //     for (var j = 0; j < olddata.length; j++) {
                //         if (data[i].Vehicle == olddata[j].Vehicle) {
                //             contains = true;
                //             copyData[j] = data[i];
                //             break;
                //         }
                //     }
                //     if (!contains) {
                //         //加载新数据
                //         copyData.push(data[i]);
                //     }
                // }
                var runningGridData = [],
                    parkingGridData = [],
                    abnormalGridData = [],
                    warningGridData = [];

                $.each(copyData, function (i, v) {

                    v.StatusCode = STATUS.NORMAL; //默认状态

                    if (v.Speed && v.Speed >= 0 && v.Status.indexOf('停车') == -1) {
                        v.StatusCode = STATUS.RUNNING;
                        runningGridData.push(v);
                    } else {
                        //如何判断剩下的状态
                        //判断停车状态
                        if (v.Status && v.Status.indexOf('停车') != -1) {
                            v.StatusCode = STATUS.PARKING;
                            parkingGridData.push(v);
                        }

                        var gpsTime = DateUtil.strToDate(v.GPSTime);
                        var dateDiff = DateUtil.dateDiff('n', gpsTime, new Date());
                        if (dateDiff > 90) {
                            //掉线异常
                            v.StatusCode = STATUS.ABNORMAL;
                            v.ExStatus = '掉线异常';
                            abnormalGridData.push(v);
                        }

                        //判断报警状态
                    }
                });

                g.data.mainGrid = {"Rows": copyData};
                g.data.runningGrid = {"Rows": runningGridData};
                g.data.parkingGrid = {"Rows": parkingGridData};
                g.data.abnormalGrid = {"Rows": abnormalGridData};
                g.data.warningGrid = {"Rows": warningGridData};

                //加载显示数量
                $tabAllQty.text(copyData.length);
                $tabRunningQty.text(runningGridData.length);
                $tabParkingQty.text(parkingGridData.length);
                $tabWarningQty.text(warningGridData.length);
                $tabAbnormalQty.text(abnormalGridData.length);

                //初始化主界面
                g.renderGrid();
            },
        }
    })(grids, mainTree, gridOption, mainMap);

    /**
     * 界面自适应调整
     * @type {{resize, min, max, fix, auto}}
     * @param [
     *      $mapWrapper : 地图
     *      $tabWrapper : 选项卡
     *      $gridWrapper : 表格
     *      mainTab : tab 插件
     *      gm : 百度跟踪插件
     *      hh : 展示高度
     *      TWH : 页签界面默认高度
     *      GWH : 表格外部默认高度
     * ]
     */
    var statusMgr = (function ($mapWrapper, $tabWrapper, $gridWrapper, mainTab, gm, hh, TWH, GWH) {
        var ST = {
            MIN: 'min',
            MAX: 'max',
            FIX: 'fix',
            AUTO: 'auto'
        };
        var TAB_DIFF = 27;
        var DIFF = 60;
        /*工具条和容器内边距等*/
        return {
            status: ST.FIX,
            lch: hh,
            refresh: function () {
                var g = this;
                switch (g.status) {
                    case ST.MIN:
                        g.min();
                        break;
                    case ST.MAX:
                        g.max();
                        break;
                    case ST.FIX:
                        g.fix();
                        break;
                }
            },
            resize: function (h) {
                var g = this;
                g.lch = h;
                switch (g.status) {
                    case ST.MIN:
                        g.min();
                        break;
                    case ST.MAX:
                        g.max();
                        break;
                    case ST.FIX:
                        g.fix();
                        break;
                }
            },
            //最小化
            min: function () {
                var g = this;
                g.status = ST.MIN;
                $mapWrapper.removeClass("hide").height(g.lch - DIFF - 18);
                // 页签
                $tabWrapper.height(28);
                mainTab.setHeight(28);
                // 表格
                $gridWrapper.height(0);
                gm.renderGrid().setHeight(0);
            },
            //最大化
            max: function () {
                var g = this;
                g.status = ST.MAX;
                var height = (g.lch - DIFF) / 2;

                $mapWrapper.height(0).addClass("hide");

                // 页签
                $tabWrapper.height(height * 2 + 10);
                mainTab.setHeight(height * 2 + 10);
                // 表格
                $gridWrapper.height(height * 2 - 20);
                gm.renderGrid().setHeight(height * 2 - 20);
            },
            //适中
            fix: function () {
                var g = this;
                g.status = ST.FIX;
                var height = (g.lch - DIFF) / 2;
                $mapWrapper.removeClass("hide").height(height);
                // 页签
                $tabWrapper.height(height + 10);
                mainTab.setHeight(height + 10);
                // 表格
                $gridWrapper.height(height - 20);
                gm.renderGrid().setHeight(height - 20);
            },
            // 拖拽
            auto: function () {
                var g = this;
                g.status = ST.AUTO
                var height = g.lch - DIFF - $mapWrapper.height();
                // //页签
                $tabWrapper.height(height + 10);
                mainTab.setHeight(height + 10);
                // //表格
                $gridWrapper.height(height);
                gm.renderGrid().setHeight(height - 10);
            }
        };
    })($mapWrapper, $tabWrapper, $gridWrapper, mainTab, dataRender, $layoutCenter.height(), TAB_WRAPPER_HEIGHT, GRID_WRAPPER_HEIGHT);
    $mapWrapper.ligerResizable({
        handles: 's, se, sw',
        maxHeight : $layoutCenter.height() - 72,
        onEndResize:function (current,e) {
            statusMgr.auto();
        }
    });

    /**
     * 替换页签显示信息
     * 增加右侧最大化最小化按钮的事件和效果
     */
    (function replaceTabHeader(statusMgr) {

        //设置表头
        function setTabHeader(tabid, content) {
            $mainTab.find("li[tabid=" + tabid + "] a")
                // .innerHTML = content;
                // .text(content);
                .html(content);
        }

        setTabHeader("mainGridTab", '<span>全部</span>' + '<em id="allQty" class="tab-all">0</em>');
        setTabHeader("runningGridTab", '<span>运行</span>' + '<em id="runningQty" class="tab-running">0</em>');
        setTabHeader("parkingGridTab", '<span>停车</span>' + '<em id="parkingQty" class="tab-parking">0</em>');
        setTabHeader("warningGridTab", '<span>报警</span>' + '<em id="warningQty" class="tab-warning">0</em>');
        setTabHeader("abnormalGridTab", '<span>异常</span>' + '<em id="abnormalQty" class="tab-abnormal">0</em>');

        $tabAllQty = $("#allQty");
        $tabRunningQty = $("#runningQty");
        $tabParkingQty = $("#parkingQty");
        $tabWarningQty = $("#warningQty");
        $tabAbnormalQty = $("#abnormalQty");

        //添加最大化和最小化操作
        return $('<li class="tab-oper" tabid="operTab">'
                // + '<div class="l-dialog-winbtn"></div>'
            + '<div id="tabFix" class="l-dialog-winbtn l-dialog-recover" style="display: none;"></div>'
            + '<div id="tabMax" class="l-dialog-winbtn l-dialog-max"></div>'
            + '<div id="tabMin" class="l-dialog-winbtn l-dialog-min"></div>'
            + "</li>")
            .appendTo($mainTab.find(".l-tab-links ul"))
            .css('float', 'right').css('margin-right', '20px')
            .find('div')
            .bind('click', function (e) {
                switch (e.target.id) {
                    case 'tabMin':
                        statusMgr.min();
                        $(e.target).siblings().show();
                        $(e.target).hide();
                        break;
                    case 'tabMax':
                        $(e.target).siblings().show();
                        $(e.target).hide();
                        statusMgr.max();
                        break;
                    case 'tabFix':
                        $(e.target).siblings().show();
                        $(e.target).hide();
                        statusMgr.fix();
                        break;
                }
            })
            //鼠标滑过的样式
            .hover(function (e) {
                switch (e.target.id) {
                    case 'tabMin':
                        $(e.target).addClass('l-dialog-min-over');
                        break;
                    case 'tabMax':
                        $(e.target).addClass('l-dialog-max-over');
                        break;
                    case 'tabFix':
                        $(e.target).addClass('l-dialog-recover-over');
                        break;
                }
            }, function (e) {
                switch (e.target.id) {
                    case 'tabMin':
                        $(e.target).removeClass('l-dialog-min-over');
                        break;
                    case 'tabMax':
                        $(e.target).removeClass('l-dialog-max-over');
                        break;
                    case 'tabFix':
                        $(e.target).removeClass('l-dialog-recover-over');
                        break;
                }
            })
            ;
    })(statusMgr);

    /**
     * 判断是否互动页面
     */
    (function () {
        var hidden = "hidden";

        // Standards:
        if (hidden in document)
            document.addEventListener("visibilitychange", onchange);
        else if ((hidden = "mozHidden") in document)
            document.addEventListener("mozvisibilitychange", onchange);
        else if ((hidden = "webkitHidden") in document)
            document.addEventListener("webkitvisibilitychange", onchange);
        else if ((hidden = "msHidden") in document)
            document.addEventListener("msvisibilitychange", onchange);
        // IE 9 and lower:
        else if ('onfocusin' in document)
            document.onfocusin = document.onfocusout = onchange;
        // All others:
        else
            window.onpageshow = window.onpagehide
                = window.onfocus = window.onblur = onchange;

        function onchange(evt) {
            var v = 'visible', h = 'hidden',
                evtMap = {
                    focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
                };

            evt = evt || window.event;
            if (evt.type in evtMap) {
                document.body.className = evtMap[evt.type];
                // console.log('当前标签页状态:' + document.body.className);
            } else {
                document.body.className = this[hidden] ? "hidden" : "visible";
                // console.log('当前标签页状态:' + document.body.className);
            }

            if (document.body.className === 'visible') {
                active = true;
            } else {
                active = false;
            }

        }

        // set the initial state
        onchange({type: (document.visibilityState == "visible") ? "focus" : "blur"});
    })();

    //刷新界面
    statusMgr.refresh();

    // 添加路径线
    function addMotionLine(Array){
        // new BMap.Point();
        var line = new BMap.Polyline(Array, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
        mainMap.addOverlay(line);
    };

    /**
     * 根据状态渲染 支持多字段组合
     * @param field
     * @returns {Function}
     */
    function render(field, val) {
        return function (item) {
            var value = '';
            if (val) value = val(item);
            else {
                if (item instanceof Array) {
                    value = $.map(field, function (f) {
                        return (item[f] || '');
                    }).join('');
                } else {
                    value = item[field] || '';
                }
            }

            switch (item.StatusCode) {
                case STATUS.ABNORMAL:
                    return '<span class="car-abnormal">' + value + '</span>';
                case STATUS.RUNNING:
                    return '<span class="car-running">' + value + '</span>';
                case STATUS.PARKING:
                    return '<span class="car-parking">' + value + '</span>';
                case STATUS.WARNING:
                    return '<span class="car-warning">' + value + '</span>';
            }
        }
    }

    /**
     * 调试日志
     * @param c
     */
    function log(c) {
        if (true) {
            if (console) {
                console.log(c);
            } else {
                alert(c);
            }
        }
    }

    $(window).on("resize",function(){statusMgr.auto();})
})();

