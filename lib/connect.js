'use strict'

module.exports = connect

/**
 * connects local and remote database
 *
 * @return {Promise}
 */

function connect (state, options) {
  var Promise = this.constructor.utils.Promise

  if (!state.replication) {
    state.replication = this.sync(options.remote, {
      create_target: true,
      live: true,
      retry: true,
      ajax: options.ajax
    })

    state.replication.on('error', function (error) {
      state.emitter.emit('error', error)
    })

    state.replication.on('change', function (change) {
      for (var i = 0; i < change.change.docs.length; i++) {
        state.emitter.emit(change.direction, change.change.docs[i])
      }
    })

    state.emitter.emit('connect')
  }

  return Promise.resolve()
}
