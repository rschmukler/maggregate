require('co-mocha');

var expect = require('expect.js'),
    Maggregate = require('../index.js');

describe('maggregate', function() {
  it('supports es6', function*() {
    var aggregate = new Maggregate({
      aggregate: function(agg, cb) { cb(null, 3); }
    });
    var result = yield aggregate.project({a: 1}).match({});
    expect(result).to.be(3);
  });
});
