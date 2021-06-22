import Dexie from 'dexie'
import { AppFile } from '@/store/files/types'

export const generateCacheKey = (file: AppFile) => {
  return `${file.filename}-${file.modified}`
}

export const getFile = async (file: AppFile, table: Dexie.Table) => {
  const key = generateCacheKey(file)

  return table.get({ name: key })
}

export const isFileCached = async (file: AppFile, table: Dexie.Table) => {
  const key = generateCacheKey(file)
  const record = await table.get({ name: key })

  return !!record
}
