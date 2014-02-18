var aliyun = aliyun || {};

aliyun.cnzz = aliyun.cnzz || {};

aliyun.cnzz.widget = aliyun.cnzz.widget || {};

(function() {
    // static date function
    var SDF = {
        /**
         * 根据字符串获得日期毫秒数
         * @name getStimeByStringDate
         * @param {sDate} yyyy-mm-dd
         * @function
         * @return {int} 毫秒数
         */
        getStimeByStringDate: function(sDate) {
            return this.getObjDateByString(sDate).getTime();
        },
        /**
         * 根据日期毫秒数获得字符串
         * @name getStringDateByStime
         * @param {sTime} int
         * @function
         * @return {sDate} yyyy-mm-dd
         */
        getStringDateByStime: function(sTime) {
            return this.getStringDateByOdate(new Date(parseInt(sTime, 10)));
        },
        /**
         * 根据日期对象获得字符串
         * @name getStringDateByOdate
         * @param {oDate} DateObj
         * @function
         * @return {sDate} yyyy-mm-dd
         */
        getStringDateByOdate: function(oDate) {
            var that = this;
            return that.getYears(oDate) + "-" + that.formatNum(that.getMonths(oDate)) + "-" + that.formatNum(that.getDay(oDate));
        },
        setSelectDateString: function() {
            var that = this;
            return that.selectDate.st + this.language.to + that.selectDate.et;
        },
        /**
         * 根据字符串获得日期对象
         * @name getObjDateByString
         * @param {sDate} yyyy-mm-dd
         * @function
         * @return {oDate} DateObj
         */
        getObjDateByString: function(sDate) {
            var yyyy = sDate.split("-")[0],
                mm = sDate.split("-")[1],
                dd = sDate.split("-")[2];
            var oDate = new Date(yyyy, parseInt(mm, 10) - 1, parseInt(dd, 10));
            return oDate;
        },
        /**
         * 获得按照月指定步长的日期对象
         * @name getODateStepMonth
         * @param {oDate} DateObj
         * @param {int}  正数向未来，负数向以前
         * @function
         * @return {oDate} DateObj
         */
        getODateStepMonth: function(oDate, step) {
            var that = this,
                date = new Date(that.getYears(oDate), that.getMonths(oDate) - 0 + step, 0);
            return date;
        },
        /**
         * 获得星期几（注意0表示星期天）
         * @name getWeek
         * @param {sDate} DateObj
         * @function
         * @return {int}
         */
        getWeek: function(oDate) {
            return oDate.getDay() - 0;
        },
        /**
         * 获得几号
         * @name getDay
         * @param {sDate} DateObj
         * @function
         * @return {int}
         */
        getDay: function(oDate) {
            return oDate.getDate() - 0;
        },
        /**
         * 获得oDate 的月的天数
         * @name getDays
         * @param {oDate} DateObj
         * @function
         * @return {int}
         */
        getDays: function(oDate) {
            var date = new Date(this.getYears(oDate), this.getMonths(oDate), 0);
            return date.getDate();
        },
        /**
         * 获得oDate 的月份
         oLastMonth* @name getM/nths
         * @param {oDate} DateObj
         * @function
         * @return {int}
         */
        getMonths: function(oDate) {
            return oDate.getMonth() - 0 + 1;
        },
        /**
         * 获得oDate 的年份
         * @name getYears
         * @param {oDate} DateObj
         * @function
         * @return {int}
         */
        getYears: function(oDate) {
            return oDate.getFullYear() - 0;
        },
        /**
         * 格式化数字，不足两位前面补0
         * @name formatNum
         * @param {number}  要格式化的数字
         * @function
         * @return {string}
         */
        formatNum: function(num) {
            return num.toString().replace(/^(\d)$/, "0$1");
        },
        /**
         * 选择的时间格式化处理
         * @name setSelectDate
         * @param {string}  yyyy-mm-dd至yyyy-mm-dd
         * @function
         * @return {obj}
         */
        setSelectDate: function(selectDate) {
            return {
                st: selectDate.split(this.language.to)[0],
                et: selectDate.split(this.language.to)[1]
            };
        },
        /**
         * yyyy-mm-dd至yyyy-mm-dd 格式检查
         * @name checkFormater
         * @param {string}  yyyy-mm-dd至yyyy-mm-dd
         * @function
         * @return {boolean}
         */
        checkFormater: function(val) {
            if (!val) {
                return false;
            }
            var dates = val.split(this.language.to),
                rDate = /^\d{4}-\d{2}-\d{2}$/;
            if (dates && dates[0] && rDate.test(dates[0]) && dates[1] && rDate.test(dates[1])) {
                return true;
            }
            return false;
        },
        /**
         * yyyy-mm-dd格式检查
         * @name checkSingleDateFormater
         * @param {string}  yyyy-mm-dd
         * @function
         * @return {boolean}
         */
        checkSingleDateFormater: function(date) {
            var rDate = /^\d{4}-\d{2}-\d{2}$/;
            if (date && rDate.test(date)) {
                var months = date.split("-")[1];
                if (parseInt(months, 10) > 0 && parseInt(months, 10) <= 12) {
                    var days = date.split("-")[2];
                    if (parseInt(days, 10) > 0 && parseInt(days, 10) <= 31) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 按照步长 获取天  时间
         * @name getStepDayDate
         * @param {DateObj}  参考时间
         * @param {int} 步长
         * @function
         * @return {DateObj}
         */
        getStepDayDate: function(referODate, step) {
            return new Date(referODate.getTime() + step * 864e5);
        },
        /**
         * 最近7天
         * @name getLast7Date
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getLast7Date: function(referODate) {
            var that = this,
                last7Date = new Date(referODate.getTime() - 6 * 864e5);
            return {
                st: that.getYears(last7Date) + "-" + that.formatNum(that.getMonths(last7Date)) + "-" + that.formatNum(that.getDay(last7Date)),
                et: that.getYears(referODate) + "-" + that.formatNum(that.getMonths(referODate)) + "-" + that.formatNum(that.getDay(referODate))
            };
        },
        /**
         * 最近30天
         * @name getLast30Date
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getLast30Date: function(referODate) {
            var that = this,
                last30Date = new Date(referODate.getTime() - 30 * 864e5);
            return {
                st: that.getYears(last30Date) + "-" + that.formatNum(that.getMonths(last30Date)) + "-" + that.formatNum(that.getDay(last30Date)),
                et: that.getYears(referODate) + "-" + that.formatNum(that.getMonths(referODate)) + "-" + that.formatNum(that.getDay(referODate))
            };
        },
        /**
         * 获得本月时间
         * @name getMonthDate
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getMonthDate: function(referODate) {
            var that = this,
                day = that.getDay(referODate);
            return {
                st: that.getYears(referODate) + "-" + that.formatNum(that.getMonths(referODate)) + "-" + "01",
                et: that.getYears(referODate) + "-" + that.formatNum(that.getMonths(referODate)) + "-" + that.formatNum(day)
            };
        },
        /**
         * 获得上月时间
         * @name getLastMonthDate
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getLastMonthDate: function(referODate) {
            var that = this,
                lastMonth = that.getODateStepMonth(referODate, -1);
            return {
                st: that.getYears(lastMonth) + "-" + that.formatNum(that.getMonths(lastMonth)) + "-" + "01",
                et: that.getYears(lastMonth) + "-" + that.formatNum(that.getMonths(lastMonth)) + "-" + that.formatNum(that.getDays(lastMonth))
            };
        },
        /**
         * 获得本周时间
         * @name getWeekDate
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getWeekDate: function(referODate) {
            var that = this;
            var week = that.getWeek(referODate) - 1,
                date = that.getStepDayDate(referODate, -week);
            return {
                st: that.getYears(date) + "-" + that.formatNum(that.getMonths(date)) + "-" + that.formatNum(that.getDay(date)),
                et: that.getYears(referODate) + "-" + that.formatNum(that.getMonths(referODate)) + "-" + that.formatNum(that.getDay(referODate))
            };
        },
        /**
         * 获得上周时间
         * @name getLastWeekDate
         * @param {DateObj}  参考时间
         * @function
         * @return {st : 'xxxx-xx-xx', et : 'xxxx-xx-xx'}
         */
        getLastWeekDate: function(referODate) {
            var that = this;
            var week = that.getWeek(referODate),
                date = that.getStepDayDate(referODate, -week),
                date2 = that.getStepDayDate(date, -6);
            return {
                st: that.getYears(date2) + "-" + that.formatNum(that.getMonths(date2)) + "-" + that.formatNum(that.getDay(date2)),
                et: that.getYears(date) + "-" + that.formatNum(that.getMonths(date)) + "-" + that.formatNum(that.getDay(date))
            };
        },
        /**
         * 根据参照时间，向前，或向后 获得等长的时间 如果时间长度不够，则返回referStringDate
         * @name getForntSameLengthDate
         * @param {string} referStringDate xxxx-xx-xx至xxxx-xx-xx
         * @param {string}  minDate(xxxx-xx-xx)
         * @param {string}  maxDate{xxxx-xx-xx}
         * @param {int} defaultOrientation{默认方向 1表示向未来，-1表示向过去}
         * @function
         * @return {string} sameStringDate{xxxx-xx-xx至xxxx-xx-xx}
         */
        getForntSameLengthDate: function(referStringDate, minDate, maxDate, defaultOrientation) {
            var that = this,
                compareStringDate = referStringDate;
            var st = referStringDate.split(this.language.to)[0],
                et = referStringDate.split(this.language.to)[1],
                ost = that.getObjDateByString(st),
                oet = that.getObjDateByString(et),
                timeLength = oet.getTime() - ost.getTime(),
                timeLengthDays = timeLength / 864e5,
                nOst, nOet;
            // 向未来  向过去是否有等长判断
            var isSameLengthNext = that.getObjDateByString(maxDate).getTime() - that.getStepDayDate(oet, parseInt(timeLengthDays, 10) + 1).getTime();
            var isSameLengthPrev = that.getStepDayDate(ost, -parseInt(timeLengthDays, 10) + 1).getTime() - that.getObjDateByString(minDate).getTime();
            if (isSameLengthNext < 0 && isSameLengthPrev < 0) {
                return referStringDate;
            } else {}
            if (defaultOrientation === 1) {
                //向未来
                nOst = that.getStepDayDate(oet, 1);
                nOet = new Date(nOst.getTime() + timeLength);
                compareStringDate = that.getStringDateByOdate(nOst) + this.language.to + that.getStringDateByOdate(nOet);
                if (that.getObjDateByString(maxDate).getTime() < nOet.getTime() || that.getObjDateByString(maxDate).getTime() < nOst.getTime()) {
                    compareStringDate = referStringDate;
                }
            } else if (defaultOrientation === -1) {
                //向过去
                nOet = that.getStepDayDate(ost, -1);
                nOst = new Date(nOet.getTime() - timeLength);
                compareStringDate = that.getStringDateByOdate(nOst) + this.language.to + that.getStringDateByOdate(nOet);
                if (nOst.getTime() < that.getObjDateByString(minDate).getTime() || nOet.getTime() < that.getObjDateByString(minDate).getTime()) {
                    compareStringDate = referStringDate;
                }
            }
            return compareStringDate;
        },
        /**
         * 获得上周同期
         * @name getLastWeekDay
         * @param {DateObj}  参考时间
         * @function
         * @return {DateObj}
         */
        getLastWeekDay: function(referODate) {
            return this.getStepDayDate(referODate, -7);
        },
        /**
         * 获得上周同期
         * @name getLastWeekStringDay
         * @param {DateObj}  参考时间
         * @function
         * @return {DateObj}
         */
        getLastWeekStringDay: function(referODate) {
            return this.getStringDateByOdate(this.getLastWeekDay(referODate));
        },
        /**
         * 获得上月同期
         * @name getLastMonthDay
         * @param {DateObj}  参考时间
         * @function
         * @return {DateObj}
         */
        getLastMonthDay: function(referODate) {
            var referODateDays = this.getDay(referODate),
                prevMonthODate = this.getODateStepMonth(referODate, -1);
            prevMonthODate.setDate(referODateDays);
            return prevMonthODate;
        },
        /**
         * 获得上月同期
         * @name getLastMonthStringDay
         * @param {DateObj}  参考时间
         * @function
         * @return {DateObj}
         */
        getLastMonthStringDay: function(referODate) {
            return this.getStringDateByOdate(this.getLastMonthDay(referODate));
        },
        setCaretPosition: function(ctrl, pos) {
            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            } else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();
            }
        },
        // 根据参考日期获取上一个自然周 
        // dir 默认是-1
        getNatureWeek: function(referODate, minDate, maxDate, dir) {
            var oMax = this.getObjDateByString(maxDate),
                oMin = this.getObjDateByString(minDate);
            if (dir === 1) {
                if (oMax.getTime() < referODate.getTime()) {
                    ost = oMax;
                    oet = oMax;
                }
                var rOdate = this.getStepDayDate(referODate, 7),
                    weekDay = this.getWeek(rOdate);
                if (weekDay === 0) {
                    weekDay = 7;
                }
                var ost = this.getStepDayDate(rOdate, 1 - weekDay),
                    oet = this.getStepDayDate(rOdate, 7 - weekDay);
                if (oMax.getTime() < ost.getTime()) {
                    ost = oMax;
                    oet = oMax;
                }
                if (oMax.getTime() < oet.getTime()) {
                    oet = oMax;
                }
                return this.getStringDateByOdate(ost) + this.language.to + this.getStringDateByOdate(oet);
            } else {
                if (oMin.getTime() > referODate.getTime()) {
                    ost = oMin;
                    oet = oMin;
                }
                var rOdate = this.getStepDayDate(referODate, -7),
                    weekDay = this.getWeek(rOdate);
                if (weekDay === 0) {
                    weekDay = 7;
                }
                var ost = this.getStepDayDate(rOdate, 1 - weekDay),
                    oet = this.getStepDayDate(rOdate, 7 - weekDay);
                if (oMin.getTime() > ost.getTime()) {
                    ost = oMin;
                }
                if (oMin.getTime() > oet.getTime()) {
                    oet = oMin;
                }
                return this.getStringDateByOdate(ost) + this.language.to + this.getStringDateByOdate(oet);
            }
        },
        // 根据参考日期获取上一个自然月
        getNatureMonth: function(referODate, minDate, maxDate, dir) {
            var oMax = this.getObjDateByString(maxDate),
                oMin = this.getObjDateByString(minDate);
            if (dir === 1) {
                if (oMax.getTime() < referODate.getTime()) {
                    return 0;
                }
                var rOdate = this.getODateStepMonth(referODate, 1),
                    day = this.getDay(rOdate),
                    days = this.getDays(rOdate);
                var ost = this.getStepDayDate(rOdate, 1 - day),
                    oet = this.getStepDayDate(rOdate, days - day);
                if (oMax.getTime() < ost.getTime()) {
                    return 0;
                }
                if (oMax.getTime() < oet.getTime()) {
                    oet = oMax;
                }
                return this.getStringDateByOdate(ost) + this.language.to + this.getStringDateByOdate(oet);
            } else {
                if (oMin.getTime() > referODate.getTime()) {
                    return 0;
                }
                var rOdate = this.getODateStepMonth(referODate, -1),
                    day = this.getDay(rOdate),
                    days = this.getDays(rOdate);
                var ost = this.getStepDayDate(rOdate, 1 - day),
                    oet = this.getStepDayDate(rOdate, days - day);
                if (oMin.getTime() > ost.getTime()) {
                    ost = oMin;
                }
                if (oMin.getTime() > oet.getTime()) {
                    oet = oMin;
                }
                return this.getStringDateByOdate(ost) + this.language.to + this.getStringDateByOdate(oet);
            }
        },
        // 是不是自然周
        isNatureWeek: function(sDate, minDate) {
            var that = this,
                st = sDate.split(that.language.to)[0],
                et = sDate.split(that.language.to)[1],
                ost = that.getObjDateByString(st),
                oet = that.getObjDateByString(et),
                con1 = that.getWeek(ost) === 1,
                con2 = that.getWeek(oet) === 0,
                con3 = parseInt((oet.getTime() - ost.getTime()) / 864e5, 10) === 6;
            if (con1 && con2 && con3) {
                return true;
            }
            if (st === minDate && con2 && parseInt((oet.getTime() - ost.getTime()) / 864e5, 10) < 6) {
                return true;
            }
            return false;
        },
        // 是不是自然月
        isNatureMonth: function(sDate, minDate) {
            var that = this,
                st = sDate.split(that.language.to)[0],
                et = sDate.split(that.language.to)[1],
                ost = that.getObjDateByString(st),
                oet = that.getObjDateByString(et),
                con1 = that.getMonths(ost) === that.getMonths(oet),
                con2 = that.getYears(ost) === that.getYears(oet),
                con3 = that.getDay(ost) === 1,
                con4 = that.getDay(oet) === that.getDays(oet);
            if (con1 && con2 && con3 && con4) {
                return true;
            }
            if (st === minDate && con1 && con4) {
                return true;
            }
            return false;
        },
        // 是否有周选择
        isHasWeekTab: function(minDate, maxDate) {
            var that = this,
                oMinDate = that.getObjDateByString(minDate),
                oMaxDate = that.getObjDateByString(maxDate),
                minStime = oMinDate.getTime(),
                maxStime = oMaxDate.getTime(),
                con1 = parseInt((maxStime - minStime) / 864e5, 10) < 6,
                con2 = false;
            for (var time = minStime; time <= maxStime; time = time + 864e5) {
                var oDate = new Date(parseInt(time, 10));
                if (that.getWeek(oDate) === 0) {
                    con2 = true;
                    break;
                }
            }
            if (con1 && !con2) {
                return false;
            }
            return true;
        },
        //是否月选择
        isHasMonthTab: function(minDate, maxDate) {
            var that = this,
                oMinDate = that.getObjDateByString(minDate),
                oMaxDate = that.getObjDateByString(maxDate),
                con1 = that.getYears(oMinDate) === that.getYears(oMaxDate),
                con2 = that.getMonths(oMinDate) === that.getMonths(oMaxDate);
            if (con1 && con2) {
                return false;
            }
            return true;
        }
    };
    SDF.setLanguage = function(language) {
        this.language = language;
    };
    SDF.setLanguage();
    aliyun.cnzz.widget.dateUtil = SDF;
})();
