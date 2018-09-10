/**
 *  name: MultipBox
 *  Author: SuJing
 *  description: 多选下拉框
 *  time: 2017-8-7
 *
 */

(function ($) {
    $.fn.ligerTagInput = function (options) {
        if(!$().tagsinput) {
            console.error('需要先加载‘bootstrap-tagsinput’');
            return $.ligerui.run.call(this, "ligerComboBox", arguments);
        }
        else {
            return $.ligerui.run.call(this, "ligerTagInput", arguments);
        }
    };

    $.fn.ligerGetTagInputManager = function () {
        return $.ligerui.run.call(this, "ligerGetTagInputManager", arguments);
    };

    $.ligerDefaults.TagInput = {
        inputCss: null,
        tagCss: null,
        initValue: null,        // 初始值
        tagFocusCss: null,
        inputMaxWidth: 100,
        inputMinWidth: 45,
        valueField: 'id',
        textField: 'text',
        split: ',',
        width: null,                  // 外框宽度
        height: null,                  // 外框高度
        inputWidth: null,           // 输入框大小
        inputHeight: null,          // 输入框大小
        autoInputWidth: null,       // 下拉框大小
        enterInput: false,          // 回车即输入
        freeInput: false,           // 输入即输出
        confirmKeys: [13],           // 确定输入按键
        removeKeys: [8, 46],         // 删除按键
        maxTag: null,               // 选择项
        maxChars: 8,                 // 最多输入字符
        trim: true,                 // 值输入前是否去掉多余的空白符号
        isRepeat: false,            // 是否可以重复
        isEnter: false,             // 是否回车提交表单
        isAutoFilling: true,        // 是否自动填充
        isMultiple: true,           // 多行显示
        autoFiler: 'text',           // 自动填充字段
        data: null,                 // 数据
        inputRender: null,          // combobox 渲染
        renderItem: null,           // combobox 列表渲染
        isPrevent: true,            // 是否监控删除平率
        url: null,
        ajaxType: null,
        parms: null,
        onSuccess: null,
        onError: null,
        dataGetter: null,           // 请求的数据处理
        comboboxRender: null,
        ontagInit: null,
        onBeforeAdd: null,
        onAdded: null,
        onBeforeRemove: null,
        onRemoved: null,
        onTagExists: null,
        onCleared: null            // 清除
    };

    $.ligerui.controls.TagInput = function (element, options) {
        $.ligerui.controls.TagInput.base.constructor.call(this, element, options);
    };

    $.ligerui.controls.TagInput.ligerExtend($.ligerui.controls.Input,{
        __getType: function () {
            return 'TagInput';
        },
        __idPrev: function () {
            return 'TagInput';
        },
        _extendMethods: function () {
            return $.ligerMethos.TagInput;
        },
        _init: function () {
            $.ligerui.controls.TagInput.base._init.call(this);
            var p = this.options;
            // 可能会有坑 暂时处理
            if (p.freeInput === true) {
                p.valueField = 'id';
                p.textField = 'text';
            }
        },
        _render: function () {
            var g = this,
                p = g.options,
                $this = $(g.element);
            $this.attr('type', 'hidden');
            g.inputText = $this;
            g.wrapper = $this.wrap('<div class="l-text l-tag-input-wrap"></div>').parent();
            g.wrapper.css({
                'width': p.width || '100%',
                'height': p.height
            });
            g.text = [];
            g.inputText.tagsinput({
                'tagClass': p.tagCss,
                'confirmKeys': p.confirmKeys,
                'maxTags': p.maxTags,
                'maxChars': p.maxChars,
                'itemText': function (val) {
                    var text = g.DataHash[val] ? g.DataHash[val][p.textField] || val : val;
                    return text;
                },
                'itemValue': function (val) {
                    return g.DataHash[val] ? g.DataHash[val][p.valueField] || val : val;
                },
                'trimValue': p.trim,
                'allowDuplicates': p.isRepeat,
                'freeInput': false,
                'cancelConfirmKeysOnEmpty': p.isEnter,
                'removeItem': g._removeItem
            });
            g.tagsinputWarpper = g.wrapper.children('.bootstrap-tagsinput');
            g.inputText.on({
                'beforeItemRemove': function (e) {
                    var text = e.item,
                        data = g.DataHash[text],
                        value = data[p.valueField] || text;
                    return g._beforeRemove(value, text, data, e);
                },
                'itemAdded': function (e) {
                    var val = e.item;
                    var text = g.DataHash[val] ? g.DataHash[val][p.textField] || val : val;
                    g.text.push(text);
                },
                'itemRemoved': function (e) {
                    var text = e.item,
                        data = g.DataHash[text],
                        value = data[p.valueField] || text;
                    var index = g.text.indexOf(text);
                    g.text.splice(index, 1);
                    g.combobox.inputText.focus();
                    p.onRemoved && p.onRemoved(value, text, data);

                }
            });
            g.tagsinputWarpper.on("keydown", ".l-tag-item-select", function (e) {
                var keyCode = e.keyCode, $elem = $(this);
                if (p.removeKeys.indexOf(keyCode) > -1) {
                    if ($elem.hasClass("l-tag-item-select-delay")) {
                        g.inputText.tagsinput('remove', $elem.data('item'));
                        ligerComboBoxM.inputText.focus();
                    }
                }
            });
            (p.initValue && g.data) && g.setValue(p.initValue);
            g.comboboxInput = g.tagsinputWarpper.children('input');
            g.combobox = g.comboboxInput.ligerComboBox({
                'resize': true,
                'selectBoxWidth': p.selectBoxWidth || p.inputMaxWidth,
                'selectBoxHeight': p.selectBoxHeight || 120,
                'keySupport': true,
                'data': p.data,
                'url': p.url,
                'type': p.ajaxType,
                'urlParms': p.parms,
                'onSuccess': p.onSuccess,
                'onError': p.onError,
                'dataGetter': p.dataGetter,
                'valueField': p.valueField,
                'textField': p.textField,
                'render': p.inputRender,
                'renderItem': p.renderItem,
                'autocomplete': p.isAutoFilling,
                'autocompleteKeyField': p.autoFiler,
                'highLight': true,
                'onBeforeOpen': p.onBeforeOpen,
                'onSelected': function (value, text, data) {
                    g.addItem(value, text, data);
                },
                'onAfterShowData': function (data) {
                    g._setData(data);
                }
            });
            // 绑定监听事件
            g.combobox.inputText.on({
                'keypress': function (e) {
                    var key = e.keyCode || e.which;
                    if (p.confirmKeys.indexOf(key) > -1) {
                        var text = g.combobox.getText();
                        p.freeInput && g.addItem(text, text, {id: text, value: text});
                        e.preventDefault();
                        e.stopPropagation();
                    }
                },
                'focus': function () {
                    $(this).parents(".bootstrap-tagsinput").children(".tag.l-tag-item-select").removeClass("l-tag-item-select");
                }
            }).css({
                'width': 'auto',
                "max-width": p.inputMaxWidth,
                "min-width": p.inputMinWidth
            });
        },
        setValue: function (value) {
            var g = this, p = g.options;
            g.clear();
            var valueArray = [];
            var type = value && typeof value;
            if (type === 'array') {
                valueArray = value;
            } else if (type === 'string') {
                valueArray = value.split(p.split);
            } else if (type === 'number') {
                valueArray.push(value);
            } else {
                return;
            }

            var data = valueArray.filter(function (item) {
                return p.freeInput || g.DataHash[item];
            }).map(function (item) {
                return p.freeInput ? { text: item, id: item } : g.DataHash[item];
            });
            result(data);
            function result (result) {
                for (var i = result.length - 1; i >= 0; i--) {
                    var item = result[i];
                    g.addItem(item[p.valueField], item[p.textField], item);
                }
            }
        },
        getText: function () {
            var g = this, p = g.options;
            return g.text.join(p.split);
        },
        getValue: function () {
            var g = this;
            return g.inputText.val();
        },
        setData: function () {
            var g = this, p = g.options;
            var type = typeof data,
                value = [];
            if (Array.isArray(data)){
                value = data;
            } else if (type === 'string') {
                value = data.split(p.split);
            } else if (type === 'function') {
                g.setData(data());
                return;
            } else {
                console.error('tagInput 数据格式为数组');
                return;
            }
            g.combobox.setData(value);
        },
        _setData: function (data) {
            var g = this, p = g.options;
            g.data = data;
            g.DataHash = {};
            for (var i = data.length - 1; i >= 0; i--) {
                var item = data[i];
                g.DataHash[item[p.valueField]] = item;
            }
        },
        getData: function () {
            return this.data;
        },
        addItem: function (value, text, data) {
            var g = this, p = g.options;
            if (p.onBeforeAdd && !p.onBeforeAdd.call(g, value, text, data)) return;
            g.inputText.tagsinput('add', value);
            g.combobox.clear();
            p.onAdded && p.onAdded.call(g, value, text, data);
        },
        removeItem: function (text) {
            var g = this;
            g.inputText.tagsinput('remove', text);
        },
        _beforeRemove: function (value, text, data, e) {
            var g = this, p = g.options;
            var result = true;
            result = p.onBeforeRemove ? p.onBeforeRemove.call(g, value, text,data) : result;
            return result;
        },
        _removeItem: function (self, $elem, $input, $inputWrap) {
            var g = this, p = g.options;
            if ($elem.hasClass("l-tag-item-select")) {
                if (!$elem.hasClass("l-tag-item-select-delay")) {
                    self.remove($elem.data('item'));
                    $input.focus();
                }
            }
            else {
                $elem.addClass("l-tag-item-select l-tag-item-select-delay").attr("tabindex", -1).focus();
            }
        },
        clear: function () {
            var g = this;
            g.inputText.tagsinput('removeAll');
            g.text = [];
            this.options.onCleared && this.options.onCleared.call(g, g.data);
        },
        refresh: function () {
            this.clear();
            this.options.initValue && this.setValue(p.initValue);
        }
    });
})(jQuery);