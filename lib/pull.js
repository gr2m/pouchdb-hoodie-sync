'use strict'

var toId = require('./utils/to-id')

module.exports = function pull (options, docsOrIds) {
  var pulledObjects = []
  var Promise = this.constructor.utils.Promise
  var defer = {}

  defer.promise = new Promise(function (resolveCallback, rejectCallback) {
    defer.resolve = function resolve () {
      resolveCallback.apply(null, arguments)
    }
    defer.reject = function reject () {
      rejectCallback.apply(null, arguments)
    }
  })

  if (Array.isArray(docsOrIds)) {
    docsOrIds = docsOrIds.map(toId)
  } else {
    docsOrIds = docsOrIds && [toId(docsOrIds)]
  }

  var replication = this.replicate.from(options.remote, {
    doc_ids: docsOrIds
  })
  replication.on('complete', function () {
    defer.resolve(pulledObjects)
  })
  replication.on('error', defer.reject)

  replication.on('change', function (change) {
    pulledObjects.push(change.doc)
  })

  return defer.promise
}
