import Vue from 'vue'
import { loadScriptQueue } from '@/utils/loadScript'
import axios from 'axios'

Vue.prototype.$axios = axios

const $previewApp = document.getElementById('previewApp')
const childAttrs = {
  file: '',
  modal: ' ref="previewModal" width="600px" '
}

const childMounted = {
  file: '',
  modal: 'this.$refs.previewModal.onOpen()'
}

window.addEventListener('message', init, false)

function buildLinks(links) {
  let strs = ''
  links.forEach(url => {
    strs += `<link href="${url}" rel="stylesheet">`
  })
  return strs
}

function init(event) {
  if (event.data.type === 'refreshFrame') {
    const code = event.data.data
    const attrs = childAttrs[code.generateConf.type]
    const mounted = childMounted[code.generateConf.type]
    let links = ''

    if (Array.isArray(code.links) && code.links.length > 0) {
      links = buildLinks(code.links)
    }

    $previewApp.innerHTML = `${links}<style>${code.css}</style><div class="aa" id="app"></div>`

    if (Array.isArray(code.scripts) && code.scripts.length > 0) {
      loadScriptQueue(code.scripts, () => {
        newVue(attrs, mounted, code.js, code.html)
      })
    } else {
      newVue(attrs, mounted, code.js, code.html)
    }
  }
}

function newVue(attrs, mounted, main, html) {
  main = eval(`(${main})`)
  main.template = `${html}`
  new Vue({
    components: {
      child: main
    },
    data() {
      return {
        visible: false
      }
    },
    mounted() {
      if (mounted) {
        this.visible = true
        eval(`(${mounted})`)
      }
    },
    template: `<div><child ${attrs}/><div>`
  }).$mount('#app')
}
