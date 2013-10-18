var expect = require('expect.js'),
    Maggregate = require('../index.js');
  
var fakeCollection = {};

describe('Maggregate', function() {
  it('returns an instance of a maggregation', function() {
    var magA = Maggregate(fakeCollection),
        magB = new Maggregate(fakeCollection);

    expect(magA).to.be.a(Maggregate);
    expect(magB).to.be.a(Maggregate);
  });

  describe('operations', function() {
    var aggregate;
    before(function() {
      aggregate = new Maggregate(fakeCollection);
    });
    it('adds the appropriate operation the aggregation queue', function() {
      var opt = {_id:  1};
      aggregate.project(opt);
      expect(aggregate._aggregation).to.have.length(1);
      expect(aggregate._aggregation[0]).to.have.property('$project', opt);
    });
    it('returns a chainable interface', function() {
      expect(aggregate.limit(5)).to.be(aggregate);
    });
    it('calls exec with a callback specified', function(done) {
      var callback = function() { };

      aggregate.exec = function(cb) {
        expect(cb).to.be(callback);
        done();
      };
      aggregate.limit(5, callback);
    });
  });

  describe('collection', function() {
    var aggregate;
    before(function() {
      aggregate = new Maggregate(fakeCollection);
    });
    it('sets the collection', function() {
      var newCol = { };
      aggregate.collection(newCol);
      expect(aggregate._col).to.be(newCol);
    });
    it('returns a chainable interface', function() {
      var newCol = { };
      aggregate.collection(newCol);
      expect(aggregate.collection(newCol)).to.be(aggregate);
    });
  });

  describe('wrap', function() {
    var aggregate;
    before(function() {
      aggregate = new Maggregate(fakeCollection);
    });
    it('sets the wrapper interface', function() {
      var Model = function() { };
      aggregate.wrap(Model);
      expect(aggregate._wrapper).to.be(Model);
    });
    it('returns a chainable interface', function() {
      var Model = function() { };
      expect(aggregate.wrap(Model)).to.be(aggregate);
    });
  });

  describe('exec', function() {
    var aggregate;
    before(function() {
      aggregate = new Maggregate(fakeCollection);
    });
    it('calls aggregate on the collection', function(done) {
      var callback = function(err, result) { 
        expect(err).to.be(null);
        expect(result).to.be(5);
        done();
      };
      fakeCollection.aggregate = function(pipeline, cb) {
        expect(pipeline).to.be(aggregate._aggregation);
        cb(null, 5);
      };
      aggregate.exec(callback);
    });
    it('wraps the response if a wrapper was specified', function(done) {
      var Person = function(age) {
        this.age = age;
      }
      var callback = function(err, person) { 
        expect(person).to.be.a(Person);
        expect(person.age).to.be(5);
        done();
      };
      fakeCollection.aggregate = function(pipeline, cb) {
        cb(null, 5);
      };
      aggregate.wrap(Person).exec(callback);
    });
  });
});
