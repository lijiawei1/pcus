/*  作者：       ZPHIT_COM
 *  创建时间：   2012/7/19 16:23:54
 *
 */
if (!this.LG) {
    this.LG = {};
}
(function ($) {

    LG.render = (function() {
        return {
            /**
             *
             * @param name
             */
            boolean: function (name) {
                return function (item) {
                    return true == item[name] ? '是' : '否';
                }
            },
            /**
             * 获取参照名称
             * @param data
             * @param idField
             * @param textField
             */
            ref: function (data, name, idField, textField, style) {
                //默认取值
                idField = (idField || 'id');
                textField = (textField || 'text');

                return function (param) {
                    // 用原生（ES2015） 替换了 JQ 方法
                    if (!data || data.length == 0) return param[name];

                    var targets = data.filter(function (item) {
                        return item[idField] == param[name];
                    });

                    var text = targets.length > 0 ? targets[0][textField] : '';

                    return (style && typeof style === 'function') ? style(text, param) : text;
                }
            },
            multiValue: function (dataArray, seperator) {
                var array = $.grep(dataArray, function(v) {
                    return !!v;
                });

                return array.join(seperator);
            }
            
        }
    })();

    LG.cookies = (function () {
        var fn = function () {
        };
        fn.prototype.get = function (name) {
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1) end = document.cookie.length;
                    cookieValue = decodeURIComponent(document.cookie.substring(offset, end))
                }
            }
            return cookieValue;
        };
        fn.prototype.set = function (cookieName, cookieValue, DayValue) {
            var expire = "";
            var day_value = 1;
            if (DayValue != null) {
                day_value = DayValue;
            }
            expire = new Date((new Date()).getTime() + day_value * 86400000);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + encodeURIComponent(cookieValue) + ";path=/" + expire;
        }
        fn.prototype.remvoe = function (cookieName) {
            var expire = "";
            expire = new Date((new Date()).getTime() - 1);
            expire = "; expires=" + expire.toGMTString();
            document.cookie = cookieName + "=" + escape("") + ";path=/" + expire;
            /*path=/*/
        };

        return new fn();
    })();

    //右下角的提示框
    LG.tip = function (message) {
        if (LG.wintip) {
            LG.wintip.set('content', message);
            LG.wintip.show();
        }
        else {
            LG.wintip = $.ligerDialog.tip({content: message});
        }
        setTimeout(function () {
            LG.wintip.hide()
        }, 4000);
    };

    //预加载图片
    LG.prevLoadImage = function (rootpath, paths) {
        for (var i in paths) {
            $('<img />').attr('src', rootpath + paths[i]);
        }
    };
    //显示loading
    LG.showLoading = function (message) {
        message = message || "正在加载中...";
        $('body').append("<div class='jloading'>" + message + "</div>");
        $.ligerui.win.mask();
    };
    //隐藏loading
    LG.hideLoading = function (message) {
        $('body > div.jloading').remove();
        $.ligerui.win.unmask({id: new Date().getTime()});
    }
    //显示成功提示窗口
    LG.showSuccess = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作成功!";
        }
        $.ligerDialog.success(message, '提示信息', callback);
    };
    //显示失败提示窗口
    LG.showError = function (message, callback) {
        if (typeof (message) == "function" || arguments.length == 0) {
            callback = message;
            message = "操作失败!";
        }
        $.ligerDialog.error(message, '提示信息', callback);
    };
    //显示操作信息,消息，自动关闭时间
    LG.showOperate = function (message,delay,notClose){
        var manager = $.ligerDialog.waitting(message);
        if(!notClose) setTimeout(function () { manager.close(); }, delay || 1000);
        return manager;
    };
    //显示确认框
    LG.showConfirm = function (message, title, callback){
        $.ligerDialog.confirm(message, title, callback);
    };

    // 校验弹窗
    LG.validateTip = function (tagre, options, seep) {
        seep = seep ? seep : 1000;
        var newTip = tagre.ligerTip($.extend({content: '数据错误', auto: true}, options));
        setTimeout(function () {
            var dom = newTip.tip || $(newTip.element);
            dom.fadeOut('normal', function () {newTip.remove();});
        }, seep);
    };


    //预加载dialog的图片
    LG.prevDialogImage = function (rootPath) {
        rootPath = rootPath || "";
        LG.prevLoadImage(rootPath + '/Content/ligerUI/skins/Aqua/images/win/', ['dialog-icons.gif']);
        LG.prevLoadImage(rootPath + '/Content/ligerUI/skins/Gray/images/win/', ['dialogicon.gif']);
    };

    //提交服务器请求
    //返回json格式
    //1,提交给类 options.type  方法 options.method 处理
    //2,并返回 AjaxResult(这也是一个类)类型的的序列化好的字符串
    LG.ajax = function (options) {
        //  var ashxUrl = options.ashxUrl || "/Admin/User/";
        //   var url = p.url || ashxUrl + $.param({ method: p.method });
        var p = $.extend({
            cache: false,
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            dataType: 'json',
            type: 'post'
        }, (options || {}));

        $.ajax({
            cache: false,
            async: true,
            url: p.url,
            data: p.data,
            contentType: p.contentType,
            dataType: p.dataType,
            type: p.type,
            beforeSend: function () {
                LG.loading = true;
                if (p.beforeSend)
                    p.beforeSend();
                else
                    LG.showLoading(p.loading);
            },
            complete: function () {
                LG.loading = false;
                if (p.complete)
                    p.complete();
                else
                    LG.hideLoading();
            },
            success: function (result) {
                if (!result) return;
                if (!result.error) {
                    if (p.success)
                        p.success(result.data, result.message, result.code);
                }
                else {
                    if (p.error)
                        p.error(result.message, result.data, result.code);
                }
            },
            error: function (result, b) {
                LG.tip('发现系统错误 <BR>错误码：' + result.status);
                if(p.ajaxError){
                    p.ajaxError(result, b);
                }
            }
        });
    };

    //item为普通对象，或jq对象
    //会占用item的__ajaxLoading属性或给jq对象加disabled类
    LG.singleAjax = function (options, item) {

        if(item){
            if(item instanceof jQuery){
                if(item.hasClass("disabled")) return;
                item.addClass("disabled");
            }
            else{
                if(item.__ajaxLoading) return;
                item.__ajaxLoading = true;
            }
        }
        var p = $.extend({
            cache: false,
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            dataType: 'json',
            type: 'post'
        }, (options || {}));

        $.ajax({
            cache: false,
            async: true,
            url: p.url,
            data: p.data,
            contentType: p.contentType,
            dataType: p.dataType,
            type: p.type,
            beforeSend: function () {
                if (p.beforeSend)
                    p.beforeSend();
            },
            complete: function () {
                if (p.complete)
                    p.complete();

                if(item){
                    if(item instanceof jQuery){
                        item.removeClass("disabled");
                    }
                    else{
                        item.__ajaxLoading = false;
                    }
                }
            },
            success: function (result) {
                if (!result) return;
                if (!result.error) {
                    if (p.success)
                        p.success(result.data, result.message, result.code);
                }
                else {
                    if (p.error)
                        p.error(result.message, result.code);
                }
            },
            error: function (result, b) {
                LG.tip('发现系统错误 <BR>错误码：' + result.status);
                if(p.ajaxError){
                    p.ajaxError(result, b);
                }
            }
        });
    };

    //获取当前页面的MenuNo
    //优先级1：如果页面存在MenuNo的表单元素，那么加载它的值
    //优先级2：加载QueryString，名字为MenuNo的值
    LG.getPageMenuNo = function () {
        var menuno = $("#MenuNo").val();
        if (!menuno) {
            menuno = getQueryStringByName("MenuNo");
        }
        return menuno;
    };

    //创建按钮
    LG.createButton = function (options) {
        var p = $.extend({
            appendTo: $('body')
        }, options || {});
        var btn = $('<div class="button button2 buttonnoicon" style="width:60px"><div class="button-l"> </div><div class="button-r"> </div> <span></span></div>');
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
    };

    //创建过滤规则(查询表单)
    LG.bulidFilterGroup = function (form) {
        if (!form) return null;
        var group = {op: "and", rules: []};
        $(":input", form).not(":submit, :reset, :image,:button, [disabled]")
            .each(function () {
                if (!this.name) return;
                if (!$(this).hasClass("field")) return;
                if ($(this).val() == null || $(this).val() == "") return;
                var ltype = $(this).attr("ltype");
                var optionsJSON = $(this).attr("ligerui"), options;
                if (optionsJSON) {
                    options = JSON2.parse(optionsJSON);
                }
                var op = $(this).attr("op") || "like";
                //get the value type(number or date)
                var type = $(this).attr("vt") || "string";
                var value = $(this).val();
                var name = this.name;
                //如果是下拉框，那么读取下拉框关联的隐藏控件的值(ID值,常用与外表关联)
                if (ltype == "select" && options && options.valueFieldID) {
                    value = $("#" + options.valueFieldID).val();
                    name = options.valueFieldID;
                }
                if (op == 'lessorequal' && ltype == 'date') {
                    value = value + ' 23:59:59';
                }
                group.rules.push({
                    op: op,
                    field: name,
                    value: value,
                    type: type
                });
            });
        return group;
    };

    //附加表单搜索按钮：搜索、高级搜索
    LG.appendSearchButtons = function (form, grid, withDr) {
        if (!form) return;
        form = $(form);
        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul><li style="margin-right:8px"></li><li></li></ul><div class="l-clear"></div>').appendTo(form);

        LG.addSearchButtons(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), withDr);

    };


    //创建表单搜索按钮：搜索、高级搜索
    LG.addSearchButtons = function (form, grid, btn1Container, btn2Container, withDr) {
        if (!form) return;
        if (btn1Container) {
            var searchBtn = LG.createButton({
                appendTo: btn1Container,
                text: '搜索',
                click: function () {
                    var rule = LG.bulidFilterGroup(form);
                    if (rule.rules.length) {
                        if (withDr) {
                            dr = {field: 'dr', value: 0, op: 'equal'};
                            rule.rules.push(dr);
                            // grid.set('parms', { where: JSON2.stringify(rule) });
                            grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}])
                        } else {
                            // grid.set('parms', { where: JSON2.stringify(rule) });
                            grid.set('where', {where: JSON2.stringify(rule)});
                        }
                    } else {
                        if (withDr) {
                            var dr = {
                                op: 'and',
                                rules: [{field: 'dr', value: 0, op: 'equal'}]
                            };
                            // grid.set('parms', [{ where: JSON2.stringify(dr) }]);
                            grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}])
                        } else {
                            grid.set('parms', []);
                        }

                    }
                    grid.set('parms', []);
                    grid.changePage('first');
                    grid.loadData();
                }
            });

            $(document).keydown(function (e) {
                if (e.keyCode == 13) {
                    searchBtn.trigger("click");
                }
            });
        }
        if (btn2Container) {
            LG.createButton({
                appendTo: btn2Container,
                width: 80,
                text: '高级搜索',
                click: function () {
                    grid.showFilter();
                }
            });
        }
    };


    //附加表单搜索按钮：搜索、高级搜索、重置
    LG.appendSearchAndRestBtn = function (form, grid, data) {

        if (!form) return;

        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul><li style="margin-right:8px"></li><li></li><li style="margin-left:8px"></li></ul><div class="l-clear"></div>').appendTo($(form));

        LG.addSearchAndRestBtn(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), container.find("li:eq(2)"), data);

    };


    //附加表单搜索按钮：搜索、高级搜索、重置
    LG.appendSearchAndRestBtn = function (form, grid, data, appendParms) {

        if (!form) return;

        //搜索按钮 附加到第一个li  高级搜索按钮附加到 第二个li
        var container = $('<ul class="filter-btn-wrapper"><li style="margin-right:8px"></li><li></li><li style="margin-left:8px"></li></ul><div class="l-clear"></div>').appendTo($(form));

        LG.addSearchAndRestBtn(form, grid, container.find("li:eq(0)"), container.find("li:eq(1)"), container.find("li:eq(2)"), data, appendParms);

    };

    //创建表单搜索按钮：搜索,高级搜索,重置,重置数据,默认过滤条件
    LG.addSearchAndRestBtn = function (ligerForm, grid, btn1Container, btn2Container, btn3Container, data, appendParms) {

        var form = $(ligerForm);

        if (!form) return;
        if (btn1Container) {
            var searchBtn = LG.createButton({
                appendTo: btn1Container,
                text: '搜索',
                click: function () {
                    var rule = LG.bulidFilterGroup(form);
                    if (rule.rules.length) {
                        dr = {field: 'dr', value: 0, op: 'equal'};
                        rule.rules.push(dr);
                        //添加默认条件
                        if (appendParms) {
                            for (i  in appendParms) {
                                rule.rules.push(appendParms[i]);
                            }
                        }
                        grid.set('parms', [{name: 'where', value: JSON2.stringify(rule)}]);
                    } else {
                        var dr = {
                            op: 'and',
                            rules: [{field: 'dr', value: 0, op: 'equal'}]
                        };
                        if (appendParms) {
                            for (i  in appendParms) {
                                dr.rules.push(appendParms[i]);
                            }
                        }
                        grid.set('parms', [{name: 'where', value: JSON2.stringify(dr)}]);
                    }
                    grid.changePage('first');
                    grid.loadData();
                }
            });

            $(document).keydown(function (e) {
                if (e.keyCode == 13) {
                    searchBtn.trigger("click");
                }
            });

        }
        /*    if (btn2Container) {
         LG.createButton({
         appendTo: btn2Container,
         width: 80,
         text: '高级搜索',
         click: function () {
         grid.showFilter();
         }
         });
         }*/

        if (btn3Container) {
            LG.createButton({
                appendTo: btn3Container,
                width: 80,
                text: '重置',
                click: function () {

                    var lform = $.ligerui.get(ligerForm.replace("#", ""));
                    if (lform) {
                        $(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(function () {
                            if (!this.name) return;
                            if (!$(this).hasClass("field")) return;
                            $(this).val("");
                        });

                        lform.setData(data);
                    }

                }
            });
        }
    };


    //创建表单搜索按钮：搜索、高级搜索
    /* LG.addSearchAndRestBtn = function (ligerForm, grid, btn1Container, btn2Container, btn3Container, data) {

     var form = $(ligerForm);

     if (!form) return;
     if (btn1Container) {
     var searchBtn = LG.createButton({
     appendTo: btn1Container,
     width: 80,
     text: '搜索',
     click: function () {
     var rule = LG.bulidFilterGroup(form);
     var param = {}
     if (rule.rules.length) {
     dr = { field: 'dr', value: 0, op: 'equal' };
     rule.rules.push(dr);
     grid.set('parms', [{ name: 'where', value: JSON2.stringify(rule) }])
     } else {
     var dr = {
     op: 'and',
     rules: [{ field: 'dr', value: 0, op: 'equal' }]
     };
     grid.set('parms', [{ name: 'where', value: JSON2.stringify(dr) }])
     }
     grid.changePage('first');
     grid.loadData();
     }
     });

     $(document).keydown(function (e) {
     if (e.keyCode == 13) {
     searchBtn.trigger("click");
     e.preventDefault();
     }
     });

     }
     //        if (btn2Container) {
     //            LG.createButton({
     //                appendTo: btn2Container,
     //                width: 80,
     //                text: '高级搜索',
     //                click: function () {
     //                    grid.showFilter();
     //                }
     //            });
     //        }

     if (btn3Container) {
     LG.createButton({
     appendTo: btn3Container,
     width: 80,
     text: '重置',
     click: function () {

     var lform = $.ligerui.get(ligerForm.replace("#", ""));
     if (lform) {
     $(":input", form).not(":submit, :reset, :image,:button, [disabled]").each(function () {
     if (!this.name) return;
     if (!$(this).hasClass("field")) return;
     $(this).val("");
     });

     lform.setData(data);
     }

     }
     });
     }
     };*/


    //快速设置表单底部默认的按钮:保存、取消
    LG.setFormDefaultBtn = function (cancleCallback, savedCallback) {
        //表单底部按钮
        var buttons = [];
        if (cancleCallback) {
            buttons.push({text: '取消', onclick: cancleCallback});
        }
        if (savedCallback) {
            buttons.push({text: '保存', onclick: savedCallback});
        }
        LG.addFormButtons(buttons);
    };

    //增加表单底部按钮,比如：保存、取消
    LG.addFormButtons = function (buttons) {
        if (!buttons) return;
        var formbar = $("body > div.form-bar");
        if (formbar.length == 0)
            formbar = $('<div class="form-bar"><div class="form-bar-inner"></div></div>').appendTo('body');
        if (!(buttons instanceof Array)) {
            buttons = [buttons];
        }
        $(buttons).each(function (i, o) {
            var btn = $('<div class="l-dialog-btn"><div class="l-dialog-btn-l"></div><div class="l-dialog-btn-r"></div><div class="l-dialog-btn-inner"></div></div> ');
            $("div.l-dialog-btn-inner:first", btn).html(o.text || "BUTTON");
            if (o.onclick) {
                btn.on('click', function () {
                    o.onclick(o);
                });
            }
            if (o.width) {
                btn.width(o.width);
            }
            $("> div:first", formbar).append(btn);
        });
    };

    //填充表单数据
    LG.loadForm = function (mainform, options, callback) {
        options = options || {};
        if (!mainform)
            mainform = $("form:first");
        var p = $.extend({
            beforeSend: function () {
                LG.showLoading('正在加载表单数据中...');
            },
            complete: function () {
                LG.hideLoading();
            },
            success: function (data) {
                var preID = options.preID || "";
                //根据返回的属性名，找到相应ID的表单元素，并赋值
                for (var p in data) {
                    var ele = $("[name=" + (preID + p) + "]", mainform);

                    //针对复选框和单选框 处理
                    if (ele.is(":checkbox,:radio")) {
                        ele[0].checked = data[p] ? true : false;
                    }
                    else {
                        ele.val(data[p]);
                    }
                }
                //下面是更新表单的样式
                var managers = $.ligerui.find($.ligerui.controls.Input);
                for (var i = 0, l = managers.length; i < l; i++) {
                    //改变了表单的值，需要调用这个方法来更新ligerui样式
                    var o = managers[i];
                    o.updateStyle();
                    if (managers[i] instanceof $.ligerui.controls.TextBox)
                        o.checkValue();
                }
                if (callback)
                    callback(data);
            },
            error: function (message) {
                LG.showError('数据加载失败!<BR>错误信息：' + message);
            }
        }, options);
        LG.ajax(p);
    };

    //带验证、带loading的提交
    LG.submitForm = function (mainform, success, error) {
        if (!mainform)
            mainform = $("form:first");
        if (mainform.valid()) {
            mainform.ajaxSubmit({
                dataType: 'json',
                success: success,
                beforeSubmit: function (formData, jqForm, options) {
                    //针对复选框和单选框 处理
                    $(":checkbox,:radio", jqForm).each(function () {
                        if (!existInFormData(formData, this.name)) {
                            formData.push({name: this.name, type: this.type, value: this.checked});
                        }
                    });
                    for (var i = 0, l = formData.length; i < l; i++) {
                        var o = formData[i];
                        if (o.type == "checkbox" || o.type == "radio") {
                            o.value = $("[name=" + o.name + "]", jqForm)[0].checked ? "true" : "false";
                        }
                    }
                },
                beforeSend: function (a, b, c) {
                    LG.showLoading('正在保存数据中...');

                },
                complete: function () {
                    LG.hideLoading();
                },
                error: function (result) {
                    LG.tip('发现系统错误 <BR>错误码：' + result.status);
                }
            });
        }
        else {
            LG.showInvalid();
        }
        function existInFormData(formData, name) {
            for (var i = 0, l = formData.length; i < l; i++) {
                var o = formData[i];
                if (o.name == name) return true;
            }
            return false;
        }
    };

    //提示 验证错误信息
    LG.showInvalid = function (validator) {
        validator = validator || LG.validator;
        if (!validator) return;
        var message = '<div class="invalid">存在' + validator.errorList.length + '个字段验证不通过，请检查!</div>';
        //top.LG.tip(message);
        $.ligerDialog.error(message);
    };

    //消除校验格式
    LG.clearValid = function (form) {
        $(":input", form).not(":submit, :reset, :image,:button, [disabled]")
            .each(function () {
                if (!this.name) return;

                var element = $(this);

                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();

            });
    }

    //表单验证
    LG.validate = function (form, options) {
        if (typeof (form) === "string") {
            form = $(form);
        }
        else if (typeof (form) === "object" && form.NodeType === 1) {
            form = $(form);
        }

        options = $.extend({
            errorPlacement: function (lable, element) {
                if (!element.attr("id"))
                    element.attr("id", new Date().getTime());
                if (element.hasClass("l-textarea")) {
                    element.addClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().addClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
                $(element).attr("title", lable.html()).ligerTip({
                    distanceX: 5,
                    distanceY: -3,
                    auto: true
                });
            },
            success: function (lable) {
                if (!lable.attr("for")) return;
                var element = $("#" + lable.attr("for"));

                if (element.hasClass("l-textarea")) {
                    element.removeClass("l-textarea-invalid");
                }
                else if (element.hasClass("l-text-field")) {
                    element.parent().removeClass("l-text-invalid");
                }
                $(element).removeAttr("title").ligerHideTip();
            }
        }, options || {});
        LG.validator = form.validate(options);
        return LG.validator;
    };


    //三个参数,第三个为默认的菜单元素(一般为不和服务器发生交互的菜单按钮)
    LG.loadToolbar = function (grid, toolbarBtnItemClick, toolbarDefaultOptions) {
        var MenuNo = LG.getPageMenuNo();
        LG.ajax({
            loading: '正在加载工具条中...',
            //url: rootPath + 'Manage/GetMyButton',
            url: '/Admin/Manage/GetMyButton',
            data: {MenuNo: MenuNo},
            success: function (data) {
                if (!grid.toolbarManager) return;
                //if (!data || !data.length) return;
                var items = [];
                //添加服务端的按钮
                for (var i = 0, l = data.length; i < l; i++) {
                    var o = data[i];
                    items[items.length] = {
                        click: toolbarBtnItemClick,
                        text: o.BtnName,
                        img: o.BtnIcon,
                        id: o.BtnNo
                    };
                    items[items.length] = {line: true};
                }
                if (toolbarDefaultOptions) {
                    for (var i = 0, l = toolbarDefaultOptions.length; i < l; i++) {
                        items[items.length] = {
                            click: toolbarBtnItemClick,
                            text: toolbarDefaultOptions[i].text,
                            img: toolbarDefaultOptions[i].img,
                            id: toolbarDefaultOptions[i].id
                        };
                    }
                }
                //如果客户端存在按钮则添加客户端的按钮(一般代表没有和服务器发生交互的事件)
                grid.toolbarManager.set('items', items);
            }
        });
    };

    //关闭Tab项,如果tabid不指定，那么关闭当前显示的
    LG.closeCurrentTab = function (tabid) {
        if (!tabid) {
            tabid = $("#framecenter > .l-tab-content > .l-tab-content-item:visible").attr("tabid");
        }
        if (tab) {
            tab.removeTabItem(tabid);
        }
    };


    LG.clearFlash = function () {
        $.extend($.ligerDefaults.Tab, {
            onBeforeRemoveTabItem: function (tabid) {
                alert(tabid);
            }
        });
    };

    //关闭Tab项并且刷新父窗口
    LG.closeAndReloadParent = function (tabid, parentMenuNo) {
        LG.closeCurrentTab(tabid);
        var menuitem = $("#mainmenu ul.menulist li[menuno=" + parentMenuNo + "]");
        var parentTabid = menuitem.attr("tabid");
        var iframe = window.frames[parentTabid];
        if (tab) {
            tab.selectTabItem(parentTabid);
        }
        if (iframe && iframe.f_reload) {
            iframe.f_reload();
        }
        else if (tab) {
            tab.reload(parentTabid);
        }
    };

    //覆盖页面grid的loading效果
    LG.overrideGridLoading = function () {
        $.extend($.ligerDefaults.Grid, {
            onloading: function () {
                LG.showLoading('正在加载表格数据中...');
            },
            onloaded: function () {
                LG.hideLoading();
            }
        });
    };

    //dr
    LG.fliterDrGrid = function () {
        $.extend($.ligerDefaults.Grid, {
            onLoadData: function () {
                var parms = this.get("parms");

                if (parms.where) {
                    rule = {field: 'dr', value: 0, op: 'equal'};
                    var where = JSON2.parse(parms.where);
                    where.rules.push(rule);
                    parms.where = JSON2.stringify(where);
                    this.set('parms', parms);
                }
                else {
                    var dr = {
                        op: 'or',
                        rules: [{field: 'dr', value: 0, op: 'equal'}, {field: 'dr', op: 'isnull'}]
                    };
                    parms.where = JSON2.stringify(dr);
                    this.set('parms', parms);
                }
            }
        });
    };

    //根据字段权限调整 页面配置
    LG.adujestConfig = function (config, forbidFields) {
        if (config.Form && config.Form.fields) {
            for (var i = config.Form.fields.length - 1; i >= 0; i--) {
                var field = config.Form.fields[i];
                if ($.inArray(field.name, forbidFields) != -1)
                    config.Form.fields.splice(i, 1);
            }
        }
        if (config.Grid && config.Grid.columns) {
            for (var i = config.Grid.columns.length - 1; i >= 0; i--) {
                var column = config.Grid.columns[i];
                if ($.inArray(column.name, forbidFields) != -1)
                    config.Grid.columns.splice(i, 1);
            }
        }
        if (config.Search && config.Search.fields) {
            for (var i = config.Search.fields.length - 1; i >= 0; i--) {
                var field = config.Search.fields[i];
                if ($.inArray(field.name, forbidFields) != -1)
                    config.Search.fields.splice(i, 1);
            }
        }
    };

    //查找是否存在某一个按钮
    LG.findToolbarItem = function (grid, itemID) {
        if (!grid.toolbarManager) return null;
        if (!grid.toolbarManager.options.items) return null;
        var items = grid.toolbarManager.options.items;
        for (var i = 0, l = items.length; i < l; i++) {
            if (items[i].id == itemID) return items[i];
        }
        return null;
    }


    //设置grid的双击事件(带权限控制)
    LG.setGridDoubleClick = function (grid, btnID, btnItemClick) {
        btnItemClick = btnItemClick || toolbarBtnItemClick;
        if (!btnItemClick) return;
        grid.on('dblClickRow', function (rowdata) {
            var item = LG.findToolbarItem(grid, btnID);
            if (!item) return;
            grid.select(rowdata);
            btnItemClick(item);
        });
    }

    //增加必输标示..试用与1.19版本
    LG.addValidateStyle = function (formName) {
        var form = $.ligerui.get(formName);
        if (form) {
            var fields = form.options.fields;
            for (var i in fields) {
                if (fields[i].validate && fields[i].validate.required) {
                    +$("input[name=" + fields[i].name + "]", $("#" + formName)).parent().parent().next(":not(:has(span))").append("<span class='l-star' style='color: red;'>*</span>");
                }
            }
        }
    }

    //弹框形式的form
    LG.openFormDialog = function (form, fields, validate, options, data, callback, status) {
        //ligerui 对象
        var formPanel, win, dlg;
        //初始化
        var win = $("<div></div>");
        var formPanel = $("<form></form>");
        //放入页面的DIV中
        $(form).append(win);
        win.append(formPanel);

        //构建ligerForm
        var lform = formPanel.ligerForm({
            fields: fields,
            validate: validate,
            inputWidth: 220, //控件宽度
            labelWidth: 100,//标签宽度            
            space: 30//间隔宽度
        });

        //初始化值
        if (data) {
            lform.setData(data);
        }
        else {

        }
        //dialog参数初始化,合并
        options = $.extend({
            showType: 'slide',
            width: 390
        }, options || {});

        $.extend(options, {
            target: win,
            buttons: [
                {
                    text: '确定', onclick: function () {
                    callback(dlg, lform, status);
                }
                },
                {
                    text: '取消', onclick: function () {
                    dlg.close();
                }
                }
            ]
        });
        //弹出框
        dlg = $.ligerDialog.open(options);
    };


    // 经过权限判断的工具栏
    // @parm target    元素
    // @parm options   配置
    LG.powerToolBar = function (target, options) {
        // console.log(options);
        if (!target || !options || options.items.length < 1) return false;
        if (disabledButtons.length < 0) return target.ligerToolBar(options);

        var items= options.items;
        var newItems = [];
        for (var i = 0, len = items.length; i < len; i++){
            var item = items[i];
            if (item.menu) {
                var newMenu = [];
                for (var j = 0, jlen = item.menu.items.length; j < jlen; j++) {
                    var jitem = item.menu.items[j];
                    !(disabledButtons.indexOf(jitem.id) >= 0) && newMenu.push(jitem);
                }
                item.menu.items = newMenu;
                (newMenu.length === 0) && disabledButtons.push(item.id);
            }
            if (disabledButtons.indexOf(item.id) === -1) {
                newItems.push(item);
            }
        }
        options.items = newItems;
        // console.log('powerToolBar %o', options);
        return target.ligerToolBar(options);
    }

    // 判断特殊字段
    // @parm options         请求配置（LG.ajax）
    // @parm title           提示
    LG.ajaxSpecialField = function (options) {
        if (!options) return;
        var option = $.extend(options, {
            success: function (data) {
                for (var i = data.data.length - 1; i >= 0; i--) {
                    var item = data[i];
                    var target = liger.get(item.name),
                         targetParent = target.wrapper;
                    target.width(targetParent.width - 40);
                    targetParent.css('icon-alert', 'relative');
                    LG.specialField(targetParent, item.type);
                }
                options.success(data);
            }
        });
        LG.ajax(option);
    };

    // 添加警告提示
    // @parm target          目标元素
    // @parm type            类型
    LG.specialField = function (target, type, title) {
        if(!target) return;
        var titleList = {
            'alert': '未录入'
        };
        if (target.children('.icon-type').length > 1) {
            target.children('.icon-type').attr({
                'class': 'icon-type icon-' + (type || 'none'),
                'title': (title || titleList[type])
            });
        } else {
            target.append('<span class="icon-type icon-' + (type || 'none') + '" title="' + (title || titleList[type]) + '"></span>');
        }
    };

    // 删除警告提示
    LG.clearspecial = function (target) {
        if(!target) return;
        if (target.children('.icon-type').length >= 1) {
            target.children('.icon-type').fadeOut().remove();
        }
    };

})(jQuery);
