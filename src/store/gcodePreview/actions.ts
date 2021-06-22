import Vue from 'vue'
import { ActionTree } from 'vuex'
import { GcodePreviewState, ParsingRequestPayload } from './types'
import { RootState } from '../types'
import { spawn, Thread, Worker } from 'threads'
import consola from 'consola'

export const actions: ActionTree<GcodePreviewState, RootState> = {
  /**
   * Reset our store
   */
  async reset ({ commit }) {
    commit('setReset')
  },

  async terminateParserWorker ({ commit, state }) {
    if (state.parserWorker) {
      const worker = state.parserWorker

      commit('setParserWorker', null)

      await Thread.terminate(worker)
    }
  },

  async loadGcode ({ commit, getters, state }, payload: ParsingRequestPayload) {
    const databaseKey = `${payload.file.name}-${payload.file.modified}`

    if (payload.serveFromCache) {
      const record = await Vue.$indexedDb.table('gcode').get({ name: databaseKey })

      if (record) {
        commit('setMoves', record.data)

        return
      }
    }

    const worker = await spawn(new Worker('@/workers/parseGcode.worker'))

    commit('setParserWorker', worker)

    worker.progress().subscribe((filePosition: number) => {
      commit('setParserProgress', filePosition)
    })

    const abort = new Promise((resolve, reject) => {
      Thread.events(worker).subscribe(event => {
        if (event.type === 'termination') {
          resolve([])
        }
      })

      Thread.errors(worker).subscribe(reject)
    })

    commit('setParserProgress', 0)
    commit('setMoves', [])

    commit('setFile', payload.file)

    try {
      const parsedGcode = await Promise.race([abort, worker.parse(payload.gcode)])

      if (payload.serveFromCache) {
        await Vue.$indexedDb.table('gcode').put({ name: databaseKey, data: parsedGcode })
      }

      commit('setMoves', parsedGcode)
      commit('setParserProgress', payload.file.size ?? payload.gcode.length)
    } catch (error) {
      consola.error('Parser worker error', error)
    }

    if (state.parserWorker) {
      commit('setParserWorker', null)

      await Thread.terminate(worker)
    }

    if (getters.getMoves.length === 0) {
      commit('clearFile')
    }
  }
}
