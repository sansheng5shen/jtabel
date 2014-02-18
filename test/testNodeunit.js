var testCase = require('/usr/local/lib/node_modules/nodeunit').testCase;

module.exports = testCase({
    setUp: function(callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function(callback) {
        // clean up
        callback();
    },
    "Test 0.1": function(test) {
        test.ok(true);
		console.log(this.foo)
        test.done();
    },
    "第二个测试": function(test) {
        test.ok(false);
        test.done();
    },
    "第3个测试": function(test) {
        test.ok(true);
        test.done();
    }
});
