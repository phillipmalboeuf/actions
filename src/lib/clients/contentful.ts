import contentful from 'contentful'

const preview = true
export const content = contentful.createClient({
  space: 'nbfcd3ddu3u4',
  host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  accessToken: preview ? 'Y6zh0S51mbNqgNT7EZuul9lspvjKqoc6lTzFQ0bzBWE' : '1GwUs44i2WFl_aKn7OA6mc1xL9aAsU-KRRIje94PIG8',
}).withoutUnresolvableLinks