import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'
import Hashids from 'hashids'
import DOMPurify from 'isomorphic-dompurify'

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960#issuecomment-576906058
declare var URL: typeof globalThis extends { URL: infer URLCtor }
  ? URLCtor
  : typeof import('url').URL

export function getProtocol(url: string) {
  try {
    const urlObject = new URL(url)
    return urlObject.protocol.replace(/\W/, '')
  } catch (error) {
    throw new Error(`Unable to get protocol from ${url}.`)
  }
}

export async function getUserName(user: User) {
  if (user.companyId) {
    if (!user.company) {
      await user.load('company')
    }
    if (user.company.name) {
      return user.company.name
    }
  }
}

export const numberToCurrency = (number: number, locale: string = 'de-DE') =>
  Number(Math.round(number * 100) / 100).toLocaleString(locale, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
  })

export const toTitleCase = (str: string): string =>
  str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })

const umlautMap = {
  '\u00dc': 'UE',
  '\u00c4': 'AE',
  '\u00d6': 'OE',
  '\u00fc': 'ue',
  '\u00e4': 'ae',
  '\u00f6': 'oe',
  '\u00df': 'ss',
}

export const hashids: { [key: string]: Hashids } = {
  posts: new Hashids(Env.get('POSTS_SALT'), 8),
  companies: new Hashids(Env.get('COMPANIES_SALT'), 8),
}

export const getSlug = (value: (string | undefined)[], id: number, entity: string) => {
  if (!id) {
    return undefined
  }
  const filtered = value.filter((val) => val !== undefined)

  const hid = hashids[entity].encode(id)
  if (filtered.length) {
    return (
      filtered
        .join('-')
        .replace(/\s/g, '')
        .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, (a) => {
          const big = umlautMap[a.slice(0, 1)]
          return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1)
        })
        .replace(new RegExp('[' + Object.keys(umlautMap).join('|') + ']', 'g'), (a) => umlautMap[a])
        .toLowerCase() + `-${hid}`
    )
  }
  return hid
}

export const sanitizeToPlainText = (value: string | null) => {
  return value
    ? DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      })
        .replace(/&nbsp;/g, ' ')
        .replace(/\s\s+|\n/g, ' ')
        .trim()
    : null
}
