export default {
    //获取两个时间段之间有多少天
    getDateDif (fd, sd) {
        //开始时间
        let firstDate = new Date(fd);
        //结束时间
        let secondDate = new Date(sd);
        let diff = Math.abs(firstDate.getTime() - secondDate.getTime());
        let result = parseInt(diff / (1000 * 60 * 60 * 24));
        return result;
    },
    mGetDate () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        return d.getDate();
    },
    //获取年月日
    formatDate (Separator) {
        if(!Separator){
            Separator = "-" ;
        }
        let d = new Date();
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        let year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [year, month, day].join(Separator);
    },
    //获取上个月 默认查询上个月  可传参
    formatDateLastMonth (n = 1) {
        let d = new Date();
        let month = "" + ((d.getMonth()) - (n - 1));
        let year = d.getFullYear();
        if (month == 0) {
            month = 12
            year = year - 1
        }
        if (month.length < 2) month = "0" + month;
        return [year, month].join("-");
    },
    // 获取年月日 时分秒
    formatChinaDate (date) {
        let d = new Date();
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        let year = d.getFullYear();
        let hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return (
            year +
            "年" +
            month +
            "月" +
            day +
            "日    " +
            hour +
            ":" +
            min +
            ":" +
            sec
        );
    },
    toMinute (v) {
        if (typeof v == "number") {
            return parseInt(v / (1000 * 60));
        }
    },
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     **/
    formateDateProp (fmt, timestape) {
        // author: meizz
        let d = new Date(timestape);
        var o = {
            "M+": d.getMonth() + 1, // 月份
            "d+": d.getDate(), // 日
            "h+": d.getHours(), // 小时
            "m+": d.getMinutes(), // 分
            "s+": d.getSeconds(), // 秒
            "q+": Math.floor((d.getMonth() + 3) / 3), // 季度
            S: d.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (d.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    },
    //将秒数转换为时分秒格式
    formatSeconds (value) {
        var theTime = parseInt(value); // 秒
        var middle = 0; // 分
        var hour = 0; // 小时

        if (theTime > 60) {
            middle = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (middle > 60) {
                hour = parseInt(middle / 60);
                middle = parseInt(middle % 60);
            }
        }
        // var result = "" + parseInt(theTime);
        var result = "";
        if (middle > 0) {
            // result = "" + parseInt(middle) + ":" + result;
            if (middle < 10) {
                result = "0" + parseInt(middle);
            } else {
                result = "" + parseInt(middle);
            }
        } else {
            result = "00";
        }
        if (hour > 0) {
            if (hour < 10) {
                result = "0" + parseInt(hour) + ":" + result;
            } else {
                result = "" + parseInt(hour) + ":" + result;
            }
        } else {
            result = "00" + ":" + result;
        }
        return result;
    },

    //时间戳  转时分秒
    format (shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        // return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
        return y + '-' + add0(m) + '-' + add0(d);
    },

    /**
 * 获取当前时间 传参 start 后得到是 90 天前的 时间 时间戳
 * @param {string} type
 * @returns {Date}
 */
    getTime (type, day = 60) {
        if (type === 'start') {
            return new Date().getTime() - 3600 * 1000 * 24 * day
        } else {
            return new Date(new Date().toDateString())
        }
    },

    //根据身份证算出年龄
    getAge (identify) {
        var UUserCard = identify;
        if (UUserCard != null && UUserCard != '') {
            //获取年龄
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
            if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
                age++;
            }
            return age;
            //
        }
    },

    formatDateCostomer (date, fenge) {
        let d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        let year = d.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        return [year, month, day].join(fenge);
    },
    deepClone (obj) {
        var oType = this.getObjectType(obj);
        // eslint-disable-next-line eqeqeq
        if (oType == "Object") {
            var result = {};
            for (let key in obj) {
                result[key] = this.deepClone(obj[key]);
            }
            return result;
            // eslint-disable-next-line eqeqeq
        } else if (oType == "Array") {
            // eslint-disable-next-line no-redeclare
            var result = [];
            for (var i = 0; i < obj.length; i++) {
                result[i] = this.deepClone(obj[i]);
            }
            return result;
        } else {
            return obj;
        }
    },

    getObjectType (o) {
        if (o === null) return "Null";
        if (o === undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8, -1);
    },
    numberThousandFmt: function (num) {
        try {
            if (num > 10000) {
                num = this.fomatFloat(num / 1000, 1) + "K";
            }
        } catch (e) {
            return "0";
        }
        return num;
    },
    uuid () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";

        this.uuidA = s.join("");
        console.log(s.join(""), 's.join("")');
        return this.uuidA;
    },
    //判断浏览器的类型
    myBrowser () {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE =
            userAgent.indexOf("compatible") > -1 &&
            userAgent.indexOf("MSIE") > -1 &&
            !isOpera; //判断是否IE浏览器
        var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
        var isSafari =
            userAgent.indexOf("Safari") > -1 &&
            userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
        var isChrome =
            userAgent.indexOf("Chrome") > -1 &&
            userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return "IE7";
            } else if (fIEVersion == 8) {
                return "IE8";
            } else if (fIEVersion == 9) {
                return "IE9";
            } else if (fIEVersion == 10) {
                return "IE10";
            } else if (fIEVersion == 11) {
                return "IE11";
            } else {
                return "0";
            } //IE版本过低
            return "IE";
        }
        if (isOpera) {
            return "Opera";
        }
        if (isEdge) {
            return "Edge";
        }
        if (isFF) {
            return "FF";
        }
        if (isSafari) {
            return "Safari";
        }
        if (isChrome) {
            return "Chrome";
        }
    },
    //非空判断
    dataNull (value, run = "--") {
        // if(value === false || value === null || value === 0 || value === "" || value === undefined || value !== value){
        if (
            value === null ||
            value === "" ||
            value === undefined ||
            value !== value ||
            isNaN(value)
        ) {
            return run;
        } else {
            return value;
        }
    },
    toDate (v) {
        if (!v) return "";
        var time = new Date(v);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return (
            y +
            "-" +
            (m < 10 ? "0" + m : m) +
            "-" +
            (d < 10 ? "0" + d : d) +
            " " +
            (h < 10 ? "0" + h : h) +
            ":" +
            (mm < 10 ? "0" + mm : mm) +
            ":" +
            (s < 10 ? "0" + s : s)
        );
    },
    //计算除法
    roundFun (val, n, symbol) {
        if (!val) {
            return 0;
        }
        val = val / 100
        return Math.round(val * Math.pow(10, n)) / Math.pow(10, n);
    },
    //计算乘法
    accMul (arg1, arg2) {
        if (!arg1) {
            return 0;
        }
        var m = 0, s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) { }
        try {
            m += s2.split(".")[1].length
        } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
        )
    },
    //根据出生日期 算年龄
    ages (str) {
        var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return false;
        var d = new Date(r[1], r[3] - 1, r[4]);
        if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            return (Y - r[1]);
        }
        return ("输入的日期格式错误！");
    },
    /**数组根据数组对象中的某个属性值进行排序的方法
     * 使用例子：newArray.sort(sortByArr(['number'],false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
     * @param attr 排序的属性 ['name','sex'...],根据一个字段或者多个字段排序
     * @param rev true表示升序排列，false降序排序
     * */
    sortByArr(arr, rev) {
        if (rev == undefined) {
            rev = 1;
        } else {
            rev = rev ? 1 : -1;
        }
        return function(a, b) {
            for (var i = 0; i < arr.length; i++) {
                let attr = arr[i];
                if (a[attr] != b[attr]) {
                    if (a[attr] > b[attr]) {
                        return rev * 1;
                    } else {
                        return rev * -1;
                    }
                }
            }
        };
    },
};

function add0 (m) { return m < 10 ? '0' + m : m };


