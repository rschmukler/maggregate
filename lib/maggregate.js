function Maggregate(collection) {
  if(!(this instanceof Maggregate))
    return new Maggregate(collection);

  this._col = collection;
  this._aggregation = [];
};

var pipelineOps = ['project', 'match', 'limit', 'skip',
                   'unwind', 'group', 'sort', 'geoNear'];

pipelineOps.forEach(function(op) {
  var key = '$' + op;
  Maggregate.prototype[op] = function(opt, cb) {
    var obj = {};
    obj[key] = opt;
    this._aggregation.push(obj);

    if(cb)
      this.exec(cb);

    return this;
  };
});

Maggregate.prototype.wrap = function(Model) {
  this._wrapper = Model;
  return this;
};

Maggregate.prototype.collection = function(newCol) {
  this._col = newCol;
  return this;
};

Maggregate.prototype.exec = function(cb) {
  var self = this;
  this._col.aggregate(this._aggregation, function(err, resp) {
    if(self._wrapper) resp = new self._wrapper(resp);
    cb(err, resp);
  });
};

module.exports = Maggregate;
