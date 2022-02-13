import storage from 'store'
import { formConf } from '@/components/generator/config'

import {
  DRAWING_ITEMS,
  DRAWING_ITEMS_VERSION,
  DRAWING_ITEMS_VERSION_KEY,
  DRAWING_ID,
  TREE_NODE_ID,
  FORM_CONF,
  LANG
} from '@/store/mutation-types'
import { loadLanguageAsync } from '@/locales'

const app = {
  state: {
    drawingItems: null,
    drawingItemsVersion: DRAWING_ITEMS_VERSION,
    idGlobal: 100,
    treeNodeId: 100,
    formConf,
    lang: 'en-US',
    _antLocale: {}
  },
  mutations: {
    [DRAWING_ITEMS]: (state, drawingItems) => {
      state.drawingItems = drawingItems
      storage.set(DRAWING_ITEMS, drawingItems)
    },
    [DRAWING_ITEMS_VERSION_KEY]: (state, drawingItemsVersion) => {
      state.drawingItemsVersion = drawingItemsVersion
      storage.set(DRAWING_ITEMS_VERSION_KEY, drawingItemsVersion)
    },
    [DRAWING_ID]: (state, idGlobal) => {
      state.idGlobal = idGlobal
      storage.set(DRAWING_ID, idGlobal)
    },
    [TREE_NODE_ID]: (state, treeNodeId) => {
      state.treeNodeId = treeNodeId
      storage.set(TREE_NODE_ID, treeNodeId)
    },
    [FORM_CONF]: (state, formConfValue) => {
      state.formConf = formConfValue
      storage.set(FORM_CONF, formConfValue)
    },
    [LANG]: (state, lang, antd = {}) => {
      state.lang = lang
      state._antLocale = antd
      storage.set(LANG, lang)
    }
  },
  actions: {
    setLang({ commit }, lang) {
      return new Promise((resolve, reject) => {
        commit(LANG, lang)
        loadLanguageAsync(lang).then(() => {
          resolve()
        }).catch(e => {
          reject(e)
        })
      })
    }
  }
}

export default app
