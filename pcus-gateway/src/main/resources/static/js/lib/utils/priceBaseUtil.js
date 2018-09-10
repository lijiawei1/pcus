/**
 * 从数据字典获取价格树
 * @type {{verifyContainerCode}}
 */
var priceBaseUtil = (function () {
    return {
        //校验柜号是否正确
        processPriceBase: function (data_dict) {
            //获取计量单位联动map
            var remap_price_base = {};

            //计价基准:获取计量单位
            var data_price_base = $.grep(data_dict.price_base, function (item) {
                return !item.pdictmx_code;
            });

            //计价单位
            var array_price_unit = $.grep(data_dict.price_base, function (item) {
                return !!item.pdictmx_code;
            });
            for (var i = 0; i < data_price_base.length; i++) {
                var base = data_price_base[i];
                remap_price_base[base.id] = base;
                base.unitMap = {};
                base.unitList = $.grep(array_price_unit, function (item) {
                    var flag = item.pdictmx_code === base.id;
                    if (flag) {
                        base.unitMap[item.id] = item;
                    }
                    return flag;
                });
            }

            return {
                'remap': remap_price_base,
                'base': data_price_base
            };
        },
        processCargoUnit: function (remap_price_base) {
            var cargo_unit = [];
            var unit_type = [ 'BASE_WEIGHT','BASE_QTY','BASE_VOLUME' ];

            for (var i = 0; i < unit_type.length; i++) {
                var type = remap_price_base[unit_type[i]];
                if (!!type) {
                    cargo_unit = cargo_unit.concat(type.unitList || []);
                }
            }
            return cargo_unit;
        }
    }
})();