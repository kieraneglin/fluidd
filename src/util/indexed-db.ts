import Dexie from 'dexie'

export const databaseName = 'fluidd_indexed_db'

export const initializeDatabase = () => {
  const db = new Dexie(databaseName)

  // Any migrations can be added here, but given the cache's non-essential
  // nature it may be best to just nuke it and rebuild
  db.version(1).stores({
    files: 'name',
    gcode: 'name'
  })

  return db
}

export const ensureDatabaseOpen = async (db: Dexie) => {
  if (!db.isOpen()) {
    await db.open()
  }

  return db
}
