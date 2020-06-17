Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

const formatDateyyyyMMdd = function(date) {
    return date.format("yyyy-MM-dd");
}

const getFirstDayOfThisYear = function() {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    return new Date(year, 0, 1);
}

const getFirstDayOfLastYear = function() {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    return new Date(year - 1, 0, 1);
}

const getFirstDayOfLastXMonth = function(x) {
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    debugger
    if (month < x) {
        month = month + 12 - x;
        year = year - 1;
    } else {
        month = month - x;
    }
    return new Date(year, month, 1);
}

const getLastDayOfLastXMonth = function(x) {
    var tDate = getFirstDayOfLastXMonth(x - 1);
    tDate.setDate(tDate.getDate(-1));
    return tDate;
}

export default {
    formatDateyyyyMMdd,
    getFirstDayOfThisYear,
    getFirstDayOfLastYear,
    getFirstDayOfLastXMonth,
    getLastDayOfLastXMonth
}