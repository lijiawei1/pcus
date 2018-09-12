<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no"/>
    <jsp:include page="/pages/common/pagesV2.jsp"/>
    <link href="${path}/css/tvs.css" rel="stylesheet" type="text/css">
    <%--<script type="text/javascript"--%>
    <%--src="http://api.map.baidu.com/api?v=2.0&ak=2332ad22cda691b6bcceb955533bf76a"></script>--%>
    <script type="text/javascript"
            src="http://api.map.baidu.com/api?v=2.0&ak=Y1SFdaMIGUwIrLXutyEURTQB"></script>
    <title>地图选车</title>
</head>

<body>
<div id="info"></div>
<div id="allmap"></div>
</body>


<script>

    //地址
    var address = '${address}';
    //坐标
    var loc = JSON.parse('${loc}' || '{}');

    var cars = JSON.parse('${cars}' || '[]')

    var carMappings = {};
    for (var i = 0; i < cars.length; i++) {
        carMappings[cars[i].text] = cars[i];
    }

    var mainForm = $("#info").ligerForm({
        fields: [
            {display: '车牌号', name: 'car_no', newline: false, type: 'text'},
            {display: '默认司机', name: 'driver_name', newline: false, type: 'text'},

        ],
        validate: true,
        toJSON: JSON2.stringify
    });

    if (!!loc) {
        //初始化地图
        mainMap = (function () {
            var bdPoints = GPS.bd_encrypt(loc.lat, loc.lng);

            var ggPoint = new BMap.Point(bdPoints['lon'], bdPoints['lat']);
            //地图初始化
            var bm = new BMap.Map("allmap");
            bm.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
//            bm.centerAndZoom(ggPoint, 15);
            bm.addControl(new BMap.NavigationControl());

            bm.centerAndZoom(ggPoint, 15);
            bm.setCurrentCity("珠海");

            var marker = new BMap.Marker(ggPoint);
            var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)});
            marker.setLabel(label);
            bm.addOverlay(marker);

            //加载附近的车辆
            LG.ajax({
                url: rootPath + '/tms/busi/trans/loadMapCars',
                data: {
                    vehicle: ""
                },
                success: function (data, message, code) {

                    var points = $.map(data, function (item) {
                        var gcjEncrypt = GPS.gcj_encrypt(parseFloat(item.Lat), parseFloat(item.Lon));
                        var bdEncrypt = GPS.bd_encrypt(gcjEncrypt['lat'], gcjEncrypt['lon']);
                        return $.extend({}, item, {point: new BMap.Point(bdEncrypt.lon, bdEncrypt.lat)});
                    });

                    for (var i = 0, length = points.length; i < length; i++) {
                        var row = points[i];
                        var marker = new BMap.Marker(row.point);
                        var label = new BMap.Label(row.Vehicle + ' ' + row.Speed + 'km/h', {offset: new BMap.Size(20, -10)});
                        marker.setLabel(label);

                        var car = carMappings[row.Vehicle];
                        var data = $.extend({}, {
                            car_id: !car ? '' : car.id,
                            car_no: !car ? row.Vehicle : car.text,
                            car_type: !car ? '' : car.type,
                            driver_id: !car ? '' : car.driver_id,
                            driver_name: !car ? '' : car.driver_name,
                            driver_mobile: !car ? '' : car.driver_mobile,
                            carrier_id: !car ? '': car.carrier_id,
                            outsourcing: !car ? '': car.outsourcing,
                            carrier_name: !car ? '' : car.carrier_name,
                        });

                        marker.addEventListener('click',
                                (function (innerData, innerForm) {
                                    return function (e) {
                                        innerForm.setData(innerData);

                                        LG.ajax({
                                            url: rootPath + '/tms/busi/trans/chooseCar',
                                            data: innerData,
                                            success: function() {}
                                        })

                                    }
                                })(data, mainForm)
                        );

                        //加载覆盖物
                        bm.addOverlay(marker);
                    }
                },
                error: function (message, code) {
                    LG.showError('车辆定位信息获取失败:' + message);
                }
            });
            return bm;
        })();
    }

</script>
</html>
