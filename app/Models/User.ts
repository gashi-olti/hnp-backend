import { DateTime } from 'luxon'
import { Hash } from '@ioc:Adonis/Core/Hash'
import { string } from '@ioc:Adonis/Core/Helpers'
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasOne,
  HasOne,
  computed,
  hasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'

enum ProfileTypes {
  company = 1,
  admin,
}
