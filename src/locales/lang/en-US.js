import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'
import base from './en-US/base'
import tag from './en-US/tag'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

export default {
  message: '-',

  ...components,
  ...base,
  ...tag
}
