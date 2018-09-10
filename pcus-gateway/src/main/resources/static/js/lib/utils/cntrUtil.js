/**
 * 集装箱相关
 * @type {{verifyContainerCode}}
 */
var cntrUtil = (function () {
    return {
        //校验柜号是否正确
        verifyContainerCode: function (strCode) {
            var Charcode = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ";
            if (strCode.length != 11) return false;
            var result = true;
            var num = 0;
            for (var i = 0; i < 10; i++) {
                var idx = Charcode.indexOf(strCode[i]);
                if (idx == -1 || Charcode[idx] == '?') {
                    result = false;
                    break;
                }
                idx = idx * Math.pow(2, i);
                num += idx;
            }
            num = (num % 11) % 10;
            return parseInt(strCode[10]) == num;
        }
    }
})();