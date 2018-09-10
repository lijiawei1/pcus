/**
 * jQuery ligerUI 1.3.2
 *
 * http://ligerui.com
 *
 * Author zph 2016
 *
 */
(function ($) {

    $.fn.ligerSearchForm = function (options) {
        return $.ligerui.run.call(this, "ligerSearchForm", arguments);
    };

    $.fn.ligerGetSearchFormManager = function () {
        return $.ligerui.run.call(this, "ligerGetSearchFormManager", arguments);
    };

    $.ligerDefaults.SearchForm = {};

    $.ligerMethos.SearchForm = {};

    $.ligerui.controls.SearchForm = function (element, options) {
        $.ligerui.controls.SearchForm.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.SearchForm.ligerExtend($.ligerui.core.UIComponent, {
        __getType: function () {
            return 'SearchForm';
        },
        __idPrev: function () {
            return 'SearchForm';
        },
        _extendMethods: function () {
            return $.ligerMethos.SearchForm;
        },
        _render: function () {
            var g = this, p = this.options;
            g.searchFormEle = $(this.element);
            g.set(p);

            //初始化表单
            g.searchForm = g.searchFormEle.ligerForm(p);

            //绑定表单组件ID
            p.searchBind = $.extend({}, {
                //搜索框绑定信息
                searchBtnId: "searchBtn",
                searchBtnText: "查询",
                resetBtnId: "resetBtn",
                resetBtnText: "重置",
                bindGridId: "mainGrid",
                defaultFilter: {and:[],or:[]},
                dr: false,
                onAfterSearch:null,
                where: null
            }, p.searchBind);

            g.searchBind = p.searchBind;
            g.mainGridId = p.searchBind.bindGridId;
            g.searchBtnEle = $('#' + p.searchBind.searchBtnId);
            g.resetBtnEle = $('#' + p.searchBind.resetBtnId);

            g.searchBtn = createButton({
                appendTo: g.searchBtnEle,
                width: 80,
                text: p.searchBind.searchBtnText,
                click: function () {
                    //判断是否有其他操作
                    if (g.searchForm.valid()) {
                        //判断是否生成历史查询
                        if(p.historySearch && p.historySearch.formId){
                            g._createHistoryForm(g.searchForm.getData(), true);
                        }
                        //设置表格参数，搜索表格
                        if(g.mainGridId){
                            var mainGrid = liger.get(g.mainGridId),
                                where = null;
                            if (g.searchBind.where) {
                                where = typeof g.searchBind.where === 'function' ? g.searchBind.where.call(g, p, g.searchForm) : g.searchBind.where;
                            } else {
                                where = g.searchForm.getSearchFormData(g.searchBind.dr, g.searchBind.defaultFilter)
                            }
                            //表格查询
                            mainGrid.set('parms', [{name: 'where', value: where}]);
                            mainGrid.changePage('first');
                            mainGrid.loadData();
                        }
                        //触发查询后事件
                        typeof p.searchBind.onAfterSearch === "function" &&  p.searchBind.onAfterSearch.call(this, p);
                    }
                    else {
                        g.searchForm.showInvalid();
                    }
                }
            });

            g.resetBtn = createButton({
                appendTo: g.resetBtnEle,
                width: 80,
                text: p.searchBind.resetBtnText,
                click: function () {
                    g.searchForm.reset();
                    g.mainGridId && liger.get(g.mainGridId).set('parms', [{name: 'where', value: g.searchForm.getSearchFormData(true)}])
                }
            });

            //根据id初始化历史搜索表单
            p.historySearch && g._loadDataFormStorage(p.historySearch.storageId);

            function createButton(options) {
                var p = $.extend({
                    appendTo: $('body')
                }, options || {});
                var btn = $('<div class="" style="width:60px"><span></span></div>');
                if (p.icon) {
                    btn.removeClass("buttonnoicon");
                    btn.append('<div class="button-icon"> <img src="' + p.icon + '" /> </div> ');
                }
                //绿色皮肤
                if (p.green) {
                    btn.removeClass("button2");
                }
                if (p.width) {
                    btn.width(p.width);
                }
                if (p.click) {
                    btn.click(p.click);
                }
                if (p.text) {
                    $("span", btn).html(p.text);
                }
                if (typeof (p.appendTo) == "string") p.appendTo = $(p.appendTo);
                btn.appendTo(p.appendTo);
                return btn;
            }

        },
        _loadDataFormStorage: function (storageId) {
            var g = this, p = this.options;
            var data;
            if(storageId && localStorage){
                data = localStorage.getItem(storageId);
                if(data) {
                    g._currentSearchData = JSON2.parse(data);
                }
            }
            //没有对象存储，使用默认值
            if(!g._currentSearchData) g._currentSearchData = p.historySearch.defaultFields;
            g._currentSearchData && g._createHistoryForm($.extend(true,{},g._currentSearchData), false);
        },
        _saveDataToStorage: function (storageId,data) {
            if(storageId && localStorage){
                localStorage.setItem(storageId,JSON2.stringify(data));   
            }
        },
        _deleteDataFormStorage: function (storageId, name) {
            var data;
            if(storageId && localStorage){
                data = localStorage.getItem(storageId);
                if(data){
                    data = JSON2.parse(data);
                    delete data[name];
                    localStorage.setItem(storageId,JSON2.stringify(data));
                }
            }
        },
        //创建历史搜索表单
        _createHistoryForm: function (searchData,setData) {
            var g = this, p = this.options;
            if(g.historyForm){
                var historyForm = g.historyForm;
                //销毁已有的表单
                liger.remove(historyForm);
                for (var index in historyForm.editors)
                {
                    var control = historyForm.editors[index].control;
                    if (control && control.destroy) control.destroy();
                }
                $(historyForm.element).html("").removeAttr("ligeruiid").removeClass("l-form");
            }
            else{
                g._initHistoryForm();
            }
            //默认配置
            p.historySearch.options.prefixID = p.historySearch.options.prefixID || "hs_";
            //生成表单
            var historyFormOptions = p.historySearch.options;
            historyFormOptions.fields = g._getHistoryFields(searchData);
            //暴露出historyForm
            g.searchForm.historyForm = g.historyForm = $("#" + p.historySearch.formId).ligerForm(historyFormOptions);
            if(setData) g.historyForm.setData(searchData );
            //保存记录
            g._saveDataToStorage(p.historySearch.storageId, g._currentSearchData);
        },
        //首次创建历史搜索表单
        _initHistoryForm: function () {
            var g = this, p = this.options;
            //首次创建，绑定事件
            $("#" + p.historySearch.formId).on("click",".l-history-close",function () {
                var $this = $(this),
                    fieldName = $this.attr("data-name");
                g._hideHistoryField(fieldName,$this.parent().parent().find("input[ligeruiid]:eq(0)").attr("ligeruiid"));
                //从storage里移除
                g._deleteDataFormStorage(p.historySearch.storageId, fieldName);
                delete g._currentSearchData[fieldName];
            });
            //暴露出historySearch方法
            g.searchForm.historySearch = function () {
                var filterForm = this;
                if(filterForm && filterForm.historyForm){
                    //搜索表格
                    if(g.mainGridId){
                        var mainGrid = liger.get(g.mainGridId),
                            where = null;
                        if (g.searchBind.where) {
                            where = typeof g.searchBind.where === 'function' ? g.searchBind.where.call(g, p, g.historyForm) : g.searchBind.where;
                        } else {
                            where = g.historyForm.getSearchFormData(g.searchBind.dr, g.searchBind.defaultFilter)
                        }
                        //表格查询
                        mainGrid.set('parms', [{name: 'where', value: where}]);
                        mainGrid.changePage('first');
                        mainGrid.loadData();
                    }
                    //重置高级搜索表单
                    var searchData = g.historyForm.getData();
                    filterForm.reset();
                    filterForm.setData(searchData);
                }
            }
            //若指定btnid，则绑定事件
            var btnId = p.historySearch.searchBtnId;
            if(btnId){
                $("#" + btnId).on("click",function () {
                    g.searchForm && g.searchForm.historySearch();
                });
            }
        },
        //隐藏已生成的字段，供historyForm使用
        _hideHistoryField: function (fieldName,ligeruiid) {
            var g = this, p = this.options;
            var m = liger.get(ligeruiid);
            if(m){
                if(m.clear) m.clear();
                else if(m.setValue) m.setValue("");
            }
            g.historyForm.setVisible(fieldName, false);
        },
        //通过键值对获得已使用的字段
        _getHistoryFields: function (data) {
            var g = this, p = this.options;
            var fields = [], initFields = g._initFields;

            if(!g._currentSearchData) g._currentSearchData =  {};

            if(!initFields){
                initFields = g._initFields = g._getInitFields(p.fields);
            }

            data = $.extend(true, {}, data, g._currentSearchData);

            for(var name in data){
                if(data[name] || typeof data[name] === "number"){
                    if(initFields[name]){
                        fields.push(initFields[name]);
                        //增加字段到g._currentSearchData
                        g._currentSearchData[name] = true;
                    }
                }
            }

            return fields;
        },
        //将数组形式的字段配置转为对象形式的配置
        _getInitFields: function (fields) {
            var g = this, p = this.options;
            var fieldsObj = {},
                wordWidth = p.historySearch.wordWidth,
                labelWidthDiff = p.historySearch.fieldWidthDiff || 0,
                exFileds = p.historySearch.exFields || {},
                field;
            
            fields = $.extend(true, [], fields);
            
            for(var i = 0, len = fields.length; i < len; i++){
                field = fields[i];
                if(field.name){
                    fieldsObj[field.name] = field;
                    //加上关闭按钮
                    if(!field.afterContent){
                        field.afterContent = '<li class="l-close"><a href="javascript:;" class="l-history-close" data-name="'+ field.name +'">&times;</a></li>';
                    }
                    //定义了wordWidth，覆盖之前的labelWidth
                    if(wordWidth && field.display){
                        field.labelWidth = field.display.length * wordWidth + labelWidthDiff;
                    }
                    //最后加上自定义的属性
                    fields[i] = $.extend(true, field, exFileds[field.name])
                }
            }
            
            return fieldsObj;
        }
    });
    
    //旧写法保留
    $.ligerui.controls.SearchForm.prototype.setEnable = $.ligerui.controls.SearchForm.prototype.setEnabled;
    $.ligerui.controls.SearchForm.prototype.setDisable = $.ligerui.controls.SearchForm.prototype.setDisabled;
})(jQuery);