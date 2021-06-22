import _Vue from 'vue'
import Dexie from 'dexie'
import { initializeDatabase, ensureDatabaseOpen } from '@/util/indexed-db'

export const IndexedDbPlugin = {
  install (Vue: typeof _Vue) {
    const database = initializeDatabase()
    // This is async but per the Dexie docs, it doesn't matter
    // Any requests will be queued and executed when the database
    // is eventually opened.
    ensureDatabaseOpen(database)

    Vue.prototype.$indexedDb = database
    Vue.$indexedDb = database
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $indexedDb: Dexie;
  }

  interface VueConstructor {
    $indexedDb: Dexie;
  }
}
