"use strict";
var testCase = require('/usr/local/lib/node_modules/nodeunit').testCase;
var SDF = require('../src/sdf').SDF,
    sdf;


module.exports = testCase({
    setUp: function(callback) {
        var opts = {
            separator: '-',
            date2Separator: '至'
        };
		sdf = new SDF(opts);
        callback();
    },
    tearDown: function(callback) {
        callback();
    },
    "日期格式转换-字符串转数组": function(test) {
		test.deepEqual([2014, 1, 12], sdf.getArrayDateByString('2014-01-12'));
        test.done();
    },
    "日期格式转换-数组转字符串": function(test) {
		test.deepEqual('2014-1-12', sdf.getSdateByArrayDate([2014, 1, 12]));
		test.deepEqual('2014-1-2', sdf.getSdateByArrayDate([2014, 1, 2]));
		test.expect(2);
        test.done();
    },
    "获取毫秒数": function(test) {
		test.equal(new Date(2014, 0, 2).getTime(), sdf.getStime([2014, 1, 2]));
        test.done();
    },
    "获取几号": function(test) {
		test.equal(2, sdf.getDay([2014, 1, 2]));
        test.done();
    },
    "获取一月的天数": function(test) {
		test.equal(31, sdf.getDays([2014, 1, 2]));
		test.equal(28, sdf.getDays([2014, 2, 2]));
		test.expect(2);
        test.done();
    },
    "获取星期几": function(test) {
		test.equal(4, sdf.getWeek([2014, 1, 2]));
		test.equal(5, sdf.getWeek([2014, 1, 3]));
		test.equal(6, sdf.getWeek([2014, 1, 4]));
		test.equal(0, sdf.getWeek([2014, 1, 5]));
		test.equal(1, sdf.getWeek([2014, 1, 6]));
		test.equal(2, sdf.getWeek([2014, 1, 7]));
		test.equal(3, sdf.getWeek([2014, 1, 8]));
		test.expect(7);
        test.done();
    },
    "获取月份": function(test) {
		test.equal(1, sdf.getMonths([2014, 1, 2]));
		test.equal(11, sdf.getMonths([2014, 11, 2]));
		test.equal(12, sdf.getMonths([2014, 12, 2]));
		test.equal(12, sdf.getMonths([2014, 0, 2]));
		test.equal(1, sdf.getMonths([2014, 13, 2]));
		test.expect(5);
        test.done();
    },
    "获取年份": function(test) {
		test.equal(2014, sdf.getYears([2014, 1, 2]));
        test.done();
    },
    "日期格式检查": function(test) {
		test.ok(!sdf.checkDateFormater([3014, 1, 2]));
		test.ok(!sdf.checkDateFormater([1999, 1, 2]));
		test.ok(!sdf.checkDateFormater([2014, 1, 32]));
		test.ok(sdf.checkDateFormater([2014, 1, 31]));
		test.ok(!sdf.checkDateFormater([2014, 0, 31]));
		test.ok(!sdf.checkDateFormater([2014, 13, 31]));
		test.ok(sdf.checkDateFormater([2014, 12, 31]));
		test.expect(7);
        test.done();
    },
    "根据参考日期获取按照步长的日期": function(test) {
		test.deepEqual([2014, 1, 2], sdf.getStepDay([2014, 1, 2], 0));
		test.deepEqual([2014, 1, 1], sdf.getStepDay([2014, 1, 2], -1));
		test.deepEqual([2014, 1, 4], sdf.getStepDay([2014, 1, 2], 2));
		test.deepEqual([2013, 12, 31], sdf.getStepDay([2014, 1, 2], -2));
		test.deepEqual([2014, 3, 1], sdf.getStepDay([2014, 1, 2], 58));
		test.expect(5);
        test.done();
    },
    "根据参考日期获取按照步长的月份": function(test) {
		test.deepEqual([2014, 1, 31], sdf.getStepMonth([2014, 1, 2], 0));
		test.deepEqual([2013, 12, 31], sdf.getStepMonth([2014, 1, 2], -1));
		test.deepEqual([2014, 2, 28], sdf.getStepMonth([2014, 1, 2], 1));
		test.deepEqual([2014, 3, 31], sdf.getStepMonth([2014, 1, 2], 2));
		test.deepEqual([2013, 11, 30], sdf.getStepMonth([2014, 1, 2], -2));
		test.deepEqual([2012, 10, 31], sdf.getStepMonth([2014, 1, 2], -15));
		test.expect(6);
        test.done();
	},
	'根据参考日期获取step天，根据最小日期、最大日期，不足step天，有几天，返回几天；包含今天': function(test){
        var opts = {
            separator: '-',
            date2Separator: '至',
			minDate: '2014-01-15',
			maxDate: '2014-02-18'
        };
		var sdf1 = new SDF(opts);
		test.deepEqual([2014, 2, 12], sdf1.getStepDate([2014, 2, 18], -6));
		test.deepEqual([2014, 1, 20], sdf1.getStepDate([2014, 2, 18], -29));
		test.deepEqual([2014, 1, 15], sdf1.getStepDate([2014, 1, 10], -1));
		test.deepEqual([2014, 1, 16], sdf1.getStepDate([2014, 1, 10], 1));
		test.deepEqual([2014, 2, 18], sdf1.getStepDate([2014, 2, 20], 1));
		test.deepEqual([2014, 2, 17], sdf1.getStepDate([2014, 2, 20], -1));
		
		opts.minDate = '2014-02-14';
		var sdf2 = new SDF(opts);
		test.deepEqual([2014, 2, 14], sdf2.getStepDate([2014, 2, 18], -6));
		test.deepEqual([2014, 2, 18], sdf2.getStepDate([2014, 2, 14], 6));

		opts.minDate = '2014-02-18';
		var sdf3 = new SDF(opts);
		test.deepEqual([2014, 2, 18], sdf3.getStepDate([2014, 2, 18], -6));
		test.deepEqual([2014, 2, 18], sdf3.getStepDate([2014, 2, 18], 6));

		test.expect(10);
		test.done();
	},
	'根据参考日期获取step天，根据最小日期、最大日期，不足step天，有几天，返回几天；包含今天,返回区间时间': function(test){
        var opts = {
            separator: '-',
            date2Separator: '至',
			minDate: '2014-01-15',
			maxDate: '2014-02-18'
        };
		var sdf1 = new SDF(opts);
		test.deepEqual([[2014, 1, 15], [2014, 1, 18]], sdf1.getStepDates([2014, 1, 18], -6));
		test.deepEqual([[2014, 2, 12], [2014, 2, 18]], sdf1.getStepDates([2014, 2, 18], -6));
		test.deepEqual([[2014, 2, 14], [2014, 2, 18]], sdf1.getStepDates([2014, 2, 14], 6));
		test.deepEqual([[2014, 2, 18], [2014, 2, 18]], sdf1.getStepDates([2014, 2, 18], 6));
		test.expect(4);
		test.done();
	},
	'根据参考时间根据方向向前或向后返回等长的时间区间': function(test){
        var opts = {
            separator: '-',
            date2Separator: '至',
			minDate: '2014-01-15',
			maxDate: '2014-02-18'
        };
		var sdf1 = new SDF(opts);
		test.deepEqual([[2014, 2, 13], [2014, 2, 15]], sdf1.getSameLengthDates([[2014, 2, 18], [2014, 2, 16]], -1));
		test.deepEqual([[2014, 2, 13], [2014, 2, 15]], sdf1.getSameLengthDates([[2014, 2, 16], [2014, 2, 18]], -1));
		test.deepEqual([[2014, 2, 18], [2014, 2, 18]], sdf1.getSameLengthDates([[2014, 2, 18], [2014, 2, 16]], 1));
		test.deepEqual([[2014, 2, 17], [2014, 2, 18]], sdf1.getSameLengthDates([[2014, 2, 16], [2014, 2, 14]], 1));

		test.deepEqual([[2014, 1, 16], [2014, 1, 19]], sdf1.getSameLengthDates([[2014, 1, 20], [2014, 1, 23]], -1));
		test.deepEqual([[2014, 1, 15], [2014, 1, 16]], sdf1.getSameLengthDates([[2014, 1, 17], [2014, 1, 20]], -1));
		test.expect(6);
		test.done();
	
	},
	'end': function(test){
		test.ok(true);
		test.done();
	}
});
