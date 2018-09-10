(function ($) {
    $.validator.addMethod(
            "notnull",
            function (value, element)
            {
                if (!value) return true;
                return !$(element).hasClass("l-text-field-null");
            },
            "不能为空"
    );

    //字母数字
    jQuery.validator.addMethod("alnum", function (value, element)
    {
        return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
    }, "只能包括英文字母和数字");

    // 手机号码验证   
    jQuery.validator.addMethod("cellphone", function (value, element)
    {
        var length = value.length;
        return this.optional(element) || (length == 11 && /^(1\d{10})$/.test(value));
    }, "请正确填写手机号码");

    // 电话号码验证   
    jQuery.validator.addMethod("telephone", function (value, element)
    {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写电话号码");

    // 邮政编码验证
    jQuery.validator.addMethod("zipcode", function (value, element)
    {
        var tel = /^[0-9]{6}$/;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写邮政编码");

    // 汉字
    jQuery.validator.addMethod("chcharacter", function (value, element)
    {
        var tel = /^[\u4e00-\u9fa5]+$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入汉字");



    // QQ
    jQuery.validator.addMethod("qq", function (value, element)
    {
        var tel = /^[1-9][0-9]{4,}$/;
        return this.optional(element) || (tel.test(value));
    }, "请输入正确的QQ");

    // 用户名
    jQuery.validator.addMethod("username", function (value, element)
    {
        return this.optional(element) || /^[a-zA-Z][a-zA-Z0-9_]+$/.test(value);
    }, "用户名格式不正确");

    //小数点后不能超过2位
    jQuery.validator.addMethod("isTwoPrecision", function (value, element, param) {
        //声明返回值
        var returnValue = true;

        if (!param) return true;
        value = value.toString();
        //如果是小数
        var reg1 = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
        if (reg1.test(value) == true) {
            if (value.indexOf(".") != -1) {
                if (value.substring(value.indexOf(".") + 1, value.length).length > 2) {
                    returnValue = false
                }
            }
        }
        return returnValue;
    }, "小数点后不能超过2位");

    jQuery.validator.addMethod("textRequired", function (value, element, param) {
        //声明返回值
        if (!value) return true;
    }, "文本框不能为空");

    jQuery.validator.addMethod("containerCode", function (value, element, param) {
        if (value) {
            return cntrUtil.verifyContainerCode(value);
        }
        return true;
    }, "集装箱号不正确");

    
})(jQuery);