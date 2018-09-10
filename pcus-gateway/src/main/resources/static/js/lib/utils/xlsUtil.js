var xlsUtil = (function () {
    return {

        /**
         * EXCEL导出工具
         * @param $form 临时表单
         * @param mainGrid ligerGrid的配置
         * @param filename 导出文件名
         * @param data 自定义字段
         * @param headers 自定义表头字段
         * @param names 自定义表头名称
         */
        exp: function($form, mainGrid, filename, data, headers, names, sortorder, sortname) {

            var options = mainGrid.options;
            var columns = mainGrid.options.columns;

            var footers = [];
            if (!headers) {

                headers = [];
                names = [];


                for (var i in columns) {
                    var column = columns[i];

                    //忽略
                    var ignore = column.xlsIgnore || false;

                    if (!ignore) {
                        var xlsHead = column.xlsHead || column.display;
                        var xlsName = column.xlsName || column.name;

                        if (xlsHead && xlsName) {
                            headers.push(xlsHead);
                            names.push(xlsName);
                            //表尾合计
                            var xlsFooter = !!column.totalSummary;
                            footers.push(xlsFooter ? 'SUM' : '#');
                        }
                    }
                }

                headers = headers.join(",");
                names = names.join(",");
                footers = footers.join(",");

            }

            //自定义
            if (data) {
                for (var key in data) {
                    $form.find('input[name=' + key + ']').val(data[key]);
                }
            }

            $form.find('input[name=file_name]').val(filename);
            $form.find('input[name=headers]').val(headers);
            $form.find('input[name=names]').val(names);
            $form.find('input[name=footers]').val(footers);
            $form.find('input[name=sortname]').val(sortorder);
            $form.find('input[name=sortorder]').val(sortname);

            $form.submit();
        }
    }
})();