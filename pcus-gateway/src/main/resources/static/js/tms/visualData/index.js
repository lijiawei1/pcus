/**
 * Created by wujian on 2017/3/2.
 */
$(function () {
    var $mainPage = $("#main-page");

    //各位置的图表
    var chartList = [];

    //初始化图表
    //chartList[0]  = echarts.init(document.getElementById('chart-left-top'), 'starbg');
    chartList[1]  = echarts.init(document.getElementById('chart-left-bottom'), 'starbg');
    chartList[2]  = echarts.init(document.getElementById('chart-center-top'), 'starbg');
    chartList[3]  = echarts.init(document.getElementById('chart-center-bottom-left'), 'starbg');
    chartList[4]  = echarts.init(document.getElementById('chart-center-bottom-right'), 'starbg');
    chartList[5]  = echarts.init(document.getElementById('chart-right-top'), 'starbg');
    chartList[6]  = echarts.init(document.getElementById('chart-right-bottom'), 'starbg');

    initCharts();
    loadCharts();

    function initCharts() {
        initLBChart(chartList[1]);
        initCTChart(chartList[2]);
        initCBLChart(chartList[3]);
        initCBRChart(chartList[4]);
        initRTChart(chartList[5]);
        initRBChart(chartList[6]);

        $mainPage.on("pageResize", function () {
            var cw = document.documentElement.clientWidth,
                cwl = cw > 1600 ? 1 : (cw > 1440 ? 2 : 3),
                fontSize = cw > 1600 ? 16 : (cw > 1440 ? 14 : 12);
            chartList.forEach(function (val, index) {
                var p = {};

                if(val && val.resize){

                    if(index === 2){//中上
                        p = {
                            title: [
                                {
                                    left: cwl > 2 ? 5 : 15,
                                    textStyle: {
                                        fontSize: fontSize
                                    }
                                },
                                {
                                    left: cwl > 2 ? 5 : 30,
                                    textStyle: {
                                        fontSize: fontSize
                                    }
                                },
                                {
                                    left: cwl > 2 ? 5 : 30,
                                    textStyle: {
                                        fontSize: fontSize
                                    }
                                }
                            ]
                        };
                    }
                    else{
                        p = {
                            title: {
                                textStyle: {
                                    fontSize: fontSize
                                }
                            }
                        };
                    }

                    if(index === 3){//中下左
                        $.extend(true, p, {
                            series: [{
                                label: {
                                    normal: {
                                        show: cwl === 1
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: cwl === 1
                                    }
                                }
                            },{
                                label: {
                                    normal: {
                                        show: cwl === 1
                                    }
                                }
                            }]
                        });
                    }

                    if(index === 4){//中下右
                        $.extend(true, p, {
                            legend: {
                                right: cwl > 2 ? '5%' : '10%'
                            }
                        });
                    }

                    val.setOption(p);
                    val.resize();
                }
            });
        });
        $mainPage.trigger("pageResize");
        $("body").on("pageOpen", function () {
            loadCharts();
        });
    }

    function loadCharts() {
        $.ajax({
            url: rootPath + "/tms/visualData/loadData",
            type: "get",
            success: function (data) {
                if(data){
                    data = JSON.parse(data);
                    loadLTChart(data.USER_INFO, data.BILL_INFO);//左上
                    loadLBChart(chartList[1], data.BUSI_TYPE_PROPORTION);//左下
                    loadCTChart(chartList[2], data.CHARGE_PAY_PER_MONTH);//中上
                    loadCBLChart(chartList[3], data.CLIENT_BILL_PROPORTION, data.SUPPLIER_BILL_PROPORTION);//中下左
                }
            }
        });

        loadCBRChart(chartList[4]);//中下右
        loadRTChart(chartList[5]);//右上
        loadRBChart(chartList[6]);//右下
    }

    //左上
    function loadLTChart(USER_INFO, BILL_INFO) {
        var $chartLeftTop = $("#chart-left-top"),
            vehcileInfo = {
                RUNNING: "获取中", 
                ERROR: "获取中", 
                PARKING: "获取中", 
                WARNING: "获取中",
                ALL: "获取中"
            };
        $chartLeftTop.html(template('left-top-template', {USER_INFO:USER_INFO, BILL_INFO:BILL_INFO, vehcileInfo: vehcileInfo}));
        //获取车辆信息（外部接口，不稳定，单独获取）
        $.ajax({
            url: rootPath + "/tms/visualData/vehcileInfo",
            type: "get",
            success: function (data) {
                if(data){
                    data = JSON.parse(data);
                    $chartLeftTop.html(template('left-top-template', {USER_INFO:USER_INFO, BILL_INFO:BILL_INFO, vehcileInfo: data}));
                }
            }
        });
    }
    //左下
    function initLBChart(chartM) {
        var option = {
            title: {
                text: '业务类型占比',
                padding: 2
            },
            tooltip : {
                position: ['25%', '25%']
            },
            radar: [
                {
                    indicator: [],
                    radius: "65%",
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    name: {
                        textStyle: {
                            fontSize: 12
                        }
                    },
                    nameGap: 5,
                    splitArea: {
                        areaStyle: {
                            color: [
                                '#99c8f2',
                                '#76c4e8',
                                '#63c0eb',
                                '#4cb8e9'
                            ]
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                }
            ],
            series: [
                {
                    name: "年度业务类型占比",
                    type: 'radar',
                    symbolSize: 5,
                    lineStyle: {
                        normal: {
                            type: "dashed"
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            lineStyle: {
                                width: 5
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadLBChart(chartM, chartData) {
        var option = {
            radar: [
                {
                    indicator: []
                }
            ],
            series: [
                {
                    data: []
                }
            ]
        };
        if (chartData && chartData.length >= 4) {
            var dataValue = [chartData[0].TOTAL, chartData[1].TOTAL, chartData[2].TOTAL, chartData[3].TOTAL],
                maxValue = getMax(dataValue);
            option.radar[0].indicator = [
                {text: chartData[0].BUSITYPE.slice(0,2), max: maxValue},
                {text: chartData[1].BUSITYPE.slice(0,2), max: maxValue},
                {text: chartData[2].BUSITYPE.slice(0,2), max: maxValue},
                {text: chartData[3].BUSITYPE.slice(0,2), max: maxValue}
            ];
            option.series[0].data = [{
                value: dataValue,
                name: "年度单量"
            }];
        }
        chartM.setOption(option);

        function getMax(data) {
            return Math.max.apply(this, data);
        }
    }
    //中上
    function initCTChart(chartM) {
        var option = {
            title: [
                {
                    text: '收支总览',
                    left: 15,
                    top: 2
                },
                {
                    text: '市\n\n区',
                    top: '15%',
                    left: 30
                },
                {
                    text: '高\n\n栏',
                    top: '65%',
                    left: 30
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            legend: [
                {
                    data: ['收入（市区）', '支出（市区）', '收入（高栏）', '支出（高栏）']
                }
            ],
            grid: [
                {x: '12%', y: '10%', width: '80%', height: '35%'},
                {x: '12%', y2: '10%', width: '80%', height: '35%'}
            ],
            xAxis: [
                {
                    gridIndex: 0,
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        margin: 4
                    },
                    data: [],
                    splitLine: {
                        show: false
                    }
                },
                {
                    gridIndex: 1,
                    type: 'category',
                    axisLabel: {
                        interval: 0,
                        margin: 4
                    },
                    data: [],
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis:[
                {
                    gridIndex: 0,
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                },
                {
                    gridIndex: 1,
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: '收入（市区）',
                    type: 'bar',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: []
                },
                {
                    name: '支出（市区）',
                    type: 'bar',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: []
                },
                {
                    name: '收入（高栏）',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: []
                },
                {
                    name: '支出（高栏）',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: []
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadCTChart(chartM, chartData) {
        var option = {
            xAxis: [
                {
                    data: []
                },
                {
                    data: []
                }
            ],
            series: [
                {
                    data: []
                },
                {
                    data: []
                },
                {
                    data: []
                },
                {
                    data: []
                }
            ]
        };
        if(chartData){
            //市区
            var sqx = option.xAxis[0].data,
                sqsr = option.series[0].data,
                sqzc = option.series[1].data;
            chartData.ZHSJ && chartData.ZHSJ.forEach(function (val) {
                sqx.push(val.BILL_MONTH + "月");
                sqsr.push(val.CHARGE_AMOUNT);
                sqzc.push(val.PAY_AMOUNT);
            });
            //高栏
            var glx = option.xAxis[1].data,
                glsr = option.series[2].data,
                glzc = option.series[3].data;
            chartData.ZHHT && chartData.ZHHT.forEach(function (val) {
                glx.push(val.BILL_MONTH + "月");
                glsr.push(val.CHARGE_AMOUNT);
                glzc.push(val.PAY_AMOUNT);
            });
        }
        chartM.setOption(option);
    }
    //中下左
    function initCBLChart(chartM) {
        var option = {
            title: {
                text: '客户单量占比'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                itemGap: 0,
                left: 0,
                bottom: 0,
                itemWidth: 16,
                itemHeight: 8,
                textStyle: {
                    fontSize: 10
                },
                data: []
            },
            series: [
                {
                    name: '总单量',
                    type: 'pie',
                    radius: ['50%', '75%'],
                    center: ['60%', '50%'],
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    minAngle: 1,
                    data: []
                },
                {
                    name:'总单量',
                    type:'pie',
                    selectedMode: 'single',
                    selectedOffset: 5,
                    radius: [0, '40%'],
                    center: ['60%', '50%'],
                    minAngle: 5,
                    label: {
                        normal: {
                            show: true,
                            position: "inside"
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[]
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadCBLChart(chartM, chartDataClient, chartDataSupplier) {
        var option = {
            legend: {
                data: []
            },
            series: [
                {
                    data: []
                },
                {
                    data:[]
                }
            ]
        };
        if(chartDataSupplier){
            getShortName(chartDataSupplier);
            
            option.series[1].data.push({
                name: chartDataSupplier[0].SUPPLIER_NAME,
                value: chartDataSupplier[0].PROPORTION
            });
            option.legend.data.push(chartDataSupplier[0].SUPPLIER_NAME);
            option.series[1].data.push({
                name: chartDataSupplier[1].SUPPLIER_NAME,
                value: chartDataSupplier[1].PROPORTION
            });
            option.legend.data.push(chartDataSupplier[1].SUPPLIER_NAME);
        }
        if(chartDataClient){
            //排序
            chartDataClient.sort(function (a, b) {
                return b.PROPORTION - a.PROPORTION;
            });
            var itemData;
            for (var i = 0, len = chartDataClient.length; i < 5 && i < len; i++) {
                itemData = chartDataClient[i];
                option.series[0].data.push({
                    name: itemData.CLIENT_NAME,
                    value: itemData.PROPORTION
                });
                option.legend.data.push(itemData.CLIENT_NAME);
            }
            //显示前几个，剩余的加入其他
            if(i<len){
                itemData = 0;
                for (; i < len; i++) {
                    itemData += chartDataClient[i].PROPORTION;
                }
                option.series[0].data.push({
                    name: "其他",
                    value: itemData
                });
                option.legend.data.push("其他");
            }
        }
        chartM.setOption(option);

        function getShortName(data) {
            data.forEach(function (val) {
                if (val.SUPPLIER_NAME === "珠海市集装箱运输有限公司") val.SUPPLIER_NAME = "市集";
                else if (val.SUPPLIER_NAME === "珠海汇通物流有限公司") val.SUPPLIER_NAME = "汇通";
            });
        }
    }
    //中下右
    function initCBRChart(chartM) {
        var option = {
            title: {
                text: '月单量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                itemGap: 3,
                right: '10%',
                data: ['疏港', '集港', '散货', '配送', '总单量']
            },
            grid: {
                width: '80%',
                height: '70%',
                x: '10%',
                y: '15%'
            },
            xAxis: [{
                type: 'category',
                data: [],
                splitLine: {
                    show: false
                }
            }],
            yAxis:[{
                type: 'value',
                splitLine: {
                    show: false
                }
            }],
            series: [
                {
                    name: '疏港',
                    type: 'line',
                    legendHoverLink: true,
                    data: []
                },
                {
                    name: '集港',
                    type: 'line',
                    legendHoverLink: true,
                    data: []
                },
                {
                    name: '散货',
                    type: 'line',
                    legendHoverLink: true,
                    data: []
                },
                {
                    name: '配送',
                    type: 'line',
                    legendHoverLink: true,
                    data: []
                },
                {
                    name: '总单量',
                    type: 'line',
                    legendHoverLink: true,
                    data: []
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadCBRChart(chartM) {
        $.ajax({
            url: rootPath + "/tms/report/trans/monthBillQuery/loadGrid",
            type: "post",
            success: function (data) {
                if(data){
                    setData(JSON.parse(data));
                }
            }
        });

        function setData(data) {
            var option = {
                legend: {
                    data: ['疏港', '集港', '散货', '配送', '总单量']
                },
                xAxis: [{
                    data: []
                }],
                series: [
                    {
                        name: '疏港',
                        data: []
                    },
                    {
                        name: '集港',
                        data: []
                    },
                    {
                        name: '散货',
                        data: []
                    },
                    {
                        name: '配送',
                        data: []
                    },
                    {
                        name: '总单量',
                        data: []
                    }
                ]
            };
            if (data && data.Rows) {
                var itemData;
                for (var i = 0, len = data.Rows.length; i < len; i++) {
                    itemData = data.Rows[i];
                    option.xAxis[0].data.push(itemData.m_date);

                    option.series[0].data.push(itemData.shugangjinkou);
                    option.series[1].data.push(itemData.jigangchukou);
                    option.series[2].data.push(itemData.sanhuozhengche);
                    option.series[3].data.push(itemData.peisongyunshu);
                    option.series[4].data.push(itemData.zongdanliang);
                }
            }
            chartM.setOption(option);
        }
    }
    //右上
    function initRTChart(chartM) {
        var option = {
            title: {
                text: '调度单量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                itemGap: 3,
                itemWidth: 16,
                itemHeight: 8,
                right: '15%',
                data: ['疏港', '集港', '散货', '配送']
            },
            grid: {
                width: '70%',
                height: '70%',
                x: '15%',
                y: '15%'
            },
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                }
            }],
            yAxis:[{
                type: 'category',
                inverse: true,
                splitLine: {
                    show: false
                },
                data: []
            }],
            series: [
                {
                    name: '疏港',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '集港',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '散货',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '配送',
                    type: 'bar',
                    stack: 5,
                    data: []
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadRTChart(chartM) {
        $.ajax({
            url: rootPath + "/tms/report/trans/transOperQuery/loadGrid",
            type: "post",
            success: function (data) {
                if(data){
                    setData(JSON.parse(data));
                }
            }
        });

        function setData(data) {
            var option = {
                legend: {
                    data: ['疏港', '集港', '散货', '配送']
                },
                yAxis:[{
                    data: []
                }],
                series: [
                    {
                        name: '疏港',
                        data: []
                    },
                    {
                        name: '集港',
                        data: []
                    },
                    {
                        name: '散货',
                        data: []
                    },
                    {
                        name: '配送',
                        data: []
                    }
                ]
            };
            if (data && data.Rows) {
                //排序
                data.Rows.sort(function (a, b) {
                    return b.total - a.total;
                });
                var itemData;
                for (var i = 0, len = data.Rows.length; i < 5 && i < len; i++) {
                    itemData = data.Rows[i];
                    option.yAxis[0].data.push(itemData.create_psn);

                    option.series[0].data.push(itemData.cntr_import);
                    option.series[1].data.push(itemData.cntr_export);
                    option.series[2].data.push(itemData.cargo);
                    option.series[3].data.push(itemData.distr);
                    //option.series[4].data.push(itemData.total);
                }
                //显示前5个，剩余的加入其他
                if(i<len){
                    var cntr_import = 0,
                        cntr_export = 0,
                        cargo = 0,
                        distr = 0;

                    for (; i < len; i++) {
                        itemData = data.Rows[i];
                        cntr_import += itemData.cntr_import;
                        cntr_export += itemData.cntr_export;
                        cargo += itemData.cargo;
                        distr += itemData.distr;
                    }

                    option.series[0].data.push(cntr_import);
                    option.series[1].data.push(cntr_export);
                    option.series[2].data.push(cargo);
                    option.series[3].data.push(distr);

                    option.yAxis[0].data.push("其他");
                    option.legend.data.push("其他");
                }
            }
            chartM.setOption(option);
        }
    }
    //右下
    function initRBChart(chartM) {
        var option = {
            title: {
                text: '客服单量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                itemGap: 3,
                itemWidth: 16,
                itemHeight: 8,
                right: '15%',
                data: ['疏港', '集港', '散货', '配送']
            },
            grid: {
                width: '70%',
                height: '70%',
                x: '15%',
                y: '15%'
            },
            xAxis: [{
                type: 'value',
                splitLine: {
                    show: false
                }
            }],
            yAxis:[{
                type: 'category',
                inverse: true,
                splitLine: {
                    show: false
                },
                data: []
            }],
            series: [
                {
                    name: '疏港',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '集港',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '散货',
                    type: 'bar',
                    stack: 5,
                    data: []
                },
                {
                    name: '配送',
                    type: 'bar',
                    stack: 5,
                    data: []
                }
            ]
        };
        chartM.setOption(option);
    }
    function loadRBChart(chartM) {
        $.ajax({
            url: rootPath + "/tms/report/trans/orderOperQuery/loadGrid",
            type: "post",
            success: function (data) {
                if(data){
                    setData(JSON.parse(data));
                }
            }
        });

        function setData(data) {
            var option = {
                legend: {
                    data: ['疏港', '集港', '散货', '配送']
                },
                yAxis:[{
                    data: []
                }],
                series: [
                    {
                        name: '疏港',
                        data: []
                    },
                    {
                        name: '集港',
                        data: []
                    },
                    {
                        name: '散货',
                        data: []
                    },
                    {
                        name: '配送',
                        data: []
                    }
                ]
            };
            if (data && data.Rows) {
                //排序
                data.Rows.sort(function (a, b) {
                    return b.total - a.total;
                });
                var itemData;
                for (var i = 0, len = data.Rows.length; i < 5 && i < len; i++) {
                    itemData = data.Rows[i];
                    option.yAxis[0].data.push(itemData.create_psn);

                    option.series[0].data.push(itemData.cntr_import);
                    option.series[1].data.push(itemData.cntr_export);
                    option.series[2].data.push(itemData.cargo);
                    option.series[3].data.push(itemData.distr);
                    //option.series[4].data.push(itemData.total);
                }
                //显示前5个，剩余的加入其他
                if(i<len){
                    var cntr_import = 0,
                        cntr_export = 0,
                        cargo = 0,
                        distr = 0;

                    for (; i < len; i++) {
                        itemData = data.Rows[i];
                        cntr_import += itemData.cntr_import;
                        cntr_export += itemData.cntr_export;
                        cargo += itemData.cargo;
                        distr += itemData.distr;
                    }

                    option.series[0].data.push(cntr_import);
                    option.series[1].data.push(cntr_export);
                    option.series[2].data.push(cargo);
                    option.series[3].data.push(distr);

                    option.yAxis[0].data.push("其他");
                    option.legend.data.push("其他");
                }
            }
            chartM.setOption(option);
        }
    }
});