import { Exception } from '@adonisjs/core/build/standalone'
import { HnpConfig } from '@ioc:Adonis/Addons/Hnp'
import Config from '@ioc:Adonis/Core/Config'
import Logger from '@ioc:Adonis/Core/Logger'
import i18next from 'i18next'

export default class JobsService {
  public async getJobTypes() {
    const jobTypes: HnpConfig['jobTypes'] = Config.get('hnp.jobTypes')
    try {
      return jobTypes
    } catch (err) {
      Logger.error('Error getting job types: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async getJobPositionTypes() {
    const jobPositionTypes: HnpConfig['jobPositionTypes'] = Config.get('hnp.jobPositionTypes')
    try {
      return jobPositionTypes
    } catch (err) {
      Logger.error('Error getting job position types: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }

  public async getCities() {
    const cities: HnpConfig['cities'] = Config.get('hnp.cities')
    try {
      return cities
    } catch (err) {
      Logger.error('Error getting cities: %s', err.message)
      throw new Exception(i18next.t('common:application error'), 500)
    }
  }
}
