import store from '@/store'
import storage from 'store'
import {
  DRAWING_ITEMS,
  DRAWING_ID,
  TREE_NODE_ID,
  FORM_CONF,
  LANG
} from '@/store/mutation-types'
import { printANSI } from '@/utils/screenLog'
import { formConf } from '@/components/generator/config'

export default function Initializer() {
  printANSI() // 请自行移除该行.  please remove this line

  store.commit(DRAWING_ITEMS, storage.get(DRAWING_ITEMS, null))
  store.commit(DRAWING_ID, storage.get(DRAWING_ID, 100))
  store.commit(TREE_NODE_ID, storage.get(TREE_NODE_ID, 100))
  store.commit(FORM_CONF, storage.get(FORM_CONF, formConf))

  store.dispatch('setLang', storage.get(LANG, 'zh-CN'))
  // last step
}
