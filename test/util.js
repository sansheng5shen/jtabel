var testCase = require('/usr/local/lib/node_modules/nodeunit').testCase;
module.exports = testCase({
    setUp: function(callback) {
        callback();
    },
    tearDown: function(callback) {
        callback();
    },
    "Test 0.1": function(test) {
        test.ok(true);
        test.done();
    }
});
