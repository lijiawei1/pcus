/**
 * jQuery ligerUI 1.3.3
 *
 * http://ligerui.com
 *
 * Author daomi 2015 [ gd_star@163.com ]
 *
 */
(function ($)
{

    $.fn.ligerComboBox = function (options)
    {
        return $.ligerui.run.call(this, "ligerComboBox", arguments);
    };

    $.fn.ligerGetComboBoxManager = function ()
    {
        return $.ligerui.run.call(this, "ligerGetComboBoxManager", arguments);
    };

    $.ligerDefaults.ComboBox = {
        resize: true,           //是否调整大小
        isMultiSelect: false,   //是否多选
        isShowCheckBox: false,  //是否选择复选框
        columns: null,       //表格状态
        width : null,
        selectBoxWidth: null, //宽度
        selectBoxHeight: 120, //高度
        selectBoxPosYDiff : -3, //下拉框位置y坐标调整
        onBeforeSelect: false, //选择前事件
        onAfterShowData : null,
        onSelected: null, //选择值事件
        initValue: null,
        value : null,
        initText: null,
        valueField: 'id',
        textField: 'text',
        dataParmName : null,
        valueFieldID: null,
        ajaxComplete: null,
        ajaxBeforeSend: null,
        ajaxContentType : null,
        slide: false,           //是否以动画的形式显示
        split: ";",
        data: null,
        dataGetter : null,      //下拉框数据集获取函数
        tree: null,            //下拉框以树的形式显示，tree的参数跟LigerTree的参数一致
        treeLeafOnly: true,   //是否只选择叶子
        condition: null,       //列表条件搜索 参数同 ligerForm
        grid: null,              //表格 参数同 ligerGrid
        onStartResize: null,
        onEndResize: null,

        hideOnLoseFocus: false,         //2017-01 鼠标离开下拉列表范围，默认不关闭下拉框
        hideGridOnLoseFocus: false,
        url: null,              //数据源URL(需返回JSON)
        urlParms: null,                     //url带参数
        selectBoxRender: null,       //自定义selectbox的内容
        selectBoxRenderUpdate: null,  //自定义selectbox(发生值改变)
        detailEnabled : true,       //detailUrl是否有效
        detailUrl: null,            //确定选项的时候，使用这个detailUrl加载到详细的数据
        detailPostIdField : null,       //提交数据id字段名
        detailDataParmName:null,       //返回数据data字段名
        detailParms: null,              //附加参数
        detailDataGetter: null,
        delayLoad: false,      //是否延时加载
        triggerToLoad : false, //是否在点击下拉按钮时加载
        emptyText: null,       //空行
        addRowButton: '新增',           //新增按钮
        addRowButtonClick: null,        //新增事件
        triggerIcon: null,         //
        onSuccess: null,
        onBeforeSetData: null,
        onError: null,
        onBeforeOpen: null,      //打开下拉框前事件，可以通过return false来阻止继续操作，利用这个参数可以用来调用其他函数，比如打开一个新窗口来选择值
        onButtonClick: null,      //右侧图标按钮事件，可以通过return false来阻止继续操作，利用这个参数可以用来调用其他函数，比如打开一个新窗口来选择值
        onTextBoxKeyDown: null,
        onTextBoxKeyEnter : null,
        render: null,            //文本框显示html函数
        absolute: true,         //选择框是否在附加到body,并绝对定位
        cancelable: true,      //可取消选择
        css: null,            //附加css
        parms: null,         //ajax提交表单
        renderItem: null,   //选项自定义函数
        autocomplete: false,  //自动完成
        autocompleteKeyField: null, // 自动搜索的字段
        autocompleteAllowEmpty: true, //是否允许空值搜索
        isTextBoxMode : false,     //是否文本框的形式
        textAsValue: false, //2016-12-06 getValue获得的是否是文本框的值
        highLight: false,    //自动完成是否匹配字符高亮显示
        readonly: false,              //是否只读
        ajaxType: 'post',
        alwayShowInTop: false,      //下拉框是否一直显示在上方
        alwayShowInDown: false,      //下拉框是否一直显示在上方
        valueFieldCssClass: null,
        isRowReadOnly: null,        //选项是否只读的判定函数
        rowClsRender: null,       //选项行 class name 自定义函数
        keySupport: false,              //按键支持： 上、下、回车 支
        initIsTriggerEvent: false,      //初始化时是否触发选择事件
        conditionSearchClick: null,      //下拉框表格搜索按钮自定义函数
        onChangeValue: null,
        delayLoadGrid: true,       //是否在按下显示下拉框的时候才 加载 grid
        setTextBySource : true,       //设置文本框值时是否从数据源中加载
        alwaysshow: false,              // 始终展示
        beforeChange: null              // 修改值之前
    };

    $.ligerDefaults.ComboBoxString = {
        Search: "搜索"
    };

    //扩展方法
    $.ligerMethos.ComboBox = $.ligerMethos.ComboBox || {};


    $.ligerui.controls.ComboBox = function (element, options)
    {
        $.ligerui.controls.ComboBox.base.constructor.call(this, element, options);
    };
    $.ligerui.controls.ComboBox.ligerExtend($.ligerui.controls.Input, {
        __getType: function ()
        {
            return 'ComboBox';
        },
        _extendMethods: function ()
        {
            return $.ligerMethos.ComboBox;
        },
        _init: function ()
        {
            $.ligerui.controls.ComboBox.base._init.call(this);
            var p = this.options;
            if (p.columns)
            {
                p.isShowCheckBox = true;
            }
            if (p.isMultiSelect)
            {
                p.isShowCheckBox = true;
            }
            if (p.triggerToLoad)
            {
                p.delayLoad = true;
            }
            if (p.autocomplete && !p.autocompleteKeyField) {
                p.autocompleteKeyField = p.textField;
            }
        },
        _render: function ()
        {
            var g = this, p = this.options;
            g.data = p.data;
            g.inputText = null;
            g.select = null;
            g.textFieldID = "";
            g.valueFieldID = "";
            g.valueField = null; //隐藏域(保存值)
            var $this = $(this.element);
            $this.attr('autocomplete', 'off');
            /**
             * 2016-10-24 猜想这个if是用来判断输入框类型是否是hidden的，而不是整个输入框是否隐藏
             * */
            if ($this.attr("type")==="hidden")
            //if ($this.is(":hidden"))
            {
                g.valueField = $this;

                g.textFieldID = p.textFieldID || (this.element.id + "_txt");
                g.inputText = $('<input type="text" readonly="true"/>');
                g.inputText.attr("id", g.textFieldID).insertAfter($this);

                if (g.valueField.attr("validate"))
                {
                    g.inputText.attr("validate", g.valueField.attr("validate"));
                    g.valueField.removeAttr("validate");
                }
                if (g.valueField.attr("validateMessage"))
                {
                    g.inputText.attr("validateMessage", g.valueField.attr("validateMessage"));
                    g.valueField.removeAttr("validateMessage");
                }
            }
            else if (this.element.tagName.toLowerCase() == "input")
            {
                this.element.readOnly = true;
                g.inputText = $this;
                g.textFieldID = this.element.id;
            }
            else if (this.element.tagName.toLowerCase() == "select")
            {
                $this.hide();
                g.select = $this;
                p.isMultiSelect = false;
                p.isShowCheckBox = false;
                p.cancelable = false;
                g.textFieldID = p.textFieldID || (this.element.id + "_txt");
                g.inputText = $('<input type="text" readonly="true"/>');
                g.inputText.attr("id", g.textFieldID).insertAfter($this);


                if (g.select.attr("validate"))
                {
                    g.inputText.attr("validate", g.select.attr("validate"));
                    g.select.removeAttr("validate");
                }
                if (g.select.attr("validateMessage"))
                {
                    g.inputText.attr("validateMessage", g.select.attr("validateMessage"));
                    g.select.removeAttr("validateMessage");
                }
                if (!p.value && this.element.value)
                {
                    p.value = this.element.value;
                }

            }
            if (g.inputText[0].name == undefined) g.inputText[0].name = g.textFieldID;

            g.inputText.attr("data-comboboxid", g.id);

            if (g.valueField == null)
            {
                if (p.valueFieldID)
                {
                    g.valueField = $("#" + p.valueFieldID + ":input,[name=" + p.valueFieldID + "]:input").filter("input:hidden");
                    if (g.valueField.length == 0) g.valueField = $('<input type="hidden"/>');
                    g.valueField[0].id = g.valueField[0].name = p.valueFieldID;
                }
                else
                {
                    g.valueField = $('<input type="hidden"/>');
                    g.valueField[0].id = g.valueField[0].name = g.textFieldID + "_val";
                }
            }
            if (p.valueFieldCssClass)
            {
                g.valueField.addClass(p.valueFieldCssClass);
            }
            if (g.valueField[0].name == undefined) g.valueField[0].name = g.valueField[0].id;
            //update by superzoc 增加初始值
            if (p.initValue != null) g.valueField[0].value = p.initValue;
            g.valueField.attr("data-ligerid", g.id);
            //开关
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');
            if (p.triggerIcon) g.link.find("div:first").addClass(p.triggerIcon);
            //下拉框
            g.selectBox = $('<div class="l-box-select" style="display:none"><div class="l-box-select-inner"><table cellpadding="0" cellspacing="0" border="0" class="l-box-select-table"></table></div></div>');
            g.selectBox.table = $("table:first", g.selectBox);
            g.selectBoxInner = g.selectBox.find(".l-box-select-inner:first");
            //外层
            g.wrapper = g.inputText.wrap('<div class="l-text l-text-combobox"></div>').parent();
            g.wrapper.append('<div class="l-text-l"></div><div class="l-text-r"></div>');
            g.wrapper.append(g.link);
            //添加个包裹，
            g.textwrapper = g.wrapper.wrap('<div class="l-text-wrapper"></div>').parent();

            if (p.absolute)
                g.selectBox.appendTo('body').addClass("l-box-select-absolute");
            else
                g.textwrapper.append(g.selectBox);

            g.textwrapper.append(g.valueField);
            g.inputText.addClass("l-text-field");
            if (p.isShowCheckBox && !g.select) {
                $("table", g.selectBox).addClass("l-table-checkbox");
            } else {
                p.isShowCheckBox = false;
                $("table", g.selectBox).addClass("l-table-nocheckbox");
            }
            //开关 事件
            g.link.hover(function () {
                if (p.disabled || p.readonly) return;
                this.className = "l-trigger-hover";
            }, function ()
            {
                if (p.disabled || p.readonly) return;
                this.className = "l-trigger";
            }).mousedown(function ()
            {
                if (p.disabled || p.readonly) return;
                this.className = "l-trigger-pressed";
            }).mouseup(function ()
            {
                if (p.disabled || p.readonly) return;
                this.className = "l-trigger-hover";
            }).click(function ()
            {
                if (p.disabled || p.readonly) return;
                if (g.trigger('buttonClick') == false) return false;
                if (g.trigger('beforeOpen') == false) return false;
                if (p.triggerToLoad && !g.triggerLoaded)
                {
                    g.triggerLoaded = true;
                    g._setUrl(p.url, function ()
                    {
                        g._toggleSelectBox(g.selectBox.is(":visible"));
                    });
                } else
                {
                    g._toggleSelectBox(g.selectBox.is(":visible"));
                }
            });
            g.inputText.click(function ()
            {
                if (p.disabled || p.readonly) return;
                if (g.trigger('beforeOpen') == false) return false;
                if (!p.autocomplete)
                {
                    if (p.triggerToLoad && !g.triggerLoaded)
                    {
                        g.triggerLoaded = true;
                        g._setUrl(p.url, function ()
                        {
                            g._toggleSelectBox(g.selectBox.is(":visible"));
                        });
                    } else
                    {
                        g._toggleSelectBox(g.selectBox.is(":visible"));
                    }
                } else
                {
                    g.updateSelectBoxPosition();
                }
            }).blur(function ()
            {
                if (p.disabled) return;
                /**
                 * 2017-03-01 新增onblur事件
                 * */
                g.trigger('blur', [this.value]);
                g.wrapper.removeClass("l-text-focus");
            }).focus(function ()
            {
                if (p.disabled || p.readonly) return;
                g.wrapper.addClass("l-text-focus");
            }).change(function ()
            {
                g.trigger('changeValue', [this.value]);
            });
            g.wrapper.hover(function ()
            {
                if (p.disabled || p.readonly) return;
                g.wrapper.addClass("l-text-over");
            }, function ()
            {
                if (p.disabled || p.readonly) return;
                g.wrapper.removeClass("l-text-over");
            });
            g.resizing = false;
            g.selectBox.hover(null, function (e)
            {
                if (p.hideOnLoseFocus && g.selectBox.is(":visible") && !g.boxToggling && !g.resizing)
                {
                    g._toggleSelectBox(true);
                }
            });
            //下拉框内容初始化
            g.bulidContent();

            g.set(p, null, "init");
            //下拉框宽度、高度初始化
            if (p.selectBoxWidth)
            {
                g.selectBox.width(p.selectBoxWidth);
            }
            else
            {
                g.selectBox.css('width', g.wrapper.css('width'));
            }
            if (p.grid)
            {
                if (p.delayLoadGrid)
                {
                    g.bind('show', function () {
                        bindGrid()
                    });
                } else {
                    bindGrid()
                }
            }
            g.updateSelectBoxPosition();
            // 因为没办法全部绑定所以每次生成combobox都会全局绑定一次
            $(document).on("click.combobox", function (e){
                var box = g.selectBox,
                    $thisb = $((e.target || e.srcElement));
                if ( box.is(":visible") &&  $thisb.closest(".l-box-select, .l-text-combobox,.l-button").length == 0) {
                    g._toggleSelectBox(true);
                }
            });

            function bindGrid(){
                if (!g.grid) {
                    g.setGrid(p.grid);
                    g.set('SelectBoxHeight', p.selectBoxHeight);
                }
            }
        },
        destroy: function ()
        {
            if (this.wrapper) this.wrapper.remove();
            if (this.selectBox) this.selectBox.remove();
            this.options = null;
            $.ligerui.remove(this);
        },
        clear: function ()
        {
            /**
             * 2016-10-27 自动完成相关
             * */
            var g = this, p = this.options;
            this._changeValue("", "");
            $("a.l-checkbox-checked", this.selectBox).removeClass("l-checkbox-checked");
            $("td.l-selected", this.selectBox).removeClass("l-selected");
            $(":checkbox", this.selectBox).each(function () { this.checked = false; });
            this.trigger('clear');
            //2016-10-27
            if (g.loadedData && p.autocomplete) {
                //如果是本地数据和自动完成
                this._updateInput();
            }
        },
        _setSelectBoxHeight: function (height)
        {
            if (!height) return;
            var g = this, p = this.options;
            if (p.grid)
            {
                g.grid && g.grid.set('height', g.getGridHeight(height));
            } else if (!p.tree)
            {
                var itemsleng = $("tr", g.selectBox.table).length;
                if (!p.selectBoxHeight && itemsleng < 8) p.selectBoxHeight = itemsleng * 30;
                if (p.selectBoxHeight)
                {
                    if (itemsleng < 8)
                    {
                        g.selectBoxInner.height('auto');
                    } else
                    {
                        g.selectBoxInner.height(p.selectBoxHeight);
                    }
                }
            } else
            {
                g.selectBoxInner.height(p.selectBoxHeight);
            }
        },
        _setCss: function (css)
        {
            if (css)
            {
                this.wrapper.addClass(css);
            }
        },
        //取消选择
        _setCancelable: function (value)
        {
            var g = this, p = this.options;
            if (!value && g.unselect)
            {
                g.unselect.remove();
                g.unselect = null;
            }
            if (!value && !g.unselect) return;
            g.unselect = $('<div class="l-trigger l-trigger-cancel"><div class="l-trigger-icon"></div></div>').hide();
            g.wrapper.hover(function ()
            {
                g.unselect.show();
            }, function ()
            {
                g.unselect.hide();
            })
            if (!p.disabled && !p.readonly && p.cancelable)
            {
                g.wrapper.append(g.unselect);
            }
            g.unselect.hover(function ()
            {
                this.className = "l-trigger-hover l-trigger-cancel";
            }, function ()
            {
                this.className = "l-trigger l-trigger-cancel";
            }).click(function ()
            {
                g.clear();
            });
        },
        _setDisabled: function (value)
        {
            //禁用样式
            if (value)
            {
                this.wrapper.addClass('l-text-disabled');
            } else
            {
                this.wrapper.removeClass('l-text-disabled');
            }
        },
        _setReadonly: function (readonly)
        {
            if (readonly) {
                this.wrapper.addClass("l-text-readonly");
                this.inputText.attr('readonly', 'true')
            }
            else {
                this.wrapper.removeClass("l-text-readonly");
                this.inputText.removeAttr('readonly')
            }
        },
        _setLable: function (label)
        {
            var g = this, p = this.options;
            if (label)
            {
                if (g.labelwrapper)
                {
                    g.labelwrapper.find(".l-text-label:first").html(label + ':&nbsp');
                }
                else
                {
                    g.labelwrapper = g.textwrapper.wrap('<div class="l-labeltext"></div>').parent();
                    g.labelwrapper.prepend('<div class="l-text-label" style="float:left;display:inline;">' + label + ':&nbsp</div>');
                    g.textwrapper.css('float', 'left');
                }
                if (!p.labelWidth)
                {
                    p.labelWidth = $('.l-text-label', g.labelwrapper).outerWidth();
                }
                else
                {
                    $('.l-text-label', g.labelwrapper).outerWidth(p.labelWidth);
                }
                $('.l-text-label', g.labelwrapper).width(p.labelWidth);
                $('.l-text-label', g.labelwrapper).height(g.wrapper.height());
                g.labelwrapper.append('<br style="clear:both;" />');
                if (p.labelAlign)
                {
                    $('.l-text-label', g.labelwrapper).css('text-align', p.labelAlign);
                }
                g.textwrapper.css({ display: 'inline' });
                g.labelwrapper.width(g.wrapper.outerWidth() + p.labelWidth + 2);
            }
        },
        _setWidth: function (value)
        {
            var g = this, p = this.options;
            if (value > 20)
            {
                g.wrapper.css({ width: value });
                g.inputText.css({ width: value - 20 });
                if (!p.selectBoxWidth)
                {
                    g.selectBox.css({ width: value });
                }
            }
        },
        _setHeight: function (value)
        {
            var g = this;
            if (value > 10)
            {
                g.wrapper.height(value);
                g.inputText.height(value - 2);
            }
        },
        _setResize: function (resize)
        {
            var g = this, p = this.options;
            if (p.columns)
            {
                return;
            }
            //调整大小支持
            if (resize && $.fn.ligerResizable)
            {
                var handles = p.selectBoxHeight ? 'e' : 'se,s,e';
                g.selectBox.ligerResizable({
                    handles: handles, onStartResize: function ()
                    {
                        g.resizing = true;
                        g.trigger('startResize');
                    }, onEndResize: function ()
                    {
                        g.resizing = false;
                        if (g.trigger('endResize') == false)
                            return false;
                    }, onStopResize: function (current, e)
                    {
                        if (g.grid)
                        {
                            if (current.newWidth)
                            {
                                g.selectBox.width(current.newWidth);
                            }
                            if (current.newHeight)
                            {
                                g.set({ selectBoxHeight: current.newHeight });
                            }
                            g.grid.refreshSize();
                            g.trigger('endResize');
                            return false;
                        }
                        return true;
                    }
                });
                g.selectBox.append("<div class='l-btn-nw-drop'></div>");
            }
        },
        //查找Text,适用多选和单选
        findTextByValue: function (value)
        {
            var g = this, p = this.options;
            if (value == null) return "";
            var texts = "";
            var contain = function (checkvalue)
            {
                var targetdata = value.toString().split(p.split);
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue && targetdata[i] != "") return true;
                }
                return false;
            };
            //当combobox下拉一个grid时, 不能直接取data. 必须取grid的data.
            //原写法$(g.data) 仅适用于无grid时的典型情形
            /**
             * 2016-11-08 下拉表格：g.options.grid.data->g.grid.data
             * */
            var d;
            if (g.options.grid && g.options.grid.data)
                d = g.options.grid.data.Rows;
            else if(g.options.grid && g.grid && g.grid.data)
                d = g.grid.data.Rows;
            else
                d = g.data;
            $(d).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(val))
                {
                    texts += txt + p.split;
                }
            });
            if (texts.length > 0) texts = texts.substr(0, texts.length - 1);
            return texts;
        },
        //查找Value,适用多选和单选
        findValueByText: function (text)
        {
            var g = this, p = this.options;
            if (!text && text == "") return "";
            var contain = function (checkvalue)
            {
                var targetdata = text.toString().split(p.split);
                for (var i = 0; i < targetdata.length; i++)
                {
                    if (targetdata[i] == checkvalue) return true;
                }
                return false;
            };
            var values = "";
            $(g.data).each(function (i, item)
            {
                var val = item[p.valueField];
                var txt = item[p.textField];
                if (contain(txt))
                {
                    values += val + p.split;
                }
            });
            if (values.length > 0) values = values.substr(0, values.length - 1);
            return values;
        },
        insertItem: function (data, index)
        {
            var g = this, p = this.options;
            g.data = g.data || [];
            g.data.splice(index, 0, data);
            g.setData(g.data);
        },
        addItem: function (data)
        {
            var g = this, p = this.options;
            g.insertItem(data, (g.data || []).length);
        },
        _setIsTextBoxMode : function(value){
            var g = this, p = this.options;
            /**
             * 2017-01-18 当主动设为readonly时，不能移除readonly属性
             * */
            if (value && !p.readonly)
            {
                g.inputText.removeAttr("readonly");
            }
        },
        _setValue: function (value, text)
        {
            var g = this, p = this.options;
            var isInit = false, isTriggerEvent = true;
            if (text == "init") {
                text = null;
                isInit = true;
                isTriggerEvent = p.initIsTriggerEvent ? true : false;
            }
            // 2016-12-07 设置值时也要考虑textAsValue属性
            if (p.isTextBoxMode || p.textAsValue) {
                text = value;
            }
            else {
                text = text || g.findTextByValue(value);
            }

            if (p.tree) {
                //刷新树的选中状态
                setTimeout(function () {
                    if (p.setTextBySource) {
                        //刷新树的选中状态并更新文本框
                        g.selectValueByTree(value);
                    }
                    else {
                        g.treeSelectInit(value);
                    }
                }, 100);
            }
            else if (!p.isMultiSelect) {
                g._changeValue(value, text, isTriggerEvent);
                $("tr[value='" + value + "'] td", g.selectBox).addClass("l-selected");
                $("tr[value!='" + value + "'] td", g.selectBox).removeClass("l-selected");
            }
            else {
                g._changeValue(value, text, isTriggerEvent);

                /**
                 * 2016-11-04 更改当value为空（null，undefined，""）时，多选下拉框的处理方式
                 * */
                    //if (value != null)
                    //{
                var targetdata = value && value.toString().split(p.split) || [];
                /**
                 * 2016-11-08 考虑下拉框是表格的情况
                 * */
                var contain = function (checkvalue)
                {
                    for (var i = 0 ,len = targetdata.length ; i < len; i++)
                    {
                        if (targetdata[i] == checkvalue && targetdata[i] != "") return true;
                    }
                    return false;
                };
                if(p.grid){
                    if(p.grid.checkbox && g.grid){
                        var gridManager = g.grid;
                        //清除已有选择
                        //gridManager.trigger("UnCheckAllRow");
                        var selectedArr=gridManager.getSelectedRows();
                        for(var i = 0 , len =selectedArr.length; i <len; i++){
                            gridManager.unselect(selectedArr[i]);
                        }
                        //清除selecteds
                        gridManager.trigger("clearSelecteds");
                        //选择现在的值
                        var gridRows = gridManager.data.Rows;
                        i=0;
                        len=gridRows.length;
                        for(; i <len; i++){
                            if(contain(gridRows[i][p.valueField])){
                                gridManager.select(gridRows[i]);
                                //将选择的值存入selecteds
                                gridManager.trigger("toggleSelected",[true,gridRows[i]]);
                            }
                        }
                    }
                }
                else{
                    $("table.l-table-checkbox :checkbox", g.selectBox).each(function () {
                        /**
                         * 2016-08-26 修复设值后选中框样式
                         */
                        $(this.previousSibling).removeClass("l-checkbox-checked");
                        this.checked = false;
                    });
                    for (var i = 0; i < targetdata.length; i++)
                    {
                        /**
                         * 2016-12-21 给属性值加个引号
                         * */
                        $("table.l-table-checkbox tr[value='" + targetdata[i] + "'] :checkbox", g.selectBox).each(function () {
                            /**
                             * 2016-08-26
                             * 修复设值后选中框样式
                             */
                            $(this.previousSibling).addClass("l-checkbox-checked");
                            this.checked = true;
                        });
                    }
                }

                //}
                //2016-11-04 以上
            }
            if (p.selectBoxRenderUpdate)
            {
                p.selectBoxRenderUpdate.call(g, {
                    selectBox: g.selectBox,
                    value: value,
                    text: text
                });
            }
        },
        selectValue: function (value)
        {
            this._setValue(value);
        },
        bulidContent: function ()
        {
            var g = this, p = this.options;
            this.clearContent();
            if (g.select)
            {
                g.setSelect();
            }
            else if (p.tree)
            {
                g.setTree(p.tree);
            }
        },
        reload: function ()
        {
            var g = this, p = this.options;
            if (p.url)
            {
                g.set('url', p.url);
            }
            else if (g.grid)
            {
                g.grid.reload();
            }
        },
        _setUrl: function (url,callback)
        {
            if (!url) return;
            var g = this, p = this.options;
            if (p.readonly) //只读状态不加载数据
            {
                return;
            }
            if (p.delayLoad && !g.isAccessDelay && !g.triggerLoaded)
            {
                g.isAccessDelay = true;//已经有一次延时加载了
                return;
            }
            url = $.isFunction(url) ? url.call(g) : url;
            var urlParms = $.isFunction(p.urlParms) ? p.urlParms.call(g) : p.urlParms;
            if (urlParms)
            {
                for (name in urlParms)
                {
                    url += url.indexOf('?') == -1 ? "?" : "&";
                    url += name + "=" + urlParms[name];
                }
            }
            var parms = $.isFunction(p.parms) ? p.parms.call(g) : p.parms;
            if (p.ajaxContentType == "application/json" && typeof (parms) != "string")
            {
                parms = liger.toJSON(parms);
            }
            var ajaxOp = {
                type: p.ajaxType,
                url: url,
                data: parms,
                cache: false,
                dataType: 'json',
                beforeSend: p.ajaxBeforeSend,
                complete: p.ajaxComplete,
                success: function (result)
                {
                    var data = $.isFunction(p.dataGetter) ? data = p.dataGetter.call(g, result) : result;
                    data = p.dataParmName && data ? data[p.dataParmName] : data;
                    if (g.trigger('beforeSetData', [data]) == false)
                    {
                        return;
                    }
                    g.setData(data);
                    g.trigger('success', [data]);
                    if ($.isFunction(callback)) callback(data);
                },
                error: function (XMLHttpRequest, textStatus)
                {
                    g.trigger('error', [XMLHttpRequest, textStatus]);
                }
            };
            if (p.ajaxContentType)
            {
                ajaxOp.contentType = p.ajaxContentType;
            }
            $.ajax(ajaxOp);
        },
        setUrl: function (url,callback)
        {
            return this._setUrl(url, callback);
        },
        setParm: function (name, value)
        {
            if (!name) return;
            var g = this;
            var parms = g.get('parms');
            if (!parms) parms = {};
            parms[name] = value;
            g.set('parms', parms);
        },
        clearContent: function ()
        {
            var g = this, p = this.options;
            if (!g) return;
            $("table", g.selectBox).html("");
            if (!g) return;
            //清除下拉框内容的时候重设高度
            g._setSelectBoxHeight(p.selectBoxHeight);
            //modify end
            //g.inputText.val("");
            //g.valueField.val("");
        },
        setSelect: function ()
        {
            var g = this, p = this.options;
            this.clearContent();
            g.data = [];
            $('option', g.select).each(function (i)
            {
                var val = $(this).val();
                var txt = $(this).html();
                g.data.push({
                    text: txt,
                    id: val
                });
                var tr = $("<tr><td index='" + i + "' value='" + val + "' text='" + txt + "'>" + txt + "</td>");
                $("table.l-table-nocheckbox", g.selectBox).append(tr);

                $("td", tr).hover(function ()
                {
                    $(this).addClass("l-over").siblings("td").removeClass("l-over");
                }, function ()
                {
                    $(this).removeClass("l-over");
                });
            });
            $('td:eq(' + g.select[0].selectedIndex + ')', g.selectBox).each(function ()
            {
                if ($(this).hasClass("l-selected"))
                {
                    g.selectBox.hide();
                    return;
                }
                $(".l-selected", g.selectBox).removeClass("l-selected");
                $(this).addClass("l-selected");
                if (g.select[0].selectedIndex != $(this).attr('index') && g.select[0].onchange)
                {
                    g.select[0].selectedIndex = $(this).attr('index'); g.select[0].onchange();
                }
                var newIndex = parseInt($(this).attr('index'));
                g.select[0].selectedIndex = newIndex;
                g.select.trigger("change");
                g.selectBox.hide();
                var value = $(this).attr("value");
                var text = $(this).html();
                if (p.render)
                {
                    g.inputText.val(p.render(value, text));
                }
                else
                {
                    g.inputText.val(text);
                }
            });
            g._addClickEven();
        },
        /**
         * 2016-10-31 自动完成相关，增加load参数，指示是否重新设置loadedData
         * */
        _setData: function (data,load)
        {
            this.setData(data,load);
        },
        getRowIndex : function(value)
        {
            var g = this, p = this.options;
            if (!value) return -1;
            if (!g.data || !g.data.length) return -1;
            for (var i = 0; i < g.data.length; i++)
            {
                if (g.data[i] == null) continue;
                var val = g.data[i][p.valueField];
                if (val == value) return i;
            }
            return -1;
        },
        //获取行数据
        getRow : function(value)
        {
            var g = this, p = this.options;
            if (!value) return null;
            if (!g.data || !g.data.length) return null;
            for (var i = 0; i < g.data.length; i++)
            {
                if (g.data[i] == null) continue;
                var val = g.data[i][p.valueField];
                if (val == value) return g.data[i];
            }
            return null;
        },
        /**
         * 2016-10-31 自动完成相关，增加load参数，指示是否重新设置loadedData
         * */
        setData: function (data,load)
        {
            var g = this, p = this.options;
            if (g.select) return;
            if (!p) {
                return false;
            }
            if (p.selectBoxRender) {
                p.selectBoxRender.call(g, {
                    selectBox: g.selectBox,
                    data : data
                });
                return;
            }
            if (!data || !data.length) data = [];
            if (g.data != data) g.data = data;
            g.data = $.isFunction(g.data) ? g.data() : g.data;
            // 加入了一个新事件
            if (g.trigger('beforeShowData', [data]) === false) {
                return false;
            }
            this.clearContent();
            if (p.columns) {
                g.selectBox.table.headrow = $("<tr class='l-table-headerow'><td width='18px'></td></tr>");
                g.selectBox.table.append(g.selectBox.table.headrow);
                g.selectBox.table.addClass("l-box-select-grid");
                for (var j = 0; j < p.columns.length; j++)
                {
                    var headrow = $("<td columnindex='" + j + "' columnname='" + p.columns[j].name + "'>" + p.columns[j].header + "</td>");
                    if (p.columns[j].width)
                    {
                        headrow.width(p.columns[j].width);
                    }
                    g.selectBox.table.headrow.append(headrow);

                }
            }
            var out = [];
            if (p.emptyText) {
                g.emptyRow = {};
                g.emptyRow[p.textField] = p.emptyText;
                g.emptyRow[p.valueField] = p.emptyValue != undefined ? p.emptyValue : "";
                data.splice(0, 0, g.emptyRow);
            }
            for (var i = 0; i < data.length; i++)  {
                var val = data[i][p.valueField];
                var txt = data[i][p.textField];
                var isRowReadOnly = $.isFunction(p.isRowReadOnly) ? p.isRowReadOnly(data[i]) : false;
                if (!p.columns) {
                    out.push("<tr value='" + val + "'");

                    var cls = [];
                    if (isRowReadOnly) cls.push(" rowreadonly ");
                    if ($.isFunction(p.rowClsRender)) cls.push(p.rowClsRender(data[i]));
                    if (cls.length) {
                        out.push(" class='");
                        out.push(cls.join(''));
                        out.push("'");
                    }
                    out.push(">");
                    if (p.isShowCheckBox) {
                        out.push("<td style='width:18px;'  index='" + i + "' value='" + val + "' text='" + txt + "' ><input type='checkbox' /></td>");
                    }
                    var itemHtml = txt;
                    if (p.renderItem)  {
                        itemHtml = p.renderItem.call(g, {
                            data: data[i],
                            value: val,
                            text: txt,
                            key: g.inputText.val()
                        });
                    } else if (p.autocomplete && p.highLight)
                    {
                        itemHtml = g._highLight(txt, g.inputText.val());
                    } else
                    {
                        itemHtml = "<span>" + itemHtml + "</span>";
                    }
                    out.push("<td index='" + i + "' value='" + val + "' text='" + txt + "' align='left'>" + itemHtml + "</td></tr>");
                }
                else {
                    out.push("<tr value='" + val + "'");
                    if (isRowReadOnly) out.push(" class='rowreadonly'");
                    out.push(">");
                    out.push("<td style='width:18px;'  index='" + i + "' value='" + val + "' text='" + txt + "' ><input type='checkbox' /></td>");
                    for (var j = 0; j < p.columns.length; j++)
                    {
                        var columnname = p.columns[j].name;
                        out.push("<td>" + data[i][columnname] + "</td>");
                    }
                    out.push('</tr>');
                }
            }
            if (!p.columns) {
                if (p.isShowCheckBox)
                {
                    $("table.l-table-checkbox", g.selectBox).append(out.join(''));
                } else
                {
                    $("table.l-table-nocheckbox", g.selectBox).append(out.join(''));
                }
            }
            else {
                g.selectBox.table.append(out.join(''));
            }
            if (p.addRowButton && p.addRowButtonClick && !g.addRowButton) {
                g.addRowButton = $('<div class="l-box-select-add"><a href="javascript:void(0)" class="link"><div class="icon"></div></a></div>');
                g.addRowButton.find(".link").append(p.addRowButton).click(p.addRowButtonClick);
                g.selectBoxInner.after(g.addRowButton);
            }
            g.set('selectBoxHeight', p.selectBoxHeight);
            //自定义复选框支持
            if (p.isShowCheckBox && $.fn.ligerCheckBox) {
                $("table input:checkbox", g.selectBox).ligerCheckBox();
            }
            $(".l-table-checkbox input:checkbox", g.selectBox).change(function () {
                if (this.checked && g.hasBind('beforeSelect')) {
                    var parentTD = null;
                    if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = $(this).parent().parent();
                    } else
                    {
                        parentTD = $(this).parent();
                    }
                    if (parentTD != null && g.trigger('beforeSelect', [parentTD.attr("value"), parentTD.attr("text")]) == false)
                    {
                        g.selectBox.slideToggle("fast");
                        return false;
                    }
                }
                if (!p.isMultiSelect)
                {
                    if (this.checked)
                    {
                        $("input:checked", g.selectBox).not(this).each(function ()
                        {
                            this.checked = false;
                            $(".l-checkbox-checked", $(this).parent()).removeClass("l-checkbox-checked");
                        });
                        g.selectBox.slideToggle("fast");
                    }
                }
                g._checkboxUpdateValue();
            });
            $("table.l-table-nocheckbox td", g.selectBox).hover(function () {
                if (!$(this).parent().hasClass("rowreadonly"))
                {
                    $(this).addClass("l-over");
                }
            }, function () {
                $(this).removeClass("l-over");
            });
            g._addClickEven();
            //选择项初始化
            if (!p.autocomplete)
            {
                g.updateStyle();
            }
            /**
             * 2017-01-17 重新设置了列表要更新位置
             * */
            g.updateSelectBoxPosition(true);

            /**
             * 2016-10-27 自动完成相关
             * */
            //缓存数据
            if (!g.loadedData || g.loadedData.length == 0 || (typeof load !== "boolean") || load !== false) {
                g.loadedData = data;
            }

            g.trigger('afterShowData', [data]);
        },
        //树
        setTree: function (tree)
        {
            var g = this, p = this.options;
            this.clearContent();
            g.selectBox.table.remove();
            if (tree.checkbox != false)
            {
                tree.onCheck = function ()
                {
                    var nodes = g.treeManager.getChecked();
                    var value = [];
                    var text = [];
                    $(nodes).each(function (i, node)
                    {
                        if (p.treeLeafOnly && node.data.children) return;
                        value.push(node.data[p.valueField]);
                        text.push(node.data[p.textField]);
                    });
                    g._changeValue(value.join(p.split), text.join(p.split), true);
                };
            }
            else
            {
                tree.onSelect = function (node)
                {
                    if (g.trigger('BeforeSelect',[node]) == false) return;
                    if (p.treeLeafOnly && node.data.children) return;
                    var value = node.data[p.valueField];
                    var text = node.data[p.textField];
                    g._changeValue(value, text,true);
                    g.selectBox.hide();
                };
                tree.onCancelSelect = function (node)
                {
                    g._changeValue("", "", true);
                };
            }
            tree.onAfterAppend = function (domnode, nodedata)
            {
                if (!g.treeManager) return;
                var value = null;
                if (p.initValue) value = p.initValue;
                else if (g.valueField.val() != "") value = g.valueField.val();
                g.selectValueByTree(value);
            };
            g.tree = $("<ul></ul>");
            $("div:first", g.selectBox).append(g.tree);
            //新增下拉框中获取树对象的接口
            g.innerTree = g.tree.ligerTree(tree);
            g.treeManager = g.tree.ligerGetTreeManager();
        },
        //新增下拉框中获取树对象的接口
        getTree: function ()
        {
            return this.innerTree;
        },
        selectValueByTree: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = g.treeSelectInit(value);

                g._changeValue(value, text, p.initIsTriggerEvent);
            }
        },
        //Tree选择状态初始化
        treeSelectInit: function (value)
        {
            var g = this, p = this.options;
            if (value != null)
            {
                var text = "";
                var valuelist = value.toString().split(p.split);
                $(valuelist).each(function (i, item)
                {
                    g.treeManager.selectNode(item.toString(), false);
                    text += g.treeManager.getTextByID(item);
                    if (i < valuelist.length - 1) text += p.split;
                });
                return text;
            }
        },
        //表格
        setGrid: function (grid) {
            // 更改一个表格展示方式。
            var g = this, p = this.options;
            if (g.grid) return;
            p.hideOnLoseFocus = p.hideGridOnLoseFocus ? true : false;
            this.clearContent();
            g.selectBox.addClass("l-box-select-lookup");
            g.selectBox.table.remove();
            var panel = $("div:first", g.selectBox);
            var girdOptions = $.extend({
                columnWidth: 120,
                alternatingRow: false,
                frozen: true,
                rownumbers: true,
                allowUnSelectRow: true
            }, grid, {
                width: "100%",
                height: g.getGridHeight(),
                inWindow: false,
                parms: p.parms,
                isChecked: function(rowdata) {
                    var value = g.getValue();
                    if (!value) return false;
                    if (!p.valueField || !rowdata[p.valueField]) return false;
                    return $.inArray(rowdata[p.valueField].toString(), value.split(p.split)) != -1;
                }
            });

            g.grid = g.gridManager = $('<div id="' + this.textFieldID + 'FieldGrid"></div>').ligerGrid(grid);
            g.grid.bind('afterShowData', function() {
                g.updateSelectBoxPosition();
            });
            g.bind('show', function() {
                g.grid.refreshSize();
            });
            g.bind("clear", function() {
                selecteds = [];
                g.grid.selecteds = [];
                g.grid._showData();
            });
            var selecteds = [],
                onGridSelect = function() {
                    var value = [],
                        text = [];
                        debugger;
                    var data = g.grid.getSelectedRows();
                    data.forEach(function(row, index) {
                        value.push(row[p.valueField]);
                        text.push(row[p.textField]);
                    });
                    g.selected = data;
                    g._changeValue(value.join(p.split), text.join(p.split), true);
                    g.trigger('gridSelect', {
                        value: value.join(p.split),
                        text: text.join(p.split),
                        data: data
                    });
                },
                removeSelected = function(rowdata) {
                    debugger;
                    for (var i = selecteds.length - 1; i >= 0; i--) {
                        if (selecteds[i][p.valueField] == rowdata[p.valueField]) {
                            selecteds.splice(i, 1);
                        }
                    }
                },
                addSelected = function(rowdata) {
                    debugger;
                    for (var i = selecteds.length - 1; i >= 0; i--) {
                        if (selecteds[i][p.valueField] == rowdata[p.valueField]) {
                            return;
                        }
                    }
                    selecteds.push(rowdata);
                };
            if (girdOptions.checkbox) {
                var onCheckRow = function(checked, rowdata) {
                    checked && addSelected(rowdata);
                    !checked && removeSelected(rowdata);
                };
                g.grid.bind('CheckAllRow', function(checked) {
                    $(g.grid.rows).each(function(i, rowdata) {
                        onCheckRow(checked, rowdata);
                    });
                    onGridSelect();
                });
                g.grid.bind('CheckRow', function(checked, rowdata) {
                    onCheckRow(checked, rowdata);
                    onGridSelect();
                });
                /**
                 * 2016-11-08 下拉表格：新增toggleSelected，clearSelecteds事件
                 * */
                g.grid.bind('toggleSelected', function(checked, rowdata) {
                    if (checked) {
                        addSelected(rowdata);
                    } else {
                        removeSelected(rowdata);
                    }
                });
                g.grid.bind('clearSelecteds', function() {
                    selecteds = [];
                });
            } else {
                g.grid.bind('SelectRow', function(rowdata) {
                    selecteds = [rowdata];
                    onGridSelect();
                    if (!p.isMultiSelect) g._toggleSelectBox(true);
                });
                g.grid.bind('UnSelectRow', function() {
                    selecteds = [];
                    onGridSelect();
                });
            }
            if (p.condition) {
                var conditionParm = $.extend({
                    labelWidth: 60,
                    space: 20,
                    width: p.selectBoxWidth
                }, p.condition);
                g.condition = $("<form></form>").ligerForm(conditionParm);
                var containerBtn1 = $('<li style="margin-right:9px"><div></div></li>');
                var containerBtn2 = $('<li style="margin-right:9px;float:right"><div></div></li>');
                $("ul:first", g.condition.element).append(containerBtn1).append(containerBtn2).after('<div class="l-clear"></div>');
                $("div", containerBtn1).ligerButton({
                    text: p.Search,
                    width: 40,
                    click: function() {
                        var rules = g.condition.toConditions();
                        if (p.conditionSearchClick) {
                            p.conditionSearchClick({
                                grid: g.grid,
                                rules: rules
                            });
                        } else {
                            if (g.grid.get('url')) {
                                g.grid.setParm(grid.conditionParmName || 'condition', $.ligerui.toJSON(rules));
                                g.grid.reload();
                            } else {
                                g.grid.loadData($.ligerFilter.getFilterFunction(rules));
                            }
                        }
                    }
                });
                $("div", containerBtn2).ligerButton({
                    text: '关闭',
                    width: 40,
                    click: function() {
                        g.selectBox.hide();
                    }
                });
                g.condition.element.appendTo(panel);
            }
            g.grid.element.appendTo(panel);
            g.grid.refreshSize();
        },
        getGridHeight: function (height)
        {
            var g = this, p = this.options;
            height = height || g.selectBox.height();
            height -= g.conditionPanel.height();
            return height;
        },
        _getValue: function ()
        {

            var g = this, p = this.options;
            /**
             * 2016-12-06 新增textAsValue选项，指示getValue时，获得文本框的值
             * */
            if (p.isTextBoxMode || p.textAsValue)
            {
                return g.inputText.val();
            }
            return $(this.valueField).val();
        },
        getValue: function ()
        {
            //获取值
            return this._getValue();
        },
        getSelected: function ()
        {
            return this.selected;
        },

        upFocus : function()
        {
            var g = this, p = this.options;
            if (g.grid)
            {
                if (!g.grid.rows || !g.grid.rows.length) return;
                var selected = g.grid.getSelected();
                if (selected)
                {
                    var index = $.inArray(selected, g.grid.rows);
                    if (index - 1 < g.grid.rows.length)
                    {
                        g.grid.unselect(selected);
                        g.grid.select(g.grid.rows[index - 1]);
                    }
                }
                else
                {
                    g.grid.select(g.grid.rows[0]);
                }

            } else
            {
                var currentIndex = g.selectBox.table.find("td.l-over").attr("index");
                if (currentIndex == undefined || currentIndex == "0")
                {
                    return;
                }
                else
                {
                    currentIndex = parseInt(currentIndex) - 1;
                }
                g.selectBox.table.find("td.l-over").removeClass("l-over");
                g.selectBox.table.find("td[index=" + currentIndex + "]").addClass("l-over");

                g._scrollAdjust(currentIndex);
            }
        },
        downFocus : function()
        {
            var g = this, p = this.options;
            if (g.grid)
            {
                if (!g.grid.rows || !g.grid.rows.length) return;
                var selected = g.grid.getSelected();
                if (selected)
                {
                    var index = $.inArray(selected, g.grid.rows);
                    if (index + 1 < g.grid.rows.length)
                    {
                        g.grid.unselect(selected);
                        g.grid.select(g.grid.rows[index + 1]);
                    }
                }
                else
                {
                    g.grid.select(g.grid.rows[0]);
                }

            } else
            {
                var currentIndex = g.selectBox.table.find("td.l-over").attr("index");
                if (currentIndex == g.data.length - 1) return;
                if (currentIndex == undefined)
                {
                    currentIndex = 0;
                }
                else
                {
                    currentIndex = parseInt(currentIndex) + 1;
                }
                g.selectBox.table.find("td.l-over").removeClass("l-over");
                g.selectBox.table.find("td[index=" + currentIndex + "]").addClass("l-over");

                g._scrollAdjust(currentIndex);
            }
        },


        _scrollAdjust:function(currentIndex)
        {
            var g = this, p = this.options;
            var boxHeight = $(".l-box-select-inner", g.selectBox).height();
            var fullHeight = $(".l-box-select-inner table", g.selectBox).height();
            if (fullHeight <= boxHeight) return;
            var pageSplit = parseInt(fullHeight / boxHeight) + ((fullHeight % boxHeight) ? 1 : 0);//分割成几屏
            var itemHeight = fullHeight / g.data.length; //单位高度
            //计算出位于第几屏
            var pageCurrent = parseInt((currentIndex + 1) * itemHeight / boxHeight) + (((currentIndex + 1) * itemHeight % boxHeight) ? 1 : 0);
            $(".l-box-select-inner", g.selectBox).scrollTop((pageCurrent - 1) * boxHeight);
        },

        getText: function ()
        {
            return this.inputText.val();
        },
        setText: function (value)
        {
            var g = this, p = this.options;
            if (p.isTextBoxMode) return;
            g.inputText.val(value);
        },
        updateStyle: function ()
        {
            var g = this, p = this.options;
            p.initValue = g._getValue();
            g._dataInit();
        },
        _dataInit: function ()
        {
            var g = this, p = this.options;
            var value = null;
            if (p.initValue != null && p.initText != null)
            {
                g._changeValue(p.initValue, p.initText);
            }
            //根据值来初始化
            if (p.initValue != null)
            {
                value = p.initValue;
                if (p.tree)
                {
                    if (value)
                        g.selectValueByTree(value);
                }
                else if (g.data)
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            else if (g.valueField.val() != "")
            {
                value = g.valueField.val();
                if (p.tree)
                {
                    if (value)
                        g.selectValueByTree(value);
                }
                else if (g.data)
                {
                    var text = g.findTextByValue(value);
                    g._changeValue(value, text);
                }
            }
            if (!p.isShowCheckBox)
            {
                $("table tr", g.selectBox).find("td:first").each(function ()
                {
                    if (value != null && value == $(this).attr("value"))
                    {
                        $(this).addClass("l-selected");
                    } else
                    {
                        $(this).removeClass("l-selected");
                    }
                });
            }
            else
            {
                $(":checkbox", g.selectBox).each(function ()
                {
                    var parentTD = null;
                    var checkbox = $(this);
                    if (checkbox.parent().get(0).tagName.toLowerCase() == "div")
                    {
                        parentTD = checkbox.parent().parent();
                    } else
                    {
                        parentTD = checkbox.parent();
                    }
                    if (parentTD == null) return;
                    $(".l-checkbox", parentTD).removeClass("l-checkbox-checked");
                    checkbox[0].checked = false;
                    var valuearr = (value || "").toString().split(p.split);
                    $(valuearr).each(function (i, item)
                    {
                        if (value != null && item == parentTD.attr("value"))
                        {
                            $(".l-checkbox", parentTD).addClass("l-checkbox-checked");
                            checkbox[0].checked = true;
                        }
                    });
                });
            }
        },
        //设置值到 文本框和隐藏域
        //isSelectEvent：是否触发选择事件
        _changeValue: function (newValue, newText,isSelectEvent,isFocus) {
            var g = this, p = this.options;
            if (p.beforeChange && !p.beforeChange.call(g, newValue, newText)) {
                return false;
            }
            g.valueField.val(newValue);

            if (p && p.render) {
                g.inputText.val(p.render(newValue, newText));
            } else {
                g.inputText.val(newText);
            }
            if (g.select) {
                $("option", g.select).each(function (i, v) {
                    $(this).attr("selected", $(this).attr("value") == newValue);
                });
            }

            g.selectedValue = newValue;
            g.selectedText = newText;

            // 触发 onChange 事件
            g.inputText.trigger("change");

            // 2016-11-11 新增参数isFocus来指定是否触发focus事件
            // 原本触发判断条件为 isSelectEvent && newText
            if (isFocus) { g.inputText.focus(); }

            // 是否 onSelected 事件
            if (!isSelectEvent) return ;

            var rowData = null;

            if (newValue && typeof(newValue) == "string" &&  newValue.indexOf(p.split) > -1) {
                rowData = [];
                var values = newValue.split(p.split);
                $(values).each(function (i, v) {
                    rowData.push(g.getRow(v));
                });
            } else if(newValue) {
                rowData = g.getRow(newValue);
            }
            g.trigger('selected', [newValue, newText, rowData]);
        },
        //更新选中的值(复选框)
        _checkboxUpdateValue: function () {
            var g = this, p = this.options;
            var valueStr = "";
            var textStr = "";
            $("input:checked", g.selectBox).each(function ()
            {
                var parentTD = null;
                if ($(this).parent().get(0).tagName.toLowerCase() == "div")
                {
                    parentTD = $(this).parent().parent();
                } else
                {
                    parentTD = $(this).parent();
                }
                if (!parentTD) return;
                valueStr += parentTD.attr("value") + p.split;
                textStr += parentTD.attr("text") + p.split;
            });
            if (valueStr.length > 0) valueStr = valueStr.substr(0, valueStr.length - 1);
            if (textStr.length > 0) textStr = textStr.substr(0, textStr.length - 1);
            /**
             * 2016-11-24 下拉多选框选择时也要触发选择事件
             * */
            g._changeValue(valueStr, textStr, true);
            /**
             * 2016-12-01 手动触发验证
             * */
            if(g.inputText.attr("validate")){
                if(p.isTextBoxMode){
                    g.inputText.valid();
                }
                else{
                    g.valueField.valid();
                }
            }
        },
        loadDetail : function(value,callback) {
            var g = this, p = this.options;
            var parms = $.isFunction(p.detailParms) ? p.detailParms.call(g) : p.detailParms;
            parms[p.detailPostIdField || "id"] = value;
            if (p.ajaxContentType == "application/json")
            {
                parms = liger.toJSON(parms);
            }
            var ajaxOp = {
                type: p.ajaxType,
                url: p.detailUrl,
                data: parms,
                cache: true,
                dataType: 'json',
                beforeSend: p.ajaxBeforeSend,
                complete: p.ajaxComplete,
                success: function (result)
                {
                    var data = $.isFunction(p.detailDataGetter) ? p.detailDataGetter(result) : result;
                    data = p.detailDataParmName ? data[p.detailDataParmName] : data;
                    callback && callback(data);
                }
            };

            if (p.ajaxContentType)
            {
                ajaxOp.contentType = p.ajaxContentType;
            }
            $.ajax(ajaxOp);

        },
        enabledLoadDetail : function()
        {
            var g = this, p = this.options;
            return p.detailUrl && p.detailEnabled ? true : false;
        },
        _addClickEven: function () {
            var g = this, p = this.options;

            $(".l-table-nocheckbox td", g.selectBox).click(function (e) {
                var $this = $(this);

                if ( $this.parent().hasClass("rowreadonly") ) return ;

                var value = $this.attr("value"),
                    index = parseInt($this.attr('index')),
                    data  = g.data[index],
                    text  = $this.attr("text");

                if (g.enabledLoadDetail()) {
                    g.loadDetail(value,function (rd) {
                        g.data[index] = data = rd;
                        onItemClick();
                    });
                } else {
                    onItemClick();
                }

                function onItemClick (){
                    if (g.hasBind('beforeSelect') && g.trigger('beforeSelect', [value, text, data]) == false) {
                        if (p.slide) g.selectBox.slideToggle("fast");
                        else g.selectBox.hide();
                        return false;
                    }

                    g.selected = data;

                    if ($this.hasClass("l-selected")) {
                        if (p.slide) g.selectBox.slideToggle("fast");
                        else g.selectBox.hide();
                        return;
                    }

                    $(".l-selected", g.selectBox).removeClass("l-selected");

                    $this.addClass("l-selected");

                    if (g.select && g.select[0].selectedIndex != index) {
                        g.select[0].selectedIndex = index;
                        g.select.trigger("change");
                    }

                    if (p.slide) {
                        g.boxToggling = true;
                        g.selectBox.hide("fast", function () {
                            g.boxToggling = false;
                        });
                    } else {
                        g.selectBox.hide();
                    }

                    g.lastInputText = text;

                    /**
                     * 2016-11-11 手动选择下拉框时触发focus
                     * */
                    g._changeValue(value, text, true ,true);

                    /**
                     * 2016-12-01 手动触发验证
                     * */

                    if (g.inputText.attr("validate") ){
                        if (p.isTextBoxMode) {
                            g.inputText.valid();
                        } else {
                            g.valueField.valid();
                        }
                    }
                };
            });
        },
        /**
         * 2017-01-17 新增nochangeDir参数，是否不更改方向
         * */
        updateSelectBoxPosition: function (nochangeDir)
        {
            var g = this, p = this.options;
            if (p && p.absolute)
            {
                var contentHeight = $(document).height();
                var eqOne = Number(g.wrapper.offset().top + 1 + g.wrapper.outerHeight() + g.selectBox.height()) > contentHeight,
                    eqTwo = g.wrapper.offset().top > g.selectBox.height() + 1;
                if( p.alwayShowInTop || (eqOne && eqTwo && !p.alwayShowInDown) ){
                    g.selectBox.css({ left: g.wrapper.offset().left, top: g.wrapper.offset().top - 1 - g.selectBox.height() + (p.selectBoxPosYDiff || 0) });
                }else{
                    g.selectBox.css({ left: g.wrapper.offset().left, top: g.wrapper.offset().top + 1 + g.wrapper.outerHeight() + (p.selectBoxPosYDiff || 0) });
                }
            }
            else
            {
                /**
                 * 2016-12-09 修复textHeight未定义的问题
                 * */
                var textHeight = g.wrapper.height();
                var topheight = g.wrapper.offset().top - $(window).scrollTop();
                var selfheight = g.selectBox.height() + textHeight + 4;
                //2017-01-17 nochangeDir
                if ((nochangeDir && g.selectBox.attr("data-dir") === "up") || (!nochangeDir && (topheight + selfheight > $(window).height() && topheight > selfheight)))
                {
                    g.selectBox.css("marginTop", -1 * (g.selectBox.height() + textHeight + 1) + (p.selectBoxPosYDiff || 0)).attr("data-dir","up");
                }
                else{
                    /**
                     * 2017-01-17 可上可下
                     * 新增方向属性
                     * */
                    g.selectBox.css("marginTop", "-2px").attr("data-dir","down");
                }
            }
        },
        _toggleSelectBox: function (isHide)
        {
            var g = this, p = this.options;

            if (!g || !p) return;
            //避免同一界面弹出多个菜单的问题
            var comboBoxs = $.ligerui.find($.ligerui.controls.ComboBox);
            for (var i = 0, l = comboBoxs.length; i < l; i++) {
                var o = comboBoxs[i];
                if (o.id != g.id && o.selectBox.is(":visible") != null && o.selectBox.is(":visible")) {
                    o.selectBox.hide();
                }
            }
            var dateEditors = $.ligerui.find($.ligerui.controls.DateEditor);
            for (var i = 0, l = dateEditors.length; i < l; i++) {
                var o = dateEditors[i];
                if (o.id != g.id && o.dateeditor.is(":visible") != null && o.dateeditor.is(":visible")) {
                    o.dateeditor.hide();
                }
            }

            var textHeight = g.wrapper.height();

            g.boxToggling = true;

            if (!isHide) { g.updateSelectBoxPosition(); }
            if (p.slide) {
                g.selectBox.slideToggle('fast', function () {
                    g.boxToggling = false;
                    if (!isHide && !p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0) {
                        isAnimate()
                    }
                });
            } else {
                if (isHide) {
                    g.selectBox.hide();
                } else {
                    g._selectBoxShow();
                }
                g.boxToggling = false;
                if (!isHide && !g.tree && !g.grid && !p.isShowCheckBox && $('td.l-selected', g.selectBox).length > 0) {
                    isAnimate()
                }
            }
            function isAnimate(){
                var offSet = ($('td.l-selected', g.selectBox).offset().top - g.selectBox.offset().top);
                $(".l-box-select-inner", g.selectBox).animate({ scrollTop: offSet });
            }
            g.isShowed = g.selectBox.is(":visible");
            g.trigger('toggle', [isHide]);
            g.trigger(isHide ? 'hide' : 'show');
        },
        _selectBoxShow : function()
        {
            var g = this, p = this.options;

            if (p.readonly) return;
            if (!p.grid && !p.tree)
            {
                if (g.selectBox.table.find("tr").length || (p.selectBoxRender && g.selectBoxInner.html()))
                {
                    g.selectBox.show();
                } else
                {
                    g.selectBox.hide();
                }
                return;
            }
            g.selectBox.show();
            return;
        },
        _highLight: function (str, key)
        {
            if (!str) return str;
            str = str.toString();
            var index = str.indexOf(key);
            if (index == -1) return str;
            return str.substring(0, index) + "<span class='l-highLight'>" + key + "</span>" + str.substring(key.length + index);
        },
        /**
         * 2016-10-27 自动完成相关，新增_updateInput函数
         * */
        _updateInput: function(value, show) {
            var g = this, p = this.options;
            if (g.lastInputText == g.inputText.val()) return;
            var inputText = g.inputText.val();
            if (inputText) {
                inputText = inputText.replace(/(^\s*)|(\s*$)/g, "");
            } else {
                p.initValue = "";
                g.valueField.val("");
            }

            g.lastInputText = g.inputText.val();

            if ($.isFunction(value)) {
                value.call(g, {
                    key: inpuText,
                    show: function () {
                        g._selectBoxShow();
                    }
                });
                return;
            }
            if (!p.autocompleteAllowEmpty && !inputText) {
                g.clear();
                g.selectBox.hide();
                return;
            }
            // 如果本地有数据
            if (g.loadedData) {
                if (inputText) {
                    var rows = g.loadedData;
                    //获取本地数据所有行
                    var newrow = [];
                    //创建一个新的本地数据副本
                    for (var o in rows) {
                        //下面就是本地数据匹配
                        var text = rows[o][p.autocompleteKeyField] || rows[o][p.textField];
                        var index = text.indexOf(inputText);
                        if (index >= 0) {
                            newrow.push(rows[o]);
                        }
                        if (text == inputText) {
                            //2016-10-28 增加TextBoxMode支持
                            var newValue = p.isTextBoxMode ? text : rows[o][p.valueField];
                            g._setValue(newValue, text);
                            g.setData(rows,false);//匹配成功，设置data为原始数据
                            return;
                        }
                    }
                    g.setData(newrow,false);
                    if (show) g._selectBoxShow();
                }else{
                    g.setData(g.loadedData,false);
                    if (show) g._selectBoxShow();
                }
            }else if (p.url) {
                g.setParm('key', inputText);
                g.setUrl(p.url, function () {
                    g._selectBoxShow();
                });
            } else if (p.grid) {
                g.grid.setParm('key', inputText);
                g.grid.reload();
            }

            this._acto = null;
        },
        /**
         * 2016-10-27 自动完成相关，重写_setAutocomplete，（注：可能存在bug）
         * */
        _setAutocomplete: function (value) {
            var g = this, p = this.options;
            if (!value) return;
            if (p.readonly) return;
            g.inputText.removeAttr("readonly");
            g.lastInputText = g.inputText.val();
            g.inputText.blur(function () {
                // debugger;
                var isMatched = false;
                var currentKey = g.inputText.val();
                if(!currentKey || !g.loadedData) return ;
                currentKey = currentKey.replace(/(^\s*)|(\s*$)/g, "");
                var rows = g.loadedData;
                for (var o in rows) {
                    //下面就是本地数据匹配
                    var text = rows[o][p.autocompleteKeyField];
                    if (text == currentKey) {
                        g._changeValue(rows[o][p.valueField], rows[o][p.textField], false);
                        isMatched = true;
                    }
                }
                if (p.isTextBoxMode){
                    setTimeout(function () {
                        g.setData(g.loadedData,false);
                    },200);
                }

                if (isMatched) return;
                if(p.isTextBoxMode){
                    g._changeValue("", currentKey, false);
                } else{
                    g.inputText.val("");
                    //触发属性改变事件
                    g.inputText.trigger($.browser.msie ? "propertychange" : "input");
                    g._changeValue("", "", false);
                }
            });
            g.inputText.bind('input propertychange', function (event) {
                if (this._acto)clearTimeout(this._acto);
                this._acto = setTimeout(function(v) {
                    return function() {
                        // debugger;
                        g._updateInput(v, true);
                    };
                }(value), 300);
            });
        }
    });

    $.ligerui.controls.ComboBox.prototype.setValue = $.ligerui.controls.ComboBox.prototype.selectValue;
    //设置文本框和隐藏控件的值
    $.ligerui.controls.ComboBox.prototype.setInputValue = $.ligerui.controls.ComboBox.prototype._changeValue;


    //Key Init
    (function ()
    {
        $(document).unbind('keydown.ligercombobox');
        $(document).bind('keydown.ligercombobox',function (event)
        {
            function down()
            {
                if (!combobox.selectBox.is(":visible"))
                {
                    combobox.selectBox.show();
                }
                combobox.downFocus();
            }
            function toSelect()
            {
                var curTd = combobox.selectBox.table.find("td.l-over").eq(0);
                if(combobox.options.isMultiSelect){
                    curTd.find('.l-checkbox').trigger('click');
                    combobox.trigger('textBoxKeyEnter', [{
                        rowdata: curGridSelected
                    }]);
                    return ;
                }
                if (!curGridSelected) {
                    combobox._changeValue(value, curTd.attr("text"), true);
                    combobox.selectBox.hide();
                    combobox.trigger('textBoxKeyEnter', [{
                        element: curTd.get(0)
                    }]);
                } else {
                    combobox._changeValue(curGridSelected[combobox_op.valueField], curGridSelected[combobox_op.textField], true);
                    combobox.selectBox.hide();
                    combobox.trigger('textBoxKeyEnter', [{
                        rowdata: curGridSelected
                    }]);
                }
            }
            var curInput = $("input:focus");
            if (curInput.length && curInput.attr("data-comboboxid"))
            {
                var combobox = liger.get(curInput.attr("data-comboboxid"));
                if (!combobox) return;
                var combobox_op = combobox.options;
                if (!combobox.get("keySupport")) return;
                if (event.keyCode == 38) {  //up
                    combobox.upFocus();
                } else if (event.keyCode == 40) {   //down
                    if (combobox.hasBind('textBoxKeyDown')) {
                        combobox.trigger('textBoxKeyDown', [{
                            callback: function () {
                                down();
                            }
                        }]);
                    } else {
                        down();
                    }
                } else if (event.keyCode == 13) {  //enter
                    if (!combobox.selectBox.is(":visible")) return;
                    var curGridSelected = null;
                    if (combobox.grid) {
                        curGridSelected = combobox.grid.getSelected();
                    }
                    var curTd = combobox.selectBox.table.find("td.l-over");
                    if (curGridSelected || curTd.length) {
                        var value = curTd.attr("value");
                        if (curGridSelected && curGridSelected.ID) value = curGridSelected.ID;

                        if (combobox.enabledLoadDetail()) {
                            combobox.loadDetail(value, function (data) {
                                if (!curGridSelected) {
                                    var index = combobox.getRowIndex(value);
                                    if (index == -1) return;
                                    combobox.data = combobox.data || [];
                                    combobox.data[index] = combobox.selected = data;
                                }
                                toSelect();
                            });
                        } else {
                            toSelect();
                        }
                    }
                }
            }
        });
    })();
})(jQuery);