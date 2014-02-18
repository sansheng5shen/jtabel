"use strict";

function SDF(options) {
    this.separator = options.separator || '-';
    this.date2Separator = options.date2Separator || '至';
	this.minDate = options.minDate || '2014-02-18';
	this.maxDate = options.maxDate || '2014-02-18';
	this.init();
}

SDF.prototype = {
	init: function(){
		this.minDate = this.getArrayDateByString(this.minDate);	  
		this.maxDate = this.getArrayDateByString(this.maxDate);	  
	},
    getArrayDateByString: function(sDate) {
        var arrayDate = sDate.split(this.separator);
        return [parseInt(arrayDate[0], 10), parseInt(arrayDate[1], 10), parseInt(arrayDate[2], 10)];
    },
    getArrayDateByODate: function(oDate) {
        return [parseInt(oDate.getFullYear(), 10) - 0, parseInt(oDate.getMonth(), 10) + 1, parseInt(oDate.getDate(),10) - 0];
    },
    getSdateByArrayDate: function() {
        var arrayDate = arguments[0];
        return parseInt(arrayDate[0], 10) + this.separator + parseInt(arrayDate[1], 10) + this.separator + parseInt(arrayDate[2], 10);
    },
	isEqArray: function(a, b){
		if(a.length === b.length){
			var isEq = true;
			for(var i = 0; i < a.length; i ++){
				if(a[i] !== b[i]){
					isEq = false;
					break;
				}
			}
			return isEq;
		}else{
			return false;
		}
	},
    getObjDate: function() {
        var arrayDate = arguments[0];
        return new Date(arrayDate[0], parseInt(arrayDate[1], 10) - 1, parseInt(arrayDate[2], 10));
    },
    getStime: function() {
        return this.getObjDate(arguments[0]).getTime() - 0;
    },
    getWeek: function() {
        return this.getObjDate(arguments[0]).getDay() - 0;
    },
    getDay: function() {
        return this.getObjDate(arguments[0]).getDate() - 0;
    },
    getYears: function() {
        return this.getObjDate(arguments[0]).getFullYear() - 0;
    },
    getMonths: function() {
        return this.getObjDate(arguments[0]).getMonth() - 0 + 1;
    },
    getDays: function() {
        var date = new Date(this.getYears(arguments[0]), this.getMonths(arguments[0]), 0);
        return date.getDate();
    },
    formatNum: function(num) {
        return num.toString().replace(/^(\d)$/, "0$1");
    },
	checkDateFormater: function(){
		var arrayDate = arguments[0];
		if(arrayDate.length !== 3){
			return false;
		}
		var y = parseInt(arrayDate[0], 10), m = parseInt(arrayDate[1], 10), d = parseInt(arrayDate[2], 10);	
		//这个不是万年历
		if(y < 2000 || y > 2100){
			return false;
		}
		if(m < 1 || m > 12){
			return false;
		}
		if(d < 1 || d > this.getDays(arrayDate)){
			return false;
		}
		return true;
	},
	getStepDay: function(rDate, step){
		var oDate = new Date(this.getStime(rDate) + step * 864e5);
		return this.getArrayDateByODate(oDate);
	},
	getStepMonth: function(rDate, step){
		var oDate = new Date(this.getYears(rDate), this.getMonths(rDate) - 0 + step, 0);
		return this.getArrayDateByODate(oDate);
	},
	getRightDate: function(rDate){
		if(this.getStime(rDate) < this.getStime(this.minDate)){
			rDate = this.minDate;
		}
		if(this.getStime(rDate) > this.getStime(this.maxDate)){
			rDate = this.maxDate;
		}
		return rDate;
	},
	getStepDate: function(rDate, step){
		rDate = this.getRightDate(rDate);
		var stepDate = this.getStepDay(rDate, step);
		if(step < 0 && this.getStime(stepDate) < this.getStime(this.minDate)){
			return this.minDate;
		}
		if(step > 0 && this.getStime(stepDate) > this.getStime(this.maxDate)){
			return this.maxDate;
		}
		return stepDate;
	},
	getStepDates: function(rDate, step){
		rDate = this.getRightDate(rDate);
		if(step > 0){
			return [rDate, this.getStepDate(rDate, step)];	
		}else{
			return [this.getStepDate(rDate, step), rDate];	
		}
	},
	getSameLengthDates: function(r2Date, dir){
		var st = r2Date[0], et = r2Date[1], cst, cet;
		st = this.getRightDate(st);
		et = this.getRightDate(et);
		var swarp = this.swarp(st, et);
		st = swarp[0];
		et = swarp[1];
		var ranges = (this.getStime(et) - this.getStime(st))/864e5 - 0 + 1;
		if(dir < 0){
			cst = this.getStepDate(st, -ranges);	
			cet = this.getStepDate(st, -1);	
		}else{
			cst = this.getStepDate(et, ranges);	
			cet = this.getStepDate(et, 1);	
		}
		var swarp2 = this.swarp(cst, cet);
		return [swarp2[0], swarp2[1]];
	},
	swarp: function(st, et){
		var tmp;
		if(this.getStime(et) < this.getStime(st)){
			tmp = st;
			st = et;
			et = tmp;
		}
		return [st, et];
	},
	isNatureMonth: function(r2Date, isStrict){
		var st = r2Date[0], et = r2Date[1], _isStrict = isStrict || 0;
		st = this.getRightDate(st);
		et = this.getRightDate(et);
		var swarp = this.swarp(st, et);
		st = swarp[0];
		et = swarp[1];

		var con1 = this.isEqArray(this.getMonths(st), this.getMonths(et)),
			con2 = this.getYears(st) === this.getYears(et),
			con3 = this.getDay(st) === 1,
			con4 = this.getDay(et) === this.getDays(et); 
		if(con1 && con2 && con3 && con4){
			return true;	
		}	
		if(!_isStrict){
			if(this.isEqArray(st, this.minDate) && con1 && this.isEqArray(et, this.maxDate)){
				return true;	
			}else if(this.isEqArray(st, this.minDate) && con1 && con4){
				return true;	
			}else if(this.isEqArray(et, this.maxDate) && con1 && con3){
				return true;	
			}else{
				return false;
			}
		}
		return false;
	},
	isNatureWeek: function(r2Date, isStrict){
		var st = r2Date[0], et = r2Date[1], _isStrict = isStrict || 0;
		st = this.getRightDate(st);
		et = this.getRightDate(et);
		var swarp = this.swarp(st, et);
		st = swarp[0];
		et = swarp[1];

		var con1 = this.getWeek(st) === 1,
			con2 = this.getWeek(et) === 0,
			con3 = (this.getStime(st) - this.getStime(et)) / 864e5 === 6;

		if(con1 && con2 && con3){
			return true;
		}
		if(!_isStrict){
		
			if( (this.getStime(st) - this.getStime(et)) / 864e5 <= 6){
				return true;
			}else{
			
			}
		}
		return false;
				  
	}
};




exports.SDF = SDF;
