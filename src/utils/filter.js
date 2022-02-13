import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

Vue.filter('NumberFormat', value => {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern))

Vue.filter('moment', (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern))
