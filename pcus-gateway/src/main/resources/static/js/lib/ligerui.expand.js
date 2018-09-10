/*
 默认参数 扩展
 */

$.extend($.ligerDefaults.Grid, {
    rowHeight: 30,
    checkbox: true,
    fixedCellHeight: false,
    frozen: false,
    async: true,
    headerRowHeight: 30,
    allowUnSelectRow: true,
    onError: function (result, b) {
        LG.tip('发现系统错误 ' + b);
    }
});

$.extend($.ligerDefaults.Tab, {
    contextmenu: false
});

/*
 表格 扩展
 */

$.extend($.ligerui.controls.Grid.prototype, {
    _initBuildHeader: function () {
        var g = this, p = this.options;
        if (p.title) {
            $(".l-panel-header-text", g.header).html(p.title);
            if (p.headerImg)
                g.header.append("<img src='" + p.headerImg + "' />").addClass("l-panel-header-hasicon");
        }
        else {
            g.header.hide();
        }
        if (p.toolbar) {
            if ($.fn.ligerToolBar)
                g.toolbarManager = g.topbar.ligerToolBar(p.toolbar);
        }
        else {
            g.topbar.remove();
        }
    },
    /**
     *
     *  defaultSearch={
     * and:[],//直接加入and条件
     * or:[[],[]]//加入多组or条件
     * }
     * */
    getSearchGridData: function (dr,value,defaultField){
        var grid = this,
            data = {op: "and", rules: [], groups: []};
        //加入默认字段
        if(dr){
            data.rules.push({
                field: 'dr', value: 0, op: 'equal', type: 'int'
            });
        }
        if(defaultField){
            data.rules = data.rules.concat(defaultField.and);
            addDefaultOr(data.groups,defaultField.or);
        }
    
        data.groups[data.groups.length] = {
            op: "or",
            rules:[]
        };
        if(value){
            addRules(grid, data.groups[data.groups.length - 1].rules,value);
        }
    
        return JSON2.stringify(data);
    
        function addDefaultOr(groups,orArr){
            for(var i = 0,len=orArr.length;i<len;i++){
                groups.push({
                    op: "or",
                    rules:[].concat(orArr[i])
                });
            }
        }
    
        function addRules(grid,rules,value){
            var cols = grid.columns,name,col;
    
            for(var i = 0,len = cols.length;i<len;i++){
                col = cols[i];
                if(col["quickSort"] !== false){
                    name =col.name;
                    if(name){
                        rules.push({
                            op: "like",
                            field: name,
                            value: value,
                            type: "string"
                        });
                    }
                }
            }
        }
    },
    addEditRow: function (rowdata) {
        var g = this;
        rowdata = g.add(rowdata);
        return g.beginEdit(rowdata);
    },
    getEditingRow: function () {
        var g = this;
        for (var i = 0, l = g.rows.length; i < l; i++) {
            if (g.rows[i]._editing) return g.rows[i];
        }
        return null;
    },
    getChangedRows: function () {
        var g = this, changedRows = [];
        pushRows(g.getDeleted(), 'delete');
        pushRows(g.getUpdated(), 'update');
        pushRows(g.getAdded(), 'add');
        return changedRows;

        function pushRows(rows, status) {
            if (!rows || !rows instanceof Array) return;
            for (var i = 0, l = rows.length; i < l; i++) {
                changedRows.push($.extend({}, rows[i], {__status: status}));
            }
        }

    }
});

/*
 表格格式化函数扩展
 */



//扩展 percent 百分比 类型的格式化函数(0到1之间)
$.ligerDefaults.Grid.formatters['percent'] = function (value, column) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;
    var precision = column.editor.precision || 0;
    return (value * 100).toFixed(precision) + "%";
};

//扩展 numberbox 类型的格式化函数
$.ligerDefaults.Grid.formatters['numberbox'] = function (value, column) {
    var precision = column.editor.precision || 0;
    return value.toFixed(precision);
};
//扩展 currency 类型的格式化函数
$.ligerDefaults.Grid.formatters['currency'] = function (num, column) {
    //num 当前的值
    //column 列信息
    if (!num) return "0.00";
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0.00";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return "" + (((sign) ? '' : '-') + '' + num + '.' + cents);
};

/*
 表格编辑器
 */

//扩展一个 百分比输入框 的编辑器(0到1之间)
$.ligerDefaults.Grid.editors['percent'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision || 0;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var showVal = input.val();
            showVal.replace('%', '');
            input.val(parseFloat(showVal).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        var showVal = input.val();
        showVal.replace('%', '');
        var value = parseFloat(showVal) * 0.01;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        return value;
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision || 0;
        if (value < 0) value = 0;
        if (value > 1) value = 1;
        var showVal = (value * 100).toFixed(precision) + "%";
        input.val(showVal);
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(height);
    }
};

/**
 * 扩展一个 新的数字输入 的编辑器（by:wujian  创建于：2016-12-08 最后修改于：2017-01-17）
 * ext（或p）可选参数（对象，如果是一个函数，则调用此函数）：
 * attr 加入input的属性，如maxlength
 * type 类型：int或float（整数或者非整数）
 * minValue和maxValue
 * defaultValue：当输入不合法时返回的值，默认为空字符串
 * precision: 小数位数（设置此参数将返回字符串形式的值）
 * */
$.ligerDefaults.Grid.editors['newnumberbox'] = {
    create: function (container, editParm) {
        var input = $("<input type='text' />");
        var column = editParm.column,
            ext = column.editor.p || column.editor.ext;
        var p = {
            attr: null,
            type: "float",
            minValue: null,
            maxValue: null,
            defaultValue: ""
        };
        if (ext) {
            var tmp = typeof ext === 'function' ? ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
            $.extend(p, tmp);
        }

        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            //数字 || 点 ||  负号 ||退格
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 45 || keyCode == 8;
        });

        var attrOption = p.attr;
        if(attrOption){
            input.attr(attrOption);
        }
        container.append(input);
        input.ligerTextBox(p);
        return input;
    },
    getValue: function (input, editParm) {
        var column = editParm.column,
            ext = column.editor.p || column.editor.ext,
            value;
        var p = {
            attr: null,
            type: "float",
            minValue: null,
            maxValue: null,
            defaultValue: "",
            precision: null
        };
        if (ext) {
            var tmp = typeof ext === 'function' ? ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
            $.extend(p, tmp);
        }

        if (p.type === "int"){
            value = parseInt(input.val(), 10);
        }
        else{
            value = parseFloat(input.val());
        }
        if(isNaN(value) || (p.minValue !== null && value < p.minValue) || (p.maxValue !== null && value > p.maxValue)){
            return p.defaultValue;
        }
        else{
            return p.precision ? value.toFixed(p.precision) : value;
        }

    },
    setValue: function (input, value, editParm) {
        input.val(value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width - 8);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

//扩展一个 数字输入 的编辑器
$.ligerDefaults.Grid.editors['numberbox'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        var input = $("<input type='text' style='text-align:right' class='l-text' />");
        input.bind('keypress', function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            return keyCode >= 48 && keyCode <= 57 || keyCode == 46 || keyCode == 8;
        });
        input.bind('blur', function () {
            var value = input.val();
            input.val(parseFloat(value).toFixed(precision));
        });
        container.append(input);
        return input;
    },
    getValue: function (input, editParm) {
        return parseFloat(input.val());
    },
    setValue: function (input, value, editParm) {
        var column = editParm.column;
        var precision = column.editor.precision;
        input.val(value.toFixed(precision));
    },
    resize: function (input, width, height, editParm) {
        input.width(width).height(height);
    }
};

$.ligerDefaults.Grid.editors['date'] = {
    create: function (container, editParm) {
        var column = editParm.column;
        var input = $("<input type='text'/>");
        container.append(input);
        var options = {};
        var ext = column.editor.p || column.editor.ext;
        if (ext) {
            var tmp = typeof (ext) == 'function' ?
                ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
            $.extend(options, tmp);
        }
        input.ligerDateEditor(options);
        return input;
    },
    getValue: function (input, editParm) {
        return input.liger('option', 'value');
    },
    setValue: function (input, value, editParm) {
        input.liger('option', 'value', value);
    },
    resize: function (input, width, height, editParm) {
        input.liger('option', 'width', width);
        input.liger('option', 'height', height);
    },
    destroy: function (input, editParm) {
        input.liger('destroy');
    }
};

$.ligerDefaults.Grid.editors['select'] =
    $.ligerDefaults.Grid.editors['combobox'] =
    {
        create: function (container, editParm) {
            var column = editParm.column;
            var input = $("<input type='text'/>");
            container.append(input);
            var options = {
                data: column.editor.data,
                slide: false,
                valueField: column.editor.valueField || column.editor.valueColumnName,
                textField: column.editor.textField || column.editor.displayColumnName
            };
            var ext = column.editor.p || column.editor.ext;
            if (ext) {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, column) : ext;
                $.extend(options, tmp);
            }
            input.ligerComboBox(options);
            return input;
        },
        getValue: function (input, editParm) {
            return input.liger('option', 'value');
        },
        setValue: function (input, value, editParm) {
            input.liger('option', 'value', value);
        },
        resize: function (input, width, height, editParm) {
            input.liger('option', 'width', width - 2);
            input.liger('option', 'height', height);
        },
        destroy: function (input, editParm) {
            input.liger('destroy');
        }
    };

$.ligerDefaults.Grid.editors['int'] =
    $.ligerDefaults.Grid.editors['float'] =
        $.ligerDefaults.Grid.editors['spinner'] =
        {
            create: function (container, editParm) {
                var column = editParm.column;
                var input = $("<input type='text'/>");
                container.append(input);
                input.css({border: '#6E90BE'})
                var options = {
                    type: column.editor.type == 'float' ? 'float' : 'int'
                };

                /**
                 * 2016-09修复行内编辑文本框传入选项
                 * @type {{}}
                 */
                var ext = editParm.column.editor.p || editParm.column.editor.ext;
                if (ext) {
                    var tmp = typeof (ext) == 'function' ?
                        ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
                    $.extend(options, tmp);
                }

                if (column.editor.minValue != undefined) options.minValue = column.editor.minValue;
                if (column.editor.maxValue != undefined) options.maxValue = column.editor.maxValue;
                input.ligerSpinner(options);
                return input;
            },
            /**
             * 2016-12-08 不出现NaN
             * */
            getValue: function (input, editParm) {
                var column = editParm.column,
                    isInt = column.editor.type == "int",
                    value;
                if (isInt)
                    value = parseInt(input.val(), 10);
                else
                    value = parseFloat(input.val());
                return isNaN(value) ? "" : value;
            },
            setValue: function (input, value, editParm) {
                input.val(value);
            },
            resize: function (input, width, height, editParm) {
                input.liger('option', 'width', width - 8);
                input.liger('option', 'height', height);
            },
            destroy: function (input, editParm) {
                input.liger('destroy');
            }
        };


$.ligerDefaults.Grid.editors['string'] =
    $.ligerDefaults.Grid.editors['text'] = {
        create: function (container, editParm) {
            var input = $("<input type='text' class='l-text-editing'/>");
            if (typeof (editParm.column.validate) == "string") {
                input.attr("validate", editParm.column.validate);
            }
            else if (editParm.column.validate && typeof (editParm.column.validate) == "object") {
                input.attr("validate", JSON2.stringify(editParm.column.validate));
            }
            if (editParm.grid) {
                var id = editParm.grid.id + "_editor_" + editParm.grid.editorcounter++ + "_" + new Date().getTime();
                input.attr("name", id).attr("id", id);
            }
            /**
             * 2016-09修复行内编辑文本框传入选项
             * @type {{}}
             */
            var options = {};
            var ext = editParm.column.editor.p || editParm.column.editor.ext;
            if (ext) {
                var tmp = typeof (ext) == 'function' ?
                    ext(editParm.record, editParm.rowindex, editParm.value, editParm.column) : ext;
                $.extend(options, tmp);
            }
            /**
             * 2016-12-08 增加attr的支持，加入自定义属性，如maxlength等（注：表单默认就支持，只是表格里的输入框不支持）
             * */
            var attrOption = options.attr;
            if(attrOption){
                for(var attrItem in attrOption){
                    input.attr(attrItem, attrOption[attrItem]);
                }
            }
            container.append(input);
            input.ligerTextBox(options);
            return input;
        },
        getValue: function (input, editParm) {
            return input.val();
        },
        setValue: function (input, value, editParm) {
            input.val(value);
        },
        resize: function (input, width, height, editParm) {
            input.liger('option', 'width', width - 8);
            input.liger('option', 'height', height);
        },
        destroy: function (input, editParm) {
            input.liger('destroy');
        }
    };

//扩展 ligerGrid 的 搜索功能(高级自定义查询)
$.ligerui.controls.Grid.prototype.showFilter = function () {
    var g = this, p = this.options;
    if (g.winfilter) {
        g.winfilter.show();
        return;
    }
    var filtercontainer = $('<div id="' + g.id + '_filtercontainer"></div>').width(380).height(120).hide();
    var fields = [];
    $(g.columns).each(function () {
        var o = {name: this.name, display: this.display};
        var isNumber = this.type == "int" || this.type == "number" || this.type == "float";
        var isDate = this.type == "date";
        if (isNumber) o.type = "number";
        if (isDate) o.type = "date";
        if (this.editor) {
            o.editor = this.editor;
        }
        fields.push(o);
    });
    var filter = filtercontainer.ligerFilter({fields: fields});
    g.winfilter = $.ligerDialog.open({
        width: 420, height: 208,
        target: filtercontainer, isResize: true, top: 50,
        buttons: [
            {
                text: '确定', onclick: function (item, dialog) {
                loadFilterData();
                dialog.hide();
            }
            },
            {
                text: '取消', onclick: function (item, dialog) {
                dialog.hide();
            }
            }
        ]
    });

    var historyPanle = $('<div class="historypanle"><select class="selhistory"><option value="0">历史查询记录</options></select><input type="button" value="删除" class="deletehistory" /><input type="button" value="保存" class="savehistory" /></div>');
    filtercontainer.append(historyPanle);

    var historySelect = $(".selhistory", historyPanle).change(function () {
        if (this.value == "0") return;
        var rule = getHistoryRule(this.value);
        if (rule)
            filter.setData(rule);
    });

    $(".deletehistory", historyPanle).click(function () {
        if (historySelect.val() == "0") return;
        $.ligerDialog.confirm('确定删除吗', function (yes) {
            if (yes) {
                removeHistory(historySelect.val());
                reLoadHistory();
            }
        });
    });

    $(".savehistory", historyPanle).click(function () {
        $.ligerDialog.prompt('输入保存名字', JSON2.stringify(new Date()).replace(/["-\.:]/g, ''), false, function (yes, name) {
            if (yes && name) {
                addHistory(name);
                reLoadHistory();
                historySelect.val(name);
            }
        });
    });

    reLoadHistory();

    function getKey() {
        return encodeURIComponent(p.url.replace(/(.+)?view=/, ''));
    }

    function reLoadHistory() {
        historySelect.html('<option value="0">历史查询记录</options>');
        var key = getKey();
        var history = LG.cookies.get(key);
        if (history) {
            var data = JSON2.parse(history);
            $(data).each(function () {
                historySelect.append('<option value="' + this.name + '">' + this.name + '</options>');
            });
        }
    }

    function removeHistory(name) {
        var key = getKey();
        var data;
        var history = LG.cookies.get(key);
        if (history) {
            data = JSON2.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name) {
                    data.splice(i, 1);
                    LG.cookies.set(key, JSON2.stringify(data));
                    return;
                }
            }
        }
    }

    function addHistory(name) {
        var key = getKey();
        var data;
        var history = LG.cookies.get(key);
        if (history) {
            data = JSON2.parse(history);
            data.push({name: name, value: filter.getData()});

        }
        else {
            data = [{name: name, value: filter.getData()}];
        }
        LG.cookies.set(key, JSON2.stringify(data));
    }

    function getHistoryRule(name) {
        var key = getKey();
        var history = LG.cookies.get(key);
        if (history) {
            var data = JSON2.parse(history);
            for (var i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name)
                    return data[i].value;
            }
        }
        return null;
    }

    function loadFilterData() {
        var data = filter.getData();
        if (data && data.rules && data.rules.length) {
            g.set('parms', {where: JSON2.stringify(data)});
        } else {
            g.set('parms', {});
        }
        g.loadData();
    }
};


/*
 表单 扩展
 */
$.extend($.ligerui.controls.TextBox.prototype, {
    checkNotNull: function () {
        var g = this, p = this.options;
        if (p.nullText && !p.disabled) {
            if (!g.inputText.val()) {
                g.inputText.addClass("l-text-field-null").val(p.nullText);
            }
        }
    }
});

$.extend($.ligerui.controls.ComboBox.prototype, {
    _setHeight: function (value) {
        var g = this;
        if (value > 10) {
            g.wrapper.height(value);
            g.inputText.height(value);
            g.link.height(value);
            g.textwrapper.css({width: value});
        }
    }
});

/**
 * 扩展ligerForm。获得表单的值
 * 可使用attr指定：
 * op:操作，默认为like，
 * type：类型，默认为string
 * data-name：提交字段名，默认为input的name
 * data-ignore ： 是否忽略，默认为false，条件提交到后台，但不一定拼装
 * data-getCVal：下拉框中，获取显示的文本而不是实际的值，默认获取实际的值
 * data-default: 字段默认值,获取默认值
 * date-isrange ： 是否强制取消时间补全
 * data-range ： 是否进行时间补全（start/end）。需要和 data-name 一起使用。
 * N : 补全时间相隔天数，默认是 0
 *
 * 针对时间类型的处理：
 * 1.提交后台VO接收，补全00:00:00对日期无影响
 * 2.提交后台WHERE条件
 *   2.1后台是数据库是date类型
 *      前台提交日期/日期时分秒，后台根据datatype类型使用to_date（oracle）等函数转型比较
 *   2.2前台输入日期，后台是时分秒时使用datetimerage补全时分秒上下边界
 *   2.3通过dateformat控制返回时间字符串的格式，默认是
 *
 * datatype: 针对后台数据库字段类型的处理，适配date数据库类型时请添加 datatype: "date" 属性
 * datetimerange: 补全时间范围，当后台存【日期时分秒】，前台查询只输入【日期】过滤，大于等于补全00:00:00，小于等于补全23:59:59
 * dateformat: 设置日期时分秒值返回格式 yyyy-MM-dd HH:mm:ss
 *
 * defaultSearch={
 * and:[],//直接加入and条件
 * or:[[],[]]，//加入多组or条件
 * }
 *
 * */
$.extend($.ligerui.controls.Form.prototype, {
    getSearchFormData: function (dr, defaultSearch) {
        var g = this, p = this.options;
        var data = {op: "and", rules: [], groups: []};

        var isrange = true,
            rangeObj = {};

        if (dr) {
            data.rules.push({
                field: 'dr', value: 0, op: 'equal', type: 'int'
            });
        }

        //加入默认值
        if(defaultSearch){
            data.rules = data.rules.concat(defaultSearch.and);
            addDefaultOr(data.groups,defaultSearch.or);
        }
        //加入表单的值
        addRules(data.rules);
        rangeObjFun();

        //转换
        return JSON2.stringify(data);

        function addDefaultOr(groups,orArr){
            for(var i = 0,len=orArr.length;i<len;i++){
                groups.push({
                    op: "or",
                    rules:[].concat(orArr[i])
                });
            }
        }

        function addRules(rules) {
            var elems = g.element,
                prefixIDLen = p.prefixID ? p.prefixID.length : 0;

            for (var i = 0, len = elems.length; i < len; i++) {
                var $e = $(elems[i]), name, val, op, type;

                if ($e.parent().hasClass("l-text-combobox")) continue;

                name = $e.attr("name");
                if (!name) continue;
                
                if($e.parent().hasClass("l-text-date")){
                    val = getformatDate($e);
                }
                else if($e.attr("type")==="checkbox"){
                    val = $e[0].checked ? "Y" : "N";
                }
                else{
                    //获取默认值
                    val = $e.val() ||
                            //判断是否attr的取值
                        ($e.prev(".l-text-combobox").length > 0 ?
                            $e.prev(".l-text-combobox").children("input").attr("data-default") : $e.attr("data-default"))
                }


                var $eDataName = $e.attr("data-name");

                if($e.attr("data-range") && isrange){
                    rangeObj[$eDataName] =  rangeObj[$eDataName] ? rangeObj[$eDataName] : {};
                    switch($e.attr("data-range")){
                        case "start":
                            if(!val) {return}
                            rangeObj[$eDataName]['startDom'] = $e;
                            break;
                        case "end":
                            if(!val) {return}
                            rangeObj[$eDataName]['endDom'] = $e;
                            break;
                        case "allStart":
                            rangeObj[$eDataName]['startDom'] = $e;
                            break;
                        case "allEnd":
                            rangeObj[$eDataName]['endDom'] = $e;
                            break;
                    }
                }

                if (!val){
                    continue;
                }else{
                    if($e.attr("date-isrange") == "false"){
                        isrange = false;
                    }
                }

                if ($e.prev(".l-text-combobox").length > 0) {
                    $e = $e.prev(".l-text-combobox").children("input");
                }
                op = $e.attr("op") || "like";
                type = $e.attr("type") || "string";
                
                rules.push({
                    op: op,
                    field: $eDataName || name.slice(prefixIDLen),//去除前缀
                    value: $e.attr("data-getCVal") ? $e.val() : val,
                    type: type,
                    // 增加数据类型，针对日期
                    datatype: $e.attr("datatype") || "",
                    // 增加配置是否忽略
                    ignore :  $e.attr("data-ignore") || false
                });
            }
        }

        //手动获得日期的值
        function getformatDate(ele) {
            var field = ele.attr("ligeruiid");
            var editor = liger.get(field),
                val = editor.getValue() || $(editor.element).val();
            if (!val) return null;
            if (typeof val === "string") {
                if (val.length === 10) val += " 00:00:00";
                val = new Date(val);
                if (val.toString() === "Invalid Date") return null;
            }
            /**
             * 2017-02-20
             * 只传日期，不显示时间的查询条件
             */
            if (ele.attr("datetimerange")) {
            // if (!editor.get('showTime')) {
                //替换小于(等于)的时间
                var op = ele.attr("op") || "like";
                if (op == "lessorequal" || op == "less") {
                    val.setHours(23, 59, 59);
                } else if (op == "greaterorequal" || op == "greater") {
                    val.setHours(0, 0, 0);
                }
            }

            //注意格式
            var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";

            return DateUtil.dateToStr(format, val);
        }

        // 自动补全日期
        function autoDate(ele,name,vale,op){
            var dataArray = [];
            if(!vale){
                var valData = new Date(),
                    valData2 = new Date();
                valData2.setDate(valData2.getDate() - (parseInt(ele.attr("N")) || 0));
                valData2.setHours(00,00,00);
                valData.setHours(23,59,59);
                var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: 'lessorequal',
                    type:"text",
                    value: DateUtil.dateToStr(format,valData)
                });
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: 'greaterorequal',
                    type:"text",
                    value: DateUtil.dateToStr(format,valData2)
                });
            }else{
                var format = ele.attr("dateformat") || "yyyy-MM-dd HH:mm:ss";
                if(op == "lessorequal"){
                    vale.setHours(23,59,59);
                }else{
                    vale.setHours(00,00,00);
                }
                dataArray.push({
                    datatype:ele.attr("data-datatype") || "",
                    field:name,
                    ignore:ele.attr("data-ignore") || false,
                    op: op,
                    type:"text",
                    value: DateUtil.dateToStr(format,vale)
                });
            }
            for (var i = dataArray.length - 1;i>=0;i--){
                data.rules.push(dataArray[i]);
            }
        }

        // 进行时间补全
        function rangeObjFun(){
            for(var rangeI in rangeObj){
                var startTure = rangeObj[rangeI].startDom ? rangeObj[rangeI].startDom.val() == "" ? false : true : false;
                var endTure = rangeObj[rangeI].endDom ? rangeObj[rangeI].endDom.val() == "" ? false : true : false;
                if(!startTure){
                    var $e =  rangeObj[rangeI].endDom || rangeObj[rangeI].startDom ,
                        val = $e.val();
                    if(val == ""){
                        autoDate($e,rangeI);
                    }else{
                        var dateSatring = val.split(" ")[0].split("-");
                        var valDate = new Date(dateSatring.join("/"));
                        valDate.setDate(valDate.getDate() - (parseInt($e.attr("N")) || 0) );
                        autoDate($e ,rangeI,valDate,"greaterorequal");
                    }
                }else if(!endTure){
                    var $e =  rangeObj[rangeI].startDom || rangeObj[rangeI].endDom,
                        val = $e.val();
                    if(val == ""){
                        autoDate($e,rangeI);
                    }else {
                        var dateSatring = val.split(" ")[0].split("-");
                        var valDate = new Date(dateSatring.join("/"));
                        valDate.setDate(valDate.getDate() + (parseInt($e.attr("N")) || 0));
                        autoDate($e, rangeI,valDate,  "lessorequal");
                    }
                }else if(!startTure && !endTure){
                    autoDate(rangeObj[rangeI].startDom,rangeI);
                }
            }
        }
    },
    
    //重置表单的值
    reset: function() {
        var g = this, p = this.options;
        var editors = g.editors;
        for (var i in editors) {
            var item = editors[i];
            var editor = item.control;
            if (editor instanceof $.ligerui.controls.TextBox) {
                editor.setValue("");
                $(editors[i].control.element).val("");
            }
            else if (editor instanceof $.ligerui.controls.ComboBox || editor instanceof $.ligerui.controls.DateEditor) {
                if (!$(editor.wrapper).hasClass("l-text-readonly"))
                    editor.clear();
            }
            else if(editor instanceof  $.ligerui.controls.CheckBox){
                editor.setValue("");
            } else {
                editor[0].value = '';
            }
        }
    }
});

$.extend($.ligerui.editors, {
    'set': {
        control: 'Set'
    },
    'taginput': {
        control: 'TagInput'
    }
});

/*
 * 扩展验证
 */
// 日期范围限定，params参数为最小值，最大值和信息提示，是否开启验证，上限的当前时间是否从零点算起，下限的当前时间是否从零点算
jQuery.validator.addMethod("dateRange", function (value, element, params) {
    if (!value || !params[3]) return true;
    var oneDate = 86400000,//一天的毫秒数
        inputDate = DateUtil.strToDate(value + " 00:00:00").getTime(),
        todayDate = new Date(DateUtil.dateToStr("YYYY-MM-DD", new Date()) + " 00:00:00").getTime(),
        currentDate = new Date().getTime(),

        minDate = null,
        maxDate = null;

    if (typeof params[0] === "number") minDate = params[0] * oneDate + (params[5] ? todayDate : currentDate);
    if (typeof params[1] === "number") maxDate = params[1] * oneDate + (params[4] ? todayDate : currentDate);

    return (!minDate || (minDate <= inputDate)) && (!maxDate || (maxDate > inputDate));//maxDate>inputDate，等于的时候实际上是第二天零点了

}, $.validator.format("{2}"));

// 字段比较限定，输入字段和另一个字段比较，params为：比较字段的jq选择器，比较类型（eq,lt,gt,lteq,gteq），信息提示，是否开启验证
jQuery.validator.addMethod("compareNumTo", function (value, element, params) {
    if (!value || !params[3]) return true;

    var elemValue = $(params[0]).val();
    if (!elemValue) return true;

    value = Number(value);
    elemValue = Number(elemValue);

    switch (params[1]) {
        case "eq":
            return value == elemValue;
        case "lteq":
            return value <= elemValue;
        case "gteq":
            return value >= elemValue;
        case "lt":
            return value < elemValue;
        case "gt":
            return value > elemValue;
        default:
            return true;
    }

}, $.validator.format("{2}"));

//判断时间大小比较 ["input[name='']:eq(0)", "gteq", "结束时间必须大于开始时间", true]
jQuery.validator.addMethod("compareDatetimeTo", function (value, element, params) {

    if (!value || !params[3]) return true;

    var elemValue = $(params[0]).val();
    if (!elemValue) return true;

    value = new Date(value.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));
    elemValue = new Date(elemValue.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3"));

    switch (params[1]) {
        case "eq":
            return value == elemValue;
        case "lteq":
            return value <= elemValue;
        case "gteq":
            return value >= elemValue;
        case "lt":
            return value < elemValue;
        case "gt":
            return value > elemValue;
        default:
            return true;
    }
}, $.validator.format("{2}"));


//扩展 DateEditor 的updateStyle方法
$.ligerui.controls.DateEditor.prototype.updateStyle = function () {
    var g = this, p = this.options;
    //Grid的date默认格式化函数就有对日期的处理
    var v = $.ligerDefaults.Grid.formatters['date'](g.inputText.val(), {format: p.format});
    g.inputText.val(v);
}


/*
 下拉框 combobox
 */

//下拉框 加载文本值(有的时候在数据库只是返回了id值，并没有加载文本值，需要调用这个方法，远程获取)
$.ligerui.controls.ComboBox.prototype.loadText = function (options) {
    var g = this, p = this.options;
    options = $.extend({
        url: '../handler/select.ashx',
        view: null,
        idfield: null,
        textfield: null
    }, options || {});
    var value = options.value || g.getValue();
    var where = {
        op: 'and', rules: [
            {field: options.idfield, op: 'equal', value: value}
        ]
    };
    $.ajax({
        cache: false,
        async: true,
        dataType: 'json', type: 'post',
        url: options.url,
        data: {
            view: options.view,
            idfield: options.idfield,
            textfield: options.textfield,
            where: JSON2.stringify(where)
        },
        success: function (data) {
            if (!data || !data.length) return;
            g._changeValue(data[0]['id'], data[0]['text']);
        }
    });
};
//使下拉框支持 在弹出窗口在选择
$.ligerui.controls.ComboBox.prototype.openSelect = function (options) {
    var g = this, p = this.options;
    options = $.extend({
        title: '选择数据',     //窗口标题
        width: 800,            //窗口宽度
        height: 420,           //窗口高度
        top: null,
        left: null,
        valueField: null,    //接收表格的value字段名
        textField: null,    //接收表格的text字段名
        grid: null,          //表格的参数 同ligerGrid
        form: null            //搜索表单的参数 同ligerForm
    }, options || {});


    //需要指定表格参数
    if (!options.grid) return;

    //三个 ligerui 对象
    var win, grid, form;

    g.bind('beforeOpen', function () {
        show();
        return false;
    });


    function getGridHeight() {
        if (options.grid.height) return options.grid.height;
        var height = options.height - 60;
        if (options.search) {
            height -= 55;
        }
        return height;
    }

    function show() {
        if (win) {
            win.show();
        }
        else {
            var panle = $("<div></div>");
            var formPanle = $("<form></form>");
            var gridPanle = $("<div></div>");

            panle.append(formPanle).append(gridPanle);

            options.grid.width = options.grid.width || "99%";
            options.grid.height = getGridHeight();

            //grid
            grid = gridPanle.ligerGrid(options.grid);

            grid.bind('dblClickRow', function (rowdata) {
                grid.select(rowdata);
                toSelect();
                win.hide();
            });

            //dialog
            win = $.ligerDialog.open({
                title: options.title,
                width: options.width,
                height: options.height,
                top: options.top,
                left: options.left,
                target: panle,
                buttons: [
                    {
                        text: '选择', onclick: function (item, dialog) {
                        toSelect();
                        dialog.hide();
                    }
                    },
                    {
                        text: '取消', onclick: function (item, dialog) {
                        dialog.hide();
                    }
                    }
                ]
            });
            if (options.search) {
                //搜索
                form = formPanle.ligerForm(options.search);
                //搜索按钮、高级搜索按钮
                var containerBtn1 = $('<li style="margin-right:9px"></li>');
                var containerBtn2 = $('<li></li>');
                $("ul:first", formPanle).append(containerBtn1).append(containerBtn2).after('<div class="l-clear"></div>');

                LG.addSearchButtons(formPanle, grid, containerBtn1, containerBtn2);
            }
            else {
                formPanle.remove();
            }
        }
    }


    function toSelect() {
        var selected = grid.selected;
        var appended = false;
        var ids = "", texts = "";
        $(selected).each(function () {
            if (appended) ids += p.split;

            ids += this[options.valueField];

            texts += this[options.textField];

            appended = true;
        });

        g._changeValue(ids, texts);
    }
};
