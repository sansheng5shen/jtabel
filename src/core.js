"use strict";
function log(){
	console.log(arguments);
}

var SDF = require('./sdf').SDF;

function Calendar(opts) {
    this.now = new Date().getTime();
    this.opts = opts;
    this._init();
}

Calendar.prototype = {
    constructor: Calendar,
    _configInit: function() {
        var that = this,
            opts = that.opts;
        //input 是否只读
        that.isReadOnly = opts.isReadOnly || 0;
        //日历面板数
        that.panelCounts = opts.panelCounts || 1;
        //按照月翻日历步长
        that.monStep = opts.monthStep || 1;
        //日历按照单天选择还是按照区间选择
        that.isRangDate = opts.isRangDate || 1;
        //必填项 今天
        that.today = opts.today;
        //必填项 最小日期
        that.minDate = opts.minDate;
        //必填项 最大日期
        that.maxDate = opts.maxDate;
		//必填项 input 节点
		that.triggerNodeId = opts.id;

        that.language = opts.language || '_zh';

        that.showPosition = opts.showPosition || 'left';

		that.calendarId = 'calendar_' + that.now + '_' + that.triggerNodeId;
		that.aPrefix = that.calendarId + '_a_';
    },
    _lgInint: function() {
        var that = this,
            lg = {};
        if (that.language === '_zh') {
            lg = {
                to: '至',
                closeBtnTxt: '关闭',
                okBtnTxt: '确定',
                defineTxt: '自定义',
                weekTxt: ['日', '一', '二', '三', '四', '五', '六'],
                yearTxt: '年',
                monthTxt: '月',
				separator: '-',
                errorTip: {
                    'ET1': '时间格式不正确',
                    'ET2': '开始时间格式不正确',
                    'ET3': '结束时间格式不正确',
                    'ET4': '开始时间不能小于最小时间',
                    'ET5': '结束时间不能大于最大时间',
                    'ET6': '最小时间不能大于最大时间'
                }
            };
        } else {
            lg = that.language;
        }
        that.lg = lg;
    },
	_sdfInit: function(){
		var that = this, opts = that.opts, option = {
			separator: that.lg.separator,
			date2Separator: that.lg.to,
			minDate: opts.minDate,
			maxDate: opts.maxDate
		};
		var sdf = new SDF(option);					  
		that.sdf = sdf;
		that.today = sdf.getArrayDateByString(opts.today);	
		that.minDate = sdf.getArrayDateByString(opts.minDate);	
		that.maxDate = sdf.getArrayDateByString(opts.maxDate);	
	},
	_init: function() {
        this._configInit();
        this._lgInint();
		this._sdfInit();

    },
	_render: function(){
			 
	},

    last: function() {

    }
};

exports.Calendar = Calendar;
