"use strict";
var testCase = require('/usr/local/lib/node_modules/nodeunit').testCase;
var Calendar = require('../src/core').Calendar,
    calendar;


module.exports = testCase({
    setUp: function(callback) {
        var opts = {
			maxDate: '2014-02-19',
			today: '2014-02-19',
			minDate: '2014-01-02'
		};
        calendar = new Calendar(opts);
		callback();
    },
    tearDown: function(callback) {
        callback();
    },
    "hello": function(test) {
        test.ok(true);
        test.done();
    },
    '结束': function(test) {
        test.ok(true);
        test.done();
    }
});
