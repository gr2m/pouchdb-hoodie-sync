var test = require('tape')
var dbFactory = require('../utils/db')

test('returns hoodie.store-inspired API', function (t) {
  t.plan(3)

  var db = dbFactory()

  t.is(typeof db.hoodieSync, 'function', 'exposes plugin initialisation method')

  var store = db.hoodieSync()

  t.is(typeof store, 'object', 'is object')
  t.is(store.db, db, 'exposes db')
})
