"use strict";

function Calendar(opts) {
	this.now = new Date().getTime();
	this.opts = opts;
	this.triggerInputEl = $('#' + opts.id);
	this._init();
}

Calendar.prototype = {
	constructor : Calendar,
	_configInit : function() {
		var that = this, opts = that.opts;
		//input 是否只读
		that.isReadOnly = typeof opts.isReadOnly === 'undefined' ? 0 : opts.isReadOnly;
		//日历面板数
		that.panelCounts = opts.panelCounts || 1;
		//按照月翻日历步长
		that.monStep = opts.monthStep || 1;
		//整月选择
		that.isSelectAllMonth = typeof opts.isSelectAllMonth === 'undefined' ? 1 : opts.isSelectAllMonth;
		//按周选
		that.isSelectWeek = typeof opts.isSelectWeek === 'undefined' ? 0 : opts.isSelectWeek;
		//必填项 今天
		that.today = opts.today;
		//必填项 最小日期
		that.minDate = opts.minDate;
		//必填项 最大日期
		that.maxDate = opts.maxDate;
		//必填项 选中日期
		that.selectDate = opts.selectDate;
		//必填项 input 节点
		that.triggerNodeId = opts.id;
		
		that.isClickDocClose = opts.isClickDocClose || 0;

		that.language = opts.language || '_zh';

		that.showPosition = opts.showPosition || 'left';

		that.parentContainer = opts.parentContainer;

		that.calendarId = 'calendar_' + that.now + '_' + that.triggerNodeId;
		that.aPrefix = that.calendarId + '_a_';
		that.className = {
			aSelectStart : 'aSelectStart',
			aSelectEnd : 'aSelectEnd',
			aSelected : 'aSelected',
			aDisabled : 'aDisabled',
			aHovered : 'aHovered',
			hovered : 'hovered',
			selected : 'selected',
			disabled : 'disabled',
			errored : 'errored'
		}
	},
	_lgInint : function() {
		var that = this, lg = {};
		if (that.language === '_zh') {
			lg = {
				to : '至',
				closeBtnTxt : '关闭',
				okBtnTxt : '确定',
				defineTxt : '自定义',
				weekTxt : ['日', '一', '二', '三', '四', '五', '六'],
				yearTxt : '年',
				monthTxt : '月',
				separator : '-',
				errorTip : {
					'ET1' : '时间格式不正确',
					'ET2' : '开始时间格式不正确',
					'ET3' : '结束时间格式不正确',
					'ET4' : '开始时间不能小于最小时间',
					'ET5' : '结束时间不能大于最大时间',
					'ET6' : '最小时间不能大于最大时间'
				}
			};
		} else {
			lg = that.language;
		}
		that.lg = lg;
	},
	_sdfInit : function() {
		var that = this, opts = that.opts, option = {
			separator : that.lg.separator,
			date2Separator : that.lg.to,
			minDate : opts.minDate,
			maxDate : opts.maxDate
		};
		var sdf = new SDF(option);
		that.sdf = sdf;
		that._setRightDate();
	},
	_setRightDate : function() {
		var that = this, sdf = that.sdf, opts = that.opts;
		that.today = sdf.getArrayDateByString(opts.today);
		that.minDate = sdf.getArrayDateByString(opts.minDate);
		that.maxDate = sdf.getArrayDateByString(opts.maxDate);

		if (that.sdf.getStime(that.today) > that.sdf.getStime(that.maxDate) || that.sdf.getStime(that.today) < that.sdf.getStime(that.minDate)) {
			that.today = that.maxDate;
		}

		var selectDate = that.selectDate.split(that.lg.to), selectDatesLength = selectDate.length;
		if (selectDatesLength === 2) {
			that.selectDate = getRightSelectDate(sdf.getArrayDateByString(selectDate[0]), sdf.getArrayDateByString(selectDate[1]));
			if (that.isSelectWeek && !that.sdf.isNatureWeek(that.selectDate)) {
				that.selectDate = that.sdf.getNatureCurrWeek(that.selectDate);
			}
		} else {
			that.selectDate = getRightSelectDate(sdf.getArrayDateByString(selectDate[0]));
		}
		that._selectDate = that.selectDate;
		that.selectDatesLength = selectDatesLength;

		function getRightSelectDate(rDate, rDate2) {
			var min_stime = that.sdf.getStime(that.minDate), max_stime = that.sdf.getStime(that.maxDate);
			var rDate_stime = that.sdf.getStime(rDate);
			if (rDate2) {
				var rDate2_stime = that.sdf.getStime(rDate2);
				if (rDate_stime < min_stime || rDate_stime > max_stime || rDate2_stime < min_stime || rDate2_stime > max_stime) {
					return [that.today, that.today];
				} else if (rDate_stime > rDate2_stime) {
					return [rDate2, rDate];
				} else {
					return [rDate, rDate2]
				}
			} else {
				if (rDate_stime < min_stime || rDate_stime > max_stime) {
					return [that.today];
				} else {
					return [rDate];
				}
			}
		}

	},
	_init : function() {
		this._configInit();
		this._lgInint();
		this._sdfInit();
		this._create();
	},
	_create : function() {
		var that = this, opts = that.opts;
		if(that.parentContainer){
			that.parentContainer.empty().append(that._getContinerHtml());
		}else{
			$('body').append(that._getContinerHtml());
		}
		that.containerNode = $('#' + that.calendarId);
		that.mainEl = $('div.widget-calendar-main', that.containerNode);
		that.footerEl = $('div.widget-calendar-footer', that.containerNode);
		that.contentEl = $('div.widget-calendar-content', that.containerNode);
		that.errorTipEl = $('div.widget-calendar-errorTip', that.containerNode);
		that.inputEl = $('div.widget-calendar-input', that.containerNode);

		that.prevMonthEl = $('div.widget-calendar-prevMonthBtn', that.containerNode);
		that.prevYearEl = $('div.widget-calendar-prevYearBtn', that.containerNode);
		that.nextMonthEl = $('div.widget-calendar-nextMonthBtn', that.containerNode);
		that.nextYearEl = $('div.widget-calendar-nextYearBtn', that.containerNode);
		that.SubmitEl = $('div.widget-calendar-submit', that.containerNode);
		that.cancleEl = $('div.widget-calendar-close', that.containerNode);

		// 最右边的日历的时间
		that.startOneShowDate = that.selectDatesLength === 2 ? that.selectDate[1] : that.selectDate[0];
		that.clickCounts = 0;
		that.updateTriggerInput();
		that._render(that.startOneShowDate);
		that._defineEvent();	
		that._eventCenter();
	},
	_getContinerHtml : function() {
		var that = this, html = [];
		html.push('<div class="widget-calender-container" id="' + that.calendarId + '">');
		html.push('<div class="widget-calendar-main">');

		html.push('<div class="widget-calendar-left">');
		html.push('<div class="widget-calendar-prevYearBtn"><a class="prevYearBtn"></a></div>');
		html.push('<div class="widget-calendar-prevMonthBtn"><a class="prevBtn"></a></div>');
		html.push('</div>');
		html.push('<div class="widget-calendar-content"></div>');
		html.push('<div class="widget-calendar-right">');
		html.push('<div class="widget-calendar-nextYearBtn"><a class="nextYearBtn"></a></div>');
		html.push('<div class="widget-calendar-nextMonthBtn"><a class="nextBtn"></a></div>');
		html.push('</div>');

		html.push('</div>');
		html.push('<div class="widget-calendar-footer">');
		if (that.selectDatesLength === 2 && !that.isSelectWeek) {
			html.push('<div class="widget-calendar-input">');
			html.push('<span class="spanTxt1">' + that.lg.defineTxt + '</span>');
			html.push('<input type="text" class="timeInput timeInputSt" maxlength="10"/>');
			html.push('<span class="spanTxt2">' + that.lg.to + '</span>');
			html.push('<input type="text" class="timeInput timeInputEt" maxlength="10"/>');
			html.push('</div>');
		} else if (!that.isSelectWeek) {
			html.push('<div class="widget-calendar-input">');
			html.push('<span class="spanTxt1">' + that.lg.defineTxt + '</span>');
			html.push('<input type="text" class="timeInput timeInputSt" maxlength="10"/>');
			html.push('</div>');
		}

		if (that.panelCounts > 2) {
			html.push('<div class="widget-calendar-errorTip"></div>');
		}
		html.push('<div class="widget-calendar-footerBtn">');
		html.push('<div class="widget-calendar-submit"><a class="submitBtn" title="' + that.lg.okBtnTxt + '">' + that.lg.okBtnTxt + '</a></div>');
		html.push('<div class="widget-calendar-close"><a class="closeBtn" title="' + that.lg.closeBtnTxt + '">' + that.lg.closeBtnTxt + '</a></div>');
		html.push('</div>');
		html.push('</div>');

		if (that.panelCounts <= 2) {
			html.push('<div class="widget-calendar-errorTip errorTipBr"></div>');
		}

		html.push('</div>');
		return html.join('');
	},

	_render : function(rDate) {
		var that = this, cHtml = [], contentEl = that.contentEl;
		for (var k = 0; k < that.panelCounts; k++) {
			cHtml.push(that._renderDateItem(that.sdf.getStepMonth(rDate, -k * that.monStep)));
		}
		cHtml = cHtml.reverse();
		contentEl.empty().append(cHtml.join(''));
		that.startOneShowDate = rDate;
		that.calendarItemsEl = $('div.widget-calendar-item', that.containerNode);
		that.dateTxtEl = $('div.calendar-dateTxt', that.containerNode);
		if (that.isSelectWeek && that.selectDatesLength === 2) {
			that._renderWeekEvent();
		} else {
			that._renderEvent();
		}
	},
	_renderDateItem : function(rDate) {
		var that = this, opts = that.opts, sdf = that.sdf, lg = that.lg, html = [];

		html.push('<div class="widget-calendar-item">');
		html.push('<div class="calendar-dateTxt" sTime="' + sdf.getStime(rDate) + '">');
		html.push('<div class="txt">' + sdf.getYears(rDate) + lg.yearTxt + sdf.formatNum(sdf.getMonths(rDate)) + lg.monthTxt + '</div>');
		html.push('</div>');
		html.push('<div class="calendar-week">');
		html.push('<ul>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[0] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[1] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[2] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[3] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[4] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[5] + '</span></li>');
		html.push('<li class="calendar-weekLi"><span>' + lg.weekTxt[6] + '</span></li>');
		html.push('</ul>');
		html.push('</div>');
		html.push(that._getChtmlItem(rDate));

		html.push('</div>');

		return html.join('');
	},
	_getChtmlItem : function(rDate) {
		var that = this, opts = that.opts, sdf = that.sdf, lg = that.lg, html = [], st_time, et_time, days = sdf.getDays(rDate), min_time = sdf.getStime(that.minDate), max_time = sdf.getStime(that.maxDate);
		if (that.selectDatesLength === 2) {
			st_time = sdf.getStime(that.selectDate[0]);
			et_time = sdf.getStime(that.selectDate[1]);
		} else {
			st_time = sdf.getStime(that.selectDate[0]);
			et_time = st_time;
		}

		html.push('<ul class="calendar-lineUl">');

		//上一月
		var firstDayWeek = sdf.getWeek(sdf.getArrayDateByODate(new Date(sdf.getYears(rDate), sdf.getMonths(rDate) - 1, 1)));
		for (var a = firstDayWeek; a > 0; a--) {
			html.push('<li class="calendar-colLi"><a class="notTime"></a></li>');
		}

		//当月
		for (var b = 0; b < days; b++) {
			var _rDate = sdf.getArrayDateByODate(new Date(sdf.getYears(rDate), sdf.getMonths(rDate) - 1, b + 1));
			var stime = sdf.getStime(_rDate), selected = '', disabled = '';
			//判断选中
			if (parseInt(stime, 10) >= parseInt(st_time, 10) && parseInt(stime, 10) <= parseInt(et_time, 10)) {
				selected = that.className.aSelected;
			}
			//判断最大 最小之外
			if (parseInt(stime, 10) < parseInt(min_time, 10) || parseInt(stime, 10) > parseInt(max_time, 10)) {
				disabled = that.className.aDisabled;
			}
			html.push('<li class="calendar-colLi">');
			html.push('<a date="2014-02-03" id="' + that.aPrefix + "_" + stime + '" stime="' + stime + '" class="' + selected + " " + disabled + '">' + (b + 1) + '</a>');
			html.push('</li>');
		}

		//下一月
		var lastDayWeek = sdf.getWeek(days);
		lastDayWeek = lastDayWeek === 7 ? 0 : lastDayWeek;
		for (var c = lastDayWeek; c <= 7; a++) {
			html.push('<li class="calendar-colLi"><a class="notTime"></a></li>');
		}

		html.push('</ul>');
		return html.join('');
	},
	_renderEvent : function() {
		var that = this, className = that.className, as = that.calendarItemsEl.find('a').not('a.notTime');

		as.off('click').on('click', function() {
			if ($(this).hasClass(className.aDisabled)) {
				return false;
			}
			var me = $(this), stime = me.attr('stime') - 0;
			that.errorTipEl.hide();

			if (that.selectDatesLength === 2) {
				if (parseInt(that.clickCounts, 10) === 0) {
					as.removeClass(className.aSelectStart);
					that.clickCounts = 1;
					as.not('a.' + className.aSelectStart).removeClass(className.aSelected);
					me.addClass(className.aSelected + ' ' + className.aSelectStart);
					that.selectDate = [that.sdf.getArrayDateByStime(stime), that.sdf.getArrayDateByStime(stime)];
				} else {
					as.removeClass(className.aSelectEnd);
					if (as.hasClass(className.aSelectEnd)) {
						as.removeClass(className.aSelectEnd);
					}
					that.clickCounts = 0;
					me.addClass(className.aSelected + ' ' + className.aSelectEnd);
					that.selectDate = [that.selectDate[0], that.sdf.getArrayDateByStime(stime)];
				}
			} else {
				as.removeClass(className.aSelected);
				me.addClass(className.aSelected + ' ' + className.SelectStart + ' ' + className.aSelectEnd);
				that.selectDate = [that.sdf.getArrayDateByStime(stime)];
			}
			that._updateInput();
			that.containerNode.trigger('calendar.event.aTimeClick');
		});

		as.off('mouseover mouseout').on({
			mouseover : function() {
				var me = $(this);
				if (me.hasClass(className.aDisabled)) {
					return false;
				}
				me.addClass(className.aHovered);
				if (parseInt(that.clickCounts, 10) === 1) {
					var active_stime = me.attr('stime') - 0;
					var start_stime = that.sdf.getStime(that.selectDate[0]);
					as.not('a.' + className.aSelectStart).removeClass(className.aSelected);
					if (active_stime - start_stime < 0) {
						//向前
						for (var j = start_stime; j >= active_stime; j = j - 864e5) {
							$('#' + that.aPrefix + '_' + j).addClass(className.aSelected);
						}
					} else {
						//向后
						for (var i = start_stime; i <= active_stime; i = i + 864e5) {
							$('#' + that.aPrefix + '_' + i).addClass(className.aSelected);
						}
					}
				}
			},
			mouseout : function() {
				$(this).removeClass(className.aHovered);
			}
		});
		if (that.isSelectAllMonth && that.selectDatesLength === 2) {
			that.dateTxtEl.css({
				'cursor' : 'pointer'
			});
			that.dateTxtEl.off().on({
				mouseover : function() {
					if ($(this).hasClass(className.disabled)) {
						return false;
					}
					$(this).addClass(className.hovered);
				},
				mouseout : function() {
					if ($(this).hasClass(className.disabled)) {
						return false;
					}
					$(this).removeClass(className.hovered);
				},
				click : function() {
					var me = $(this), sTime = me.attr('sTime') - 0;
					if (me.hasClass(className.disabled)) {
						return false;
					}

					that.calendarItemsEl.find('ul.calendar-lineUl').find('a').not('a.notTime').not('a.' + className.aDisabled).removeClass(className.aSelected);
					me.siblings('ul.calendar-lineUl').find('a').not('a.notTime').not('a.' + className.aDisabled).addClass(className.aSelected);

					that.clickCounts = 0;
					var lastMonthDay = that.sdf.getArrayDateByStime(sTime);
					that.selectDate = [[that.sdf.getYears(lastMonthDay), that.sdf.getMonths(lastMonthDay), 1], lastMonthDay];
					that._updateInput();
				}
			}).on({
				mousedown : function() {
					if ($(this).hasClass(className.disabled)) {
						return false;
					}
					$(this).addClass(className.selected);
				},
				mouseup : function() {
					if ($(this).hasClass(className.disabled)) {
						return false;
					}
					$(this).removeClass(className.selected);
				}
			});
		}
		that._triggerInputEvent();
		that._inputEvent();
	},
	_renderWeekEvent : function() {
		var that = this, className = that.className, as = that.calendarItemsEl.find('a').not('a.notTime');
		as.off('click').on('click', function() {
			if ($(this).hasClass(className.aDisabled)) {
				return false;
			}
			var stime = $(this).attr('stime') - 0, tmpDate = that.sdf.getArrayDateByStime(stime);
			as.removeClass(className.aSelected).removeClass(className.aHovered);
			getWeekAs(stime).addClass(className.aSelected);
			that.selectDate = that.sdf.getNatureCurrWeek([tmpDate, tmpDate])
			that._updateInput();
			that.containerNode.trigger('calendar.event.aTimeClick');
		});

		as.each(function(i) {
			$(this).off('mouseover mouseout').on({
				mouseover : function() {
					var me = $(this);
					if (me.hasClass(className.aDisabled)) {
						return false;
					}
					as.removeClass(className.aHovered);
					getWeekAs($(this).attr('stime')).addClass(className.aHovered);
				},
				mouseout : function() {
					as.removeClass(className.aHovered);
				}
			});
		});
		function getWeekAs(stime) {
			var tmpDate = that.sdf.getArrayDateByStime(stime - 0);
			var rDate = that.sdf.getNatureCurrWeek([tmpDate, tmpDate]);

			return as.filter(function(t) {
				var _stime = $(this).attr('stime') - 0;
				return _stime >= that.sdf.getStime(rDate[0]) && _stime <= that.sdf.getStime(rDate[1]);
			});
		}
		that._triggerInputEvent();
	},
	_nextMonth : function() {
		var that = this;
		that._render(that._getStartOneShowDate(that.sdf.getStepMonth(that.startOneShowDate, 1)));
		that._btnStatusUpdate();
		that.containerNode.trigger('calendar.event.nextMonth');
	},
	_prevMonth : function() {
		var that = this;
		that._render(that._getStartOneShowDate(that.sdf.getStepMonth(that.startOneShowDate, -1)));
		that._btnStatusUpdate();
		that.containerNode.trigger('calendar.event.prevMonth');
	},
	_nextYear : function() {
		var that = this;
		that._render(that._getStartOneShowDate(that._getStepYear(that.startOneShowDate, 1)));
		that._btnStatusUpdate();
		that.containerNode.trigger('calendar.event.nextYear');
	},
	_prevYear : function() {
		var that = this, rDate = that.selectDate[0];
		that._render(that._getStartOneShowDate(that._getStepYear(that.startOneShowDate, -1)));
		that._btnStatusUpdate();
		that.containerNode.trigger('calendar.event.prevYear');
	},
	_getStartOneShowDate : function(rDate) {
		var that = this;
		if (that.sdf.getStime(rDate) < that.sdf.getStime(that.minDate)) {
			rDate = that.sdf.getStepMonth(that.minDate, that.panelCounts - 1);
		}
		if (getNatureMonthCounts(that.minDate, rDate) < that.panelCounts) {
			rDate = that.sdf.getStepMonth(that.minDate, that.panelCounts - 1);
		}
		if (that.sdf.getStime(rDate) > that.sdf.getStime(that.maxDate)) {
			rDate = that.maxDate;
		}

		function getNatureMonthCounts(rDate, rDate2) {
			var rightDate = that.sdf.getSwarp(rDate, rDate2), st = rightDate[0], et = rightDate[1];
			var monthCounts = (et[0] - st[0]) * 12 + (et[1] - st[1]);
			return monthCounts;
		}

		return rDate;
	},
	_getStepYear : function(rDate, step) {
		var that = this, sdf = that.sdf;
		var oDate = new Date(sdf.getYears(rDate) - 0 + step, sdf.getMonths(rDate) - 1, sdf.getDay(rDate));
		var _rDate = sdf.getArrayDateByODate(oDate);
		if (step > 0 && sdf.getStime(_rDate) > sdf.getStime(that.maxDate)) {
			return that.maxDate;
		} else if (step < 0 && sdf.getStime(_rDate) < sdf.getStime(that.minDate)) {
			return that.minDate;
		}
		return _rDate;
	},
	_defineEvent: function(){
	    var that = this;
	    that.containerNode.on('calendar.event.show', function(){
	        that._show();	        
	    });
	    that.containerNode.on('calendar.event.hide', function(){
            that._hide();
        });
	},
	_eventCenter : function() {
		var that = this, className = that.className;
		var els = [that.prevMonthEl, that.prevYearEl, that.nextMonthEl, that.nextYearEl, that.SubmitEl, that.cancleEl];
		for (var i = 0; i < els.length; i++) {
			els[i].off('mouseover mouseout').on({
				'mouseover' : function() {
					that._btnStatus($(this), 'add', className.hovered);
				},
				'mouseout' : function() {
					that._btnStatus($(this), 'remove', className.hovered);
				},
				'mousedown' : function() {
					that._btnStatus($(this), 'add', className.selected);
				},
				'mouseup' : function() {
					that._btnStatus($(this), 'remove', className.selected);
				}
			});
		}
		that.prevMonthEl.off('click').on('click', function() {
			that._prevMonth();
		});
		that.prevYearEl.off('click').on('click', function() {
			that._prevYear();
		});
		that.nextMonthEl.off('click').on('click', function() {
			that._nextMonth();
		});
		that.nextYearEl.off('click').on('click', function() {
			that._nextYear();
		});
		that.SubmitEl.off('click').on('click', function() {
			var inputs = that.inputEl.find('input.timeInput'), errored = false;
			inputs.each(function() {
				if ($(this).hasClass(that.className.errored)) {
					errored = true;
					$(this).trigger('blur');
					return false;
				}
			});
			if (!errored) {
				that.containerNode.trigger('calendar.event.hide');
			}
		});
		that.cancleEl.off('click').on('click', function() {
			that.selectDate = that._selectDate;
			that.containerNode.trigger('calendar.event.hide');
		});
		
		if (!that.isClickDocClose) {
            $(document).on('click', function(e) {
                var target = $(e.target);
                var condition1 = target[0] === that.triggerInputEl[0] ? 1 : 0;
                var condition2 = $.contains(that.containerNode[0], target[0]);
                if (!condition1 && !condition2) {
                    that.containerNode.trigger('calendar.event.hide');
                }
            });
        }
		
		that._btnStatusUpdate();
	},
	_btnStatusUpdate: function(){
	    var that = this, className = that.className, sdf = that.sdf;
        var rDate = that.startOneShowDate;
        if(isNearMax(rDate)){
            that._btnStatus(that.nextMonthEl, 'add', className.disabled);
            that._btnStatus(that.nextYearEl, 'add', className.disabled);
        }else{
            that._btnStatus(that.nextMonthEl, 'remove', className.disabled);
            that._btnStatus(that.nextYearEl, 'remove', className.disabled);
        }
        
        
        var rDate2 = sdf.getStepMonth(rDate, 1 - that.panelCounts);
        if(sdf.getStime(rDate2) < sdf.getStime(that.minDate)){
            rDate2 = that.minDate;
        }
        if(isNearMin(rDate2)){
            that._btnStatus(that.prevMonthEl, 'add', className.disabled);
            that._btnStatus(that.prevYearEl, 'add', className.disabled);
        }else{
            that._btnStatus(that.prevMonthEl, 'remove', className.disabled);
            that._btnStatus(that.prevYearEl, 'remove', className.disabled);
        }
        
        
        function isNearMin(rDate){
            return sdf.getYears(that.minDate) === sdf.getYears(rDate) && sdf.getMonths(that.minDate) === sdf.getMonths(rDate);
        }
        function isNearMax(rDate){
            return sdf.getYears(that.maxDate) === sdf.getYears(rDate) && sdf.getMonths(that.maxDate) === sdf.getMonths(rDate);
        }
	},
	_btnStatus : function(btnEl, action, btnStatus) {
		var that = this;
		if (action === 'add') {
			if (!btnEl.hasClass(that.className.disabled)) {
				btnEl.removeClass(that.className.hovered + ' ' + that.className.selected + ' ' + that.className.disabled).addClass(btnStatus);
			}
		} else {
			btnEl.removeClass(btnStatus);
		}
	},
	_checkDateFormater2 : function(s2Date) {
		var that = this;
		if (that.selectDatesLength === 2) {
			return that._checkDateFormater(s2Date.split(that.sdf.date2Separator)[0]) && that._checkDateFormater(s2Date.split(that.sdf.date2Separator)[1]);
		} else {
			return that._checkDateFormater(s2Date);
		}
	},
	_checkDateFormater : function(sDate) {
		var that = this, r = /^\d{4}-\d{2}-\d{2}$/;
		if (r.test(sDate)) {
			return that.sdf.checkDateFormater(that.sdf.getArrayDateByString(sDate));
		} else {
			return false;
		}
	},
	_dateFormater : function(rDate) {
		var that = this;
		return that.sdf.getYears(rDate) + that.sdf.separator + that.sdf.formatNum(that.sdf.getMonths(rDate)) + that.sdf.separator + that.sdf.formatNum(that.sdf.getDay(rDate));
	},
	_triggerInputEvent : function() {
		var that = this, triggerInputEl = that.triggerInputEl, minStime = that.sdf.getStime(that.minDate), maxStime = that.sdf.getStime(that.maxDate);
		if (that.isReadOnly) {
			triggerInputEl.attr({
				readonly : true
			});
		} else {
			triggerInputEl.removeAttr('readonly');
		}
		triggerInputEl.off('keyup focus').on({
			'keyup' : function() {
				var val = $(this).val();
				if (that._checkDateFormater2(val)) {
					if (that.selectDatesLength === 2) {
						var st = that.sdf.getArrayDateByString(val.split(that.sdf.date2Separator)[0]), et = that.sdf.getArrayDateByString(val.split(that.sdf.date2Separator)[1]), stStime = that.sdf.getStime(st), etStime = that.sdf.getStime(et);
						that.selectDate = [st, et];
						if (stStime < minStime || stStime < minStime || stStime > maxStime || etStime > maxStime || etStime < stStime) {
							if (stStime < minStime) {
								that.containerNode.trigger('calendar.event.triggerInput.st_min');
							}
							if (etStime < minStime) {
								that.containerNode.trigger('calendar.event.triggerInput.et_min');
							}
							if (etStime < stStime) {
								that.containerNode.trigger('calendar.event.triggerInput.et_st');
							}
							if (stStime < maxStime) {
								that.containerNode.trigger('calendar.event.triggerInput.st_max');
							}
							if (etStime < maxStime) {
								that.containerNode.trigger('calendar.event.triggerInput.et_max');
							}
							return false;
						} else {
							that._randDateSelect();
						}
					} else {
						that.selectDate = that.sdf.getArrayDateByString(val);
						that._randDateSelect();
					}
				}
			},
			'focus' : function() {
				that.containerNode.trigger('calendar.event.show');
			}
		});
	},
	_inputEvent : function() {
		var that = this, inputs = that.inputEl.find('input.timeInput');
		var errorTipEl = that.errorTipEl;
		var inputStEl = inputs.eq(0), inputEtEl = inputs.eq(1);

		inputStEl.off('blur focus keyup').on({
			'blur' : function() {
				var val = $(this).val();
				if (!that._checkDateFormater(val)) {
					$(this).addClass(that.className.errored);
					if (that.selectDatesLength === 2) {
						showErrorTip(that.lg.errorTip['ET2']);
					} else {
						showErrorTip(that.lg.errorTip['ET1']);
					}
				} else {
					$(this).val(that._dateFormater(that.sdf.getArrayDateByString(val)));
					$(this).removeClass(that.className.errored);
					hideErrorTip();
				}
			},
			'focus' : function() {
				if (that.selectDatesLength === 2 && $(this).hasClass(that.className.disabled)) {
					return false;
				}
				inputs.removeClass(that.className.selected);
				$(this).addClass(that.className.selected);
				that.clickCounts = 0;
				hideErrorTip();
			},
			'keyup' : function() {
				var val = $(this).val();
				if (that._checkDateFormater(val)) {
					var st = that.sdf.getArrayDateByString(val);
					if (that.selectDatesLength === 2) {
						that.selectDate = [st, that.selectDate[1]];
					} else {
						that.selectDate = st;
					}
					if (that.sdf.getStime(st) < that.sdf.getStime(that.minDate)) {
						showErrorTip(that.lg.errorTip['ET4']);
					} else {
						hideErrorTip();
						that._randDateSelect();
					}
				}
			}
		});

		inputEtEl.off('blur focus keyup').on({
			'blur' : function() {
				var val = $(this).val();
				if (!that._checkDateFormater(val)) {
					$(this).addClass(that.className.errored);
					if (that.selectDatesLength === 2) {
						showErrorTip(that.lg.errorTip['ET3']);
					}
				} else {
					$(this).val(that._dateFormater(that.sdf.getArrayDateByString(val)));
					$(this).removeClass(that.className.errored);
					inputStEl.removeClass(that.className.disabled);
					hideErrorTip();
				}
			},
			'focus' : function() {
				if (that.selectDatesLength === 2 && $(this).hasClass(that.className.disabled)) {
					return false;
				}
				inputs.removeClass(that.className.selected);
				$(this).addClass(that.className.selected);
				that.clickCounts = 0;
				hideErrorTip();
			},
			'keyup' : function() {
				var val = $(this).val();
				if (that._checkDateFormater(val)) {
					var et = that.sdf.getArrayDateByString(val);
					if (that.selectDatesLength === 2) {
						that.selectDate = [that.selectDate[0], et];
					}
					if (that.sdf.getStime(et) > that.sdf.getStime(that.maxDate)) {
						showErrorTip(that.lg.errorTip['ET5']);
					} else {
						hideErrorTip();
						that._randDateSelect();
					}
				}
			}
		});

		function showErrorTip(txt) {
			errorTipEl.text(txt).show();
		}

		function hideErrorTip(txt) {
			errorTipEl.text('').hide();
		}

	},
	_updateInput : function() {
		var that = this, inputs = that.inputEl.find('input.timeInput');
		var st = that._dateFormater(that.selectDate[0]);
		if (that.selectDatesLength === 2) {
			var et = that._dateFormater(that.selectDate[1]);
			inputs.eq(0).val(st);
			inputs.eq(1).val(et);
			that.triggerInputEl.val(st + that.sdf.date2Separator + et);
		} else {
			inputs.eq(0).val(st);
			that.triggerInputEl.val(st)
		}
		inputs.removeClass(that.className.errored + ' ' + that.className.selected).eq(that.clickCounts).addClass(that.className.selected);
		that.errorTipEl.text('').hide();
	},
	_fixedIe6 : function() {
		var that = this, cw = that._getContainerWidth();
		if ($.browser.msie && ($.browser.version === "6.0" || $.browser.version === "7.0")){
		    that.footerEl.css({'width' : cw});
		    that.containerNode.css({'width' : cw});
		}
		if ($.browser.msie && $.browser.version === "6.0") {
			that.iframeNode = $("#frame_" + that.calendarId);
			if (!that.iframeNode.length) {
				var h = that.containerNode.css('height');
				var left = that.containerNode.css('left'), top = that.containerNode.css('top');
				var iframeHtml = '<iframe id="frame_' + that.calendarId + '" ' 
				+ 'style="filter:alpha(opacity=20);position:absolute;' 
				+ 'z-index:1;width:' + cw + 'px;height:' + h + ';left:' + left + ';top:' + top + ';"></iframe>';
				var iframeEl = $(iframeHtml);
				if(that.parentContainer){
				    that.parentContainer.append(iframeEl);
				}else{
				    iframeEl.insertAfter(that.triggerInputEl);
				}
				that.iframeNode = iframeEl;
			}
		}
	},
	_getContainerWidth: function(){
	    return 26 * 2 + 176 * this.panelCounts;
	},
	_setPostion : function() {
		var that = this, triggerInputEl = that.triggerInputEl;
		if (triggerInputEl.length && !that.parentContainer) {
			var tn_offset = triggerInputEl.offset(), tn_height = parseInt(triggerInputEl.outerHeight(), 10), top, left;
			top = tn_offset.top + tn_height;
			if (that.showPosition === "right") {
				left = tn_offset.left + parseInt(triggerInputEl.outerWidth(), 10) - 
				    that._getContainerWidth() - parseInt(that.containerNode.css('border-left-width'), 10) -
				    parseInt(that.containerNode.css('paddingLeft'), 10) - parseInt(that.containerNode.css('paddingRight'), 10);
			} else {
				left = tn_offset.left;
			}
			that.containerNode.css({
				top : top,
				left : left
			});
		}
	},
	_randDateSelect : function() {
		var that = this, st = that.sdf.getStime(that.selectDate[0]), et = that.sdf.getStime(that.selectDate[1]);
		var as = that.calendarItemsEl.find('a').not('a.notTime');
		as.removeClass(that.className.aSelected);
		for (var i = st; i <= et; i = i + 864e5) {
			$('#' + that.aPrefix + '_' + i).addClass(that.className.aSelected);
		}
	},
	updateTriggerInput : function() {
		var that = this, triggerInputEl = that.triggerInputEl;
		var st = that._dateFormater(that.selectDate[0]);
		if (that.selectDatesLength === 2) {
			var et = that._dateFormater(that.selectDate[1]);
			triggerInputEl.val(st + that.sdf.date2Separator + et);
		} else {
			triggerInputEl.val(st);
		}
	},
	_hide : function() {
		var that = this;
		that.updateTriggerInput();
		if(!that.isSelectWeek){
             that._updateInput();
        }
        !!that.iframeNode && that.iframeNode.hide();
		that.containerNode.hide();
		that.containerNode.trigger('calendar.event.hidecb');
	},
	_show : function() {
		var that = this;
		that.startOneShowDate = that.selectDatesLength === 2 ? that.selectDate[1] : that.selectDate[0];
		that.clickCounts = 0;
		that.updateTriggerInput();
		that._render(that.startOneShowDate);
		if(!that.isSelectWeek){
    		 that._updateInput();
		}
		that._setPostion();
		that._fixedIe6();
		that.containerNode.show();
		that.containerNode.trigger('calendar.event.showcb');
	},
	destory : function() {
		var that = this;
	}
};

//exports.Calendar = Calendar;

//return Calendar;
