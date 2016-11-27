module.exports = sync

var Promise = require('lie')

var toId = require('./utils/to-id')

/**
 * syncs one or multiple objects between local and remote database
 *
 * @param  {StringOrObject} docsOrIds   object or ID of object or array of objects/ids (all optional)
 * @return {Promise}
 */
function sync (state, docsOrIds) {
  var syncedObjects = []
  var errors = state.db.constructor.Errors
  var defer = {}

  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = function resolveCallback () {
      resolve.apply(null, arguments)
    }
    defer.reject = function rejectCallback () {
      reject.apply(null, arguments)
    }
  })

  if (Array.isArray(docsOrIds)) {
    docsOrIds = docsOrIds.map(toId)
  } else {
    docsOrIds = docsOrIds && [toId(docsOrIds)]
  }

  if (docsOrIds && docsOrIds.filter(Boolean).length !== docsOrIds.length) {
    return Promise.reject(errors.NOT_AN_OBJECT)
  }

  var replication = state.db.sync(state.remote, {
    doc_ids: docsOrIds,
    include_docs: true
  })

  /* istanbul ignore next */
  replication.catch(function () {
    // handled trough 'error' event
  })

  replication.on('complete', function () {
    defer.resolve(syncedObjects)
  })
  replication.on('error', defer.reject)

  replication.on('change', function (change) {
    syncedObjects = syncedObjects.concat(change.change.docs)

    for (var i = 0; i < change.change.docs.length; i++) {
      state.emitter.emit(change.direction, change.change.docs[i])
    }
  })
  return defer.promise
}
