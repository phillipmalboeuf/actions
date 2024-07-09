import { DateTime } from 'luxon'

export const money = (value: any) => {
  const currency = Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    // maximumFractionDigits: 0
  })
  return currency.format(value)
}

export const intlNumber = (value: any) => {
  const n = Intl.NumberFormat('fr-CA', {
    // style: 'currency',
    // currency: 'CAD',
    // maximumFractionDigits: 0
  })
  return n.format(value)
}

export const date = (value: string) => {
  return DateTime.fromISO(value).setLocale('fr-CA').toLocaleString({ month: '2-digit', year: 'numeric' })
}

export const year = (value: string) => {
  return DateTime.fromISO(value).setLocale('fr-CA').toLocaleString({ year: 'numeric' })
}

export const time = (value: string, timezone: number) => {
  return DateTime.fromISO(value).setLocale('fr-CA').setZone(`UTC${timezone}`).toLocaleString({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export const capitalize = (value: string) => {
  return value && value[0].toUpperCase() + value.slice(1)
}

export const imigx = (url: string) => {
  return 'https://zoom.imgix.net/' + url.replace('http:', '').replace('https:', '').replace('//downloads.ctfassets.net', '').replace('//images.ctfassets.net', '').replace('/nbfcd3ddu3u4/', '')
}