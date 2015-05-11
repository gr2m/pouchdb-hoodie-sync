var test = require('tape')
var dbFactory = require('../utils/db')

/* create if db does not exist, ping if exists or created */
test('api.pull() creates 2 db`s and puts data in first, second remains empty', function (t) {
  t.plan(2)
  var db1 = dbFactory('db1')
  var db2 = dbFactory('db2')
  var PouchDB = db1.constructor
  var remoteName = PouchDB.utils.uuid(10)
  var api = db1.hoodieSync({remote: remoteName})

  db1.put({_id: 'test'})

  .then(function () {
    return api.pull()
  })

  .then(function () {
    return db2.info()
  })

  .then(function (info) {
    t.equal(info.db_name, 'db2', 'remote db2 exists ')
  })

  .then(function () {
    return db1.info()
  })

  .then(function (info) {
    t.equal(info.doc_count, 1, 'remote db1 exists and 1 doc got added')
  })
})

/* create if db does not exist, ping if exists or created */
test('api.pull()', function (t) {
  t.plan(1)
  var db3 = dbFactory('db3')
  var db4 = dbFactory('db4')
  var api = db3.hoodieSync({remote: 'db4'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  db4.bulkDocs([obj1, obj2])

  .then(function () {
    api.pull() // empty
    .then(function (obj) {
      t.equal(obj.length, 2, '2 objects pulled')
    })
  })
})

/* create if db does not exist, ping if exists or created */
test('api.pull(string)', function (t) {
  t.plan(1)
  var db3 = dbFactory('db3')
  var db4 = dbFactory('db4')
  var api = db3.hoodieSync({remote: 'db4'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  db4.bulkDocs([obj1, obj2])

  .then(function () {
    api.pull('test1') // string
    .then(function (obj) {
      t.equal(obj.length, 1, '1 object pulled')
    })
  })
})

/* create if db does not exist, ping if exists or created */
test('api.pull(objects)', function (t) {
  t.plan(1)
  var db3 = dbFactory('db3')
  var db4 = dbFactory('db4')
  var api = db3.hoodieSync({remote: 'db4'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db4.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.pull([obj1, 'test2']) // objects
    .then(function (obj) {
      t.equal(obj.length, 2, '2 objects pulled')
    })
  })
})

/* create if db does not exist, ping if exists or created */
test('api.pull(object)', function (t) {
  t.plan(1)
  var db3 = dbFactory('db3')
  var db4 = dbFactory('db4')
  var api = db3.hoodieSync({remote: 'db4'})

  var obj1 = {_id: 'test1', foo1: 'bar1'}
  var obj2 = {_id: 'test2', foo1: 'bar2'}
  var obj3 = {_id: 'test3', foo1: 'bar3'}
  db4.bulkDocs([obj1, obj2, obj3])

  .then(function () {
    api.pull(obj3) // object
    .then(function (obj) {
      t.equal(obj.length, 1, '1 object pulled')
    })
  })
})
