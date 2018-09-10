/**
 * name Set
 * Author Sujing
 * description 集合的编辑器
 * time 2017-7-25
 */
(function ($){
    $.fn.ligerSet = function (options) {
        return $.ligerui.run.call(this, "ligerSet", arguments);
    };
    $.fn.ligerGetSetManager = function () {
        return $.ligerui.run.call(this, "ligerGetSetManager", arguments);
    };

    $.ligerDefaults.Set = {
        css: null,
        maxValue: null,
        mixValue: null,
        value: null,
        onChangeValue: null,
        disabled: false,
        readonly: false,
        selectBoxCss: null,
        selectWidth: null,
        selectHeight: null
    };

    $.ligerMethos.Set = {};

    $.ligerui.controls.Set = function (element, options) {
        $.ligerui.controls.Set.base.constructor.call(this, element, options);
    };

    $.ligerui.controls.Set.ligerExtend($.ligerui.controls.Input, {
        __getType: function () {
            return 'Set';
        },
        __idPrev: function () {
            return 'Set';
        },
        _extendMethods: function () {
            return $.ligerMethos.Set;
        },
        destroy: function () {
            this.options = null;
            $.ligerui.remove(this);
        },
        _render: function () {
            var g = this,
                p = g.options,
                $input = $(this.element);
            g.selectBox = null;
            // 生成展示主体
            g.wrapper = $input.wrap('<div class="l-text l-set-box"></div>').parent();
            g.inputText =  $('<p class="l-text-field"></p>');
            g.link = $('<div class="l-trigger"><div class="l-trigger-icon"></div></div>');

            $input.css('display', 'none');
            !g.selectBox && g._addDropDownBox();
            p.css && g.wrapper.addClass(p.css);
            p.value && g.setValue(p.value);
            g.wrapper.append(g.inputText);
            g.wrapper.append(g.link);
            // 事件绑定
            g.wrapper.on('click', '.l-text-field, .l-trigger', function () {
                g.showDropDownBox()
            });
        },
        getValue: function () {
            return this.element.value;
        },
        setValue: function (value) {
            var g = this;
            if ( !value || value.length < 2) {
                // alert('数据出错,请检查!');
                return ;
            }
            typeof value === 'string' && toArray(value);
            Array.isArray(value) && enterValue(value);
            function toArray (value) {
                try {
                    var arry = value.split(',');
                    enterValue([arry[0].substring(1), arry[1].substring(0, arry[1].length - 1)]);
                }
                catch (e) {console.error(e);
                    // alert('数据出错,请检查!');
                }
            }

            function enterValue (value) {
                if ((value[0] === '' && value[1] === '') || value[0] === value[1]){
                    // alert('数据出错,请检查!');
                    return ;
                }
                var textOne = value[0] === '' ? 0 : parseFloat(value[0]);
                var textTwo = value[1] === '' ? 0 : parseFloat(value[1]);
                if (textOne > textTwo) {
                    g._setValue(textTwo, textOne);
                }
                else {
                    g._setValue(textOne, textTwo);
                }
            }
        },
        _setValue: function (min, max) {
            var g = this;
            var text = '';
            text = !g.minRadio[0].checked ? '(' : '[';
            text += min + ',' + max;
            text += !g.maxRadio[0].checked ? ')' : ']';
            var eq = /^\[|\([0-9]+,[0-9]+(\)|\])$/;
            if (!eq.test(text)) {
                // alert('数据出错,请检查!');
                return;
            }
            g.inputText.text(text);
            g.element.value = text;
            g.minInput.val(min);
            g.maxInput.val(max);
        },
        _addDropDownBox: function (){
            var g = this,
                p = g.options,
                $body = $('body');
            g.selectBox = $('<div class="l-box-select l-set-select"></div>');
            g.minInput = $('<input class="l-set-enter" type="text">');
            g.maxInput = $('<input class="l-set-enter" type="text">');
            g.minRadio = $('<input class="l-set-radio" type="checkbox" checked="true">');
            g.maxRadio = $('<input class="l-set-radio" type="checkbox" checked="true">');
            g.minDom = $('<div class="l-set-minbox l-set-ebox"></div>');
            g.maxDom = $('<div class="l-set-maxbox l-set-ebox "></div>');
            g.symbol = $('<div class="l-set-symbol l-set-sbox ">~</div>');
            g.selectButtonBox = $('<div class="l-set-buttonbox"></div>');
            g.confirmBut = $('<span></span>').ligerButton({
                text: '确认',
                click: function () {
                    $('body').children().not(g.selectBox).off('click.closeSet');
                    g.hideDropDownBox();
                    var value = [g.minInput.val(), g.maxInput.val()];
                    g.setValue(value);
                }
            });
            g.cancelBut = $('<span></span>').ligerButton({
                text: '取消',
                click: function () {
                    $('body').children().not(g.selectBox).off('click.closeSet');
                    g.hideDropDownBox();
                }
            });

            p.selectBoxCss && g.selectBox.addClass(p.selectBoxCss);
            p.selectBoxHeight && g.selectBox.height(p.selectBoxHeight);
            g.minDom.append(g.minRadio);
            g.maxDom.append(g.maxRadio);
            g.minDom.append(g.minInput);
            g.maxDom.append(g.maxInput);
            g.selectBox.append(g.minDom);
            g.selectBox.append(g.symbol);
            g.selectBox.append(g.maxDom);
            g.selectButtonBox.append(g.confirmBut.element);
            g.selectButtonBox.append(g.cancelBut.element);
            g.selectBox.append(g.selectButtonBox);
            g.selectBox.appendTo($body).addClass("l-box-select-absolute");

            g.minRadio.on('click', function(){
                g.minInput.attr('disabled', !this.checked);
            });
            g.maxRadio.on('click', function(){
                g.maxInput.attr('disabled', !this.checked);
            });
        },
        showDropDownBox: function () {
            var g = this,
                p = g.options,
                $body = $('body');
            !g.selectBox && g._addDropDownBox();
            g.selectHieght = p.selectHeight ? p.selectHeight : 75;
            g.selectWidth = p.selectWidth ? p.selectWidth : g.wrapper.width() + 50;
            var offset = g.inputText.offset();
            offset.top += (g.wrapper.height() + 2);
            g.selectBox && g.selectBox.css({
                'top': offset.top,
                'left': offset.left - 30,
                'width': g.selectWidth - 10,
                'height': g.selectHieght - 10,
                'display': 'block'
            });

            setTimeout(function(){
                $body.children().not(g.selectBox).one('click.closeSet', function () {g.hideDropDownBox();});
            }, 200);

            g.trigger('toggle');
        },
        hideDropDownBox: function () {
            var g = this;
            g.selectBox && g.selectBox.css('display', 'none');
            g.trigger && g.trigger('toggle');
        }
    });
})(jQuery);