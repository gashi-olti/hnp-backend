import { DateTime } from 'luxon'

import { BaseModel, LucidRow, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

// Optional null check query
export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull('deleted_at')
}

export const softDelete = async (row: LucidRow, column: string = 'deletedAt') => {
  if (row[column]) {
    if (row[column].isLuxonDateTime) {
      // Deleted represented by a datetime
      row[column] = DateTime.utc()
    } else {
      // Deleted represented by a boolean
      row[column] = true
    }
    await row.save()
  }
}
