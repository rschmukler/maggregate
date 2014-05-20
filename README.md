# Maggregate
Simple aggregation pipeline builder for MongoDb. Inspired by the eloquent
[aheckmann/mquery](https://github.com/aheckmann/mquery).

## Example Usage

```js
var Maggregate = require('maggregate');

require('mongodb').connect(uri, function (err, db) {
  if (err) return handleError(err);

  // get a collection
  var collection = db.collection('artists');

  // Create an instance of an aggregation
  var aggregation = new Maggregate(collection);

  // Build and execute
  aggregation
    .match({'works.medium': 'paint'})
    .unwind('$works')
    .match({'works.medium': 'paint'})
    .group({_id: '$_id', paintingCount: { $sum: 1 }});
    .exec(cb);

  // Or with a callback...
  var aggregation = new Maggregate(collection);
  aggregation
    .match({'works.medium': 'paint'})
    .unwind('$works')
    .match({'works.medium': 'paint'})
    .group({_id: '$_id', paintingCount: { $sum: 1 }}, cb);
```

Maggregate also supports [co](http://github.com/visionmedia/co)

```js
var aggregation = new Maggregate(collection);

var result = yield aggregation.match('works.medium': 'paint').unwind('$works');
```

## Supported Operations

Currently, all mongo aggregation pipeline operators are supported. To learn how
to use them, see [the documentation for them](http://docs.mongodb.org/manual/reference/operator/aggregation-nav/).

All operations map to their same name, without the `$` prefix. All operations
are chainable, and can take a `callback` for their last argument, making the call
to `exec` unnecessary.

Briefly, the operations are:

- `project`
- `match`
- `limit`
- `skip`
- `unwind`
- `group`
- `sort`
- `geoNear`

## Additional Methods

Maggregate provides a few methods to help use the built aggregation, in addition
to the operators specified above.

#### collection (newCol)

change the collection on the aggregation. returns the chainable interface.

```js
var writers = db.collection('writers');
aggregation.collection(writers).group({...});
```
#### exec

Executes the aggregation. Takes a `callback` in the form of `function(err,
resp)`

```js
aggregation.group({...}).exec(function(err, resp) {
  //Do stuff with it.
});
```

#### wrap (Model)

Wraps the db response using the given model. Simply passes the response into the
given constructor. Returns the chainable interface.

```js
var AnalyticsReport = require('./analytics-report-model.js')
aggregation.wrap(AnalyticsReport);

// ...
// Bunch of queries to make a complex analytics report from the collection
// ...

aggregation.exec(function(err, report) {
  report instanceof AnalyticsReport === true // true
});
```

# License

(The MIT License)

Copyright (c) 2013 [Ryan Schmukler](mailto:ryan@slingingcode.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
