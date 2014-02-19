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
        test.equal(7, sdf.getWeek([2014, 1, 5]));
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
    '根据参考日期获取step天，根据最小日期、最大日期，不足step天，有几天，返回几天；包含今天': function(test) {
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
    '根据参考日期获取step天，根据最小日期、最大日期，不足step天，有几天，返回几天；包含今天,返回区间时间': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-01-15',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.deepEqual([
            [2014, 1, 15],
            [2014, 1, 18]
        ], sdf1.getStepDates([2014, 1, 18], -6));
        test.deepEqual([
            [2014, 2, 12],
            [2014, 2, 18]
        ], sdf1.getStepDates([2014, 2, 18], -6));
        test.deepEqual([
            [2014, 2, 14],
            [2014, 2, 18]
        ], sdf1.getStepDates([2014, 2, 14], 6));
        test.deepEqual([
            [2014, 2, 18],
            [2014, 2, 18]
        ], sdf1.getStepDates([2014, 2, 18], 6));
        test.expect(4);
        test.done();
    },
    '根据参考时间根据方向向前或向后返回等长的时间区间': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-01-15',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.deepEqual([
            [2014, 2, 13],
            [2014, 2, 15]
        ], sdf1.getSameLengthDates([
            [2014, 2, 18],
            [2014, 2, 16]
        ], -1));
        test.deepEqual([
            [2014, 2, 13],
            [2014, 2, 15]
        ], sdf1.getSameLengthDates([
            [2014, 2, 16],
            [2014, 2, 18]
        ], -1));
        test.deepEqual([
            [2014, 2, 18],
            [2014, 2, 18]
        ], sdf1.getSameLengthDates([
            [2014, 2, 18],
            [2014, 2, 16]
        ], 1));
        test.deepEqual([
            [2014, 2, 17],
            [2014, 2, 18]
        ], sdf1.getSameLengthDates([
            [2014, 2, 16],
            [2014, 2, 14]
        ], 1));
        test.deepEqual([
            [2014, 1, 16],
            [2014, 1, 19]
        ], sdf1.getSameLengthDates([
            [2014, 1, 20],
            [2014, 1, 23]
        ], -1));
        test.deepEqual([
            [2014, 1, 15],
            [2014, 1, 16]
        ], sdf1.getSameLengthDates([
            [2014, 1, 17],
            [2014, 1, 20]
        ], -1));
        test.expect(6);
        test.done();
    },
    '日期判断是不是自然月': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-02-02',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.ok(sdf1.isNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ]));
        test.ok(!sdf1.isNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ], 1));
        test.ok(sdf1.isNatureMonth([
            [2014, 2, 1],
            [2014, 2, 18]
        ]));
        test.ok(sdf1.isNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ]));
        test.ok(!sdf1.isNatureMonth([
            [2014, 2, 1],
            [2014, 2, 18]
        ], 1));

        opts.minDate = '2014-01-02';
        var sdf2 = new SDF(opts);
        test.ok(!sdf2.isNatureMonth([
            [2014, 1, 2],
            [2014, 1, 31]
        ], 1));
        test.ok(sdf2.isNatureMonth([
            [2014, 1, 2],
            [2014, 1, 31]
        ]));

        opts.minDate = '2013-01-02';
        var sdf3 = new SDF(opts);
        test.ok(sdf3.isNatureMonth([
            [2013, 11, 1],
            [2013, 11, 30]
        ]));
        test.ok(sdf3.isNatureMonth([
            [2013, 11, 1],
            [2013, 11, 30]
        ], 1));

        test.expect(9);
        test.done();

    },
    '日期判断是不是自然周': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-02-02',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.ok(sdf1.isNatureWeek([
            [2014, 2, 2],
            [2014, 2, 2]
        ]));
        test.ok(!sdf1.isNatureWeek([
            [2014, 2, 2],
            [2014, 2, 2]
        ], 1));
        test.ok(sdf1.isNatureWeek([
            [2014, 2, 17],
            [2014, 2, 18]
        ]));
        test.ok(!sdf1.isNatureWeek([
            [2014, 2, 17],
            [2014, 2, 18]
        ], 1));
        test.ok(sdf1.isNatureWeek([
            [2014, 2, 10],
            [2014, 2, 16]
        ], 1));
        test.ok(sdf1.isNatureWeek([
            [2014, 2, 10],
            [2014, 2, 16]
        ]));

        opts.minDate = '2014-02-17';
        opts.maxDate = '2014-02-22';
        var sdf2 = new SDF(opts);
        test.ok(sdf2.isNatureWeek([
            [2014, 2, 17],
            [2014, 2, 22]
        ]));
        test.ok(!sdf2.isNatureWeek([
            [2014, 2, 17],
            [2014, 2, 22]
        ], 1));
        test.expect(8);
        test.done();
    },
    '根据参考日期获取上个自然周或者下个自然周': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-02-02',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.deepEqual([
            [2014, 2, 2],
            [2014, 2, 2]
        ], sdf1.getNatureWeek([
            [2014, 2, 5],
            [2014, 2, 6]
        ], -1));
        test.deepEqual([
            [2014, 2, 5],
            [2014, 2, 6]
        ], sdf1.getNatureWeek([
            [2014, 2, 5],
            [2014, 2, 6]
        ], -1, 1));
        test.deepEqual([
            [2014, 2, 17],
            [2014, 2, 18]
        ], sdf1.getNatureWeek([
            [2014, 2, 11],
            [2014, 2, 12]
        ], 1));
        test.deepEqual([
            [2014, 2, 11],
            [2014, 2, 12]
        ], sdf1.getNatureWeek([
            [2014, 2, 11],
            [2014, 2, 12]
        ], 1, 1));
        test.deepEqual([
            [2014, 2, 3],
            [2014, 2, 9]
        ], sdf1.getNatureWeek([
            [2014, 2, 11],
            [2014, 2, 12]
        ], -1));
        test.deepEqual([
            [2014, 2, 3],
            [2014, 2, 9]
        ], sdf1.getNatureWeek([
            [2014, 2, 11],
            [2014, 2, 12]
        ], -1, 1));
        test.deepEqual([
            [2014, 2, 10],
            [2014, 2, 16]
        ], sdf1.getNatureWeek([
            [2014, 2, 3],
            [2014, 2, 9]
        ], 1));
        test.deepEqual([
            [2014, 2, 10],
            [2014, 2, 16]
        ], sdf1.getNatureWeek([
            [2014, 2, 3],
            [2014, 2, 9]
        ], 1, 1));


        opts.minDate = '2014-02-10';
        opts.maxDate = '2014-02-13';
        var sdf2 = new SDF(opts);
        test.deepEqual([
            [2014, 2, 10],
            [2014, 2, 13]
        ], sdf2.getNatureWeek([
            [2014, 2, 10],
            [2014, 2, 13], 1
        ]));
        test.deepEqual([
            [2014, 2, 10],
            [2014, 2, 13]
        ], sdf2.getNatureWeek([
            [2014, 2, 10],
            [2014, 2, 13], 1, 1
        ]));
        test.deepEqual([
            [2014, 2, 10],
            [2014, 2, 13]
        ], sdf2.getNatureWeek([
            [2014, 2, 10],
            [2014, 2, 13], -1, 1
        ]));
        test.expect(11);
        test.done();
    },
    '根据参考日期获取上个自然月或者下个自然月': function(test) {
        var opts = {
            separator: '-',
            date2Separator: '至',
            minDate: '2014-02-02',
            maxDate: '2014-02-18'
        };
        var sdf1 = new SDF(opts);
        test.deepEqual([
            [2014, 2, 2],
            [2014, 2, 18]
        ], sdf1.getNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ], 1));
        test.deepEqual([
            [2014, 2, 2],
            [2014, 2, 18]
        ], sdf1.getNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ], 1, 1));
        test.deepEqual([
            [2014, 2, 2],
            [2014, 2, 18]
        ], sdf1.getNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ], -1));
        test.deepEqual([
            [2014, 2, 2],
            [2014, 2, 18]
        ], sdf1.getNatureMonth([
            [2014, 2, 2],
            [2014, 2, 18]
        ], -1, 1));


        opts.minDate = '2014-01-10';
        opts.maxDate = '2014-02-13';
        var sdf2 = new SDF(opts);
        test.deepEqual([
            [2014, 1, 10],
            [2014, 1, 31]
        ], sdf2.getNatureMonth([
            [2014, 2, 1],
            [2014, 2, 18]
        ], -1));
        test.deepEqual([
            [2014, 2, 1],
            [2014, 2, 13]
        ], sdf2.getNatureMonth([
            [2014, 2, 1],
            [2014, 2, 18]
        ], -1, 1));
        test.deepEqual([
            [2014, 2, 1],
            [2014, 2, 13]
        ], sdf2.getNatureMonth([
            [2014, 1, 10],
            [2014, 1, 31]
        ], 1));
        test.deepEqual([
            [2014, 1, 10],
            [2014, 1, 31]
        ], sdf2.getNatureMonth([
            [2014, 1, 10],
            [2014, 1, 31]
        ], -1));


        opts.minDate = '2014-01-10';
        opts.maxDate = '2014-05-13';
        var sdf3 = new SDF(opts);
        test.deepEqual([
            [2014, 4, 1],
            [2014, 4, 30]
        ], sdf3.getNatureMonth([
            [2014, 3, 1],
            [2014, 3, 31]
        ], 1, 1));
        test.deepEqual([
            [2014, 4, 1],
            [2014, 4, 30]
        ], sdf3.getNatureMonth([
            [2014, 3, 1],
            [2014, 3, 31]
        ], 1));
        test.deepEqual([
            [2014, 2, 1],
            [2014, 2, 28]
        ], sdf3.getNatureMonth([
            [2014, 3, 1],
            [2014, 3, 31]
        ], -1, 1));
        test.deepEqual([
            [2014, 2, 1],
            [2014, 2, 28]
        ], sdf3.getNatureMonth([
            [2014, 3, 1],
            [2014, 3, 31]
        ], -1));
        test.deepEqual([
            [2014, 1, 10],
            [2014, 1, 31]
        ], sdf3.getNatureMonth([
            [2014, 2, 1],
            [2014, 2, 28]
        ], -1));
        test.deepEqual([
            [2014, 5, 1],
            [2014, 5, 13]
        ], sdf3.getNatureMonth([
            [2014, 4, 1],
            [2014, 4, 30]
        ], 1));

        test.expect(14);
        test.done();

    },
    '结束': function(test) {
        test.ok(true);
        test.done();
    }
});
