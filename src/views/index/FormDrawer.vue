<template>
  <div>
    <a-drawer
      :visible="visible"
      width="100%"
      :body-style="{ padding: '0px' }"
      :closable="false" @close="onClose"
    >
      <div style="height:100vh">
        <a-row style="height:100vh; overflow:auto">
          <a-col :md="24" :lg="12" class="left-editor">
            <a-tabs v-model="activeTab" size="large" type="card" class="editor-tabs">
              <a-tab-pane key="html">
                <span slot="tab">
                  <a-icon
                    :type="activeTab==='html' ? 'edit' : 'code'"
                    :style="{ color: activeTab==='html' ? '#f1fa8c' : '#a95812'}"
                  />
                  template
                </span>
              </a-tab-pane>
              <a-tab-pane key="js">
                <span slot="tab">
                  <a-icon
                    :type="activeTab==='js' ? 'edit' : 'code'"
                    :style="{ color: activeTab==='js' ? '#f1fa8c' : '#a95812'}"
                  />
                  script
                </span>
              </a-tab-pane>
              <a-tab-pane key="css">
                <span slot="tab">
                  <a-icon
                    :type="activeTab==='css' ? 'edit' : 'code'"
                    :style="{ color: activeTab==='css' ? '#f1fa8c' : '#a95812'}"
                  />
                  css
                </span>
              </a-tab-pane>
              <template slot="tabBarExtraContent">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('base.resource.reference') }}
                  </template>
                  <a-button
                    type="primary"
                    shape="circle"
                    :style="{marginRight: '20px'}"
                    icon="sliders"
                    size="small"
                    @click="showResource"
                  />
                </a-tooltip>
              </template>
            </a-tabs>
            <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
            <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
            <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
          </a-col>
          <a-col :md="24" :lg="12" class="right-preview">
            <div class="action-bar" :style="{'text-align': 'left'}">
              <a-button icon="reload" type="link" size="small" @click="runCode">
                {{ $t('base.refresh') }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="cloud-download" type="link" size="small" @click="$refs.exportModal.onOpen('vue')">
                {{ $t('base.export.vue.file') }}
              </a-button>
              <a-divider type="vertical" />
              <a-button class="copy-btn" icon="copy" size="small" type="link">
                {{ $t('base.copy.code') }}
              </a-button>
              <a-divider type="vertical" />
              <a-button icon="close-circle" size="small" type="link" @click="onClose">
                {{ $t('base.close') }}
              </a-button>
            </div>
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              :src="iframeSrc"
              @load="iframeLoad"
            />
          </a-col>
        </a-row>
      </div>
    </a-drawer>
    <resource-modal
      ref="resourceModal"
      @save="setResource"
    />
    <export-modal ref="exportModal" @confirm="exportFile" />
  </div>
</template>
<script>
import { parse } from '@babel/parser'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import { exportDefault, beautifierConf, titleCase } from '@/utils/index'
import ResourceModal from './ResourceModal'
import ExportModal from './ExportModal'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'

const editorObj = {
  html: null,
  js: null,
  css: null
}
const mode = {
  html: 'html',
  js: 'javascript',
  css: 'css'
}
let beautifier
let monaco

export default {
  components: {
    ResourceModal,
    ExportModal
  },
  data() {
    return {
      generateConf: {},
      visible: false,
      loading: true,
      activeTab: 'html',
      htmlCode: '',
      jsCode: '',
      cssCode: '',
      codeFrame: '',
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      scripts: [],
      links: [],
      monaco: null,
      iframeSrc: 'preview.html'
    }
  },
  computed: {
    resources() {
      return this.scripts.concat(this.links)
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-btn', {
      text: trigger => {
        const codeStr = this.generateCode()
        this.$notification.success({
          message: this.$t('base.successfully'),
          description:
            this.$t('base.code.copy.successfully')
        })
        return codeStr
      }
    })
    clipboard.on('error', e => {
      this.$message.error(this.$t('base.code.copy.failed'))
    })
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.preventDefaultSave)
  },
  methods: {
    preventDefaultSave(e) {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
      }
    },
    onOpen(formData, generateConf) {
      this.visible = true
      const { type } = generateConf
      this.generateConf = generateConf
      this.htmlCode = makeUpHtml(formData, type)
      this.jsCode = makeUpJs(formData, type)
      this.cssCode = makeUpCss(formData)
      loadBeautifier(btf => {
        beautifier = btf
        this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
        this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
        this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

        loadMonaco(val => {
          monaco = val
          this.$nextTick(() => {
            this.setEditorValue('editorHtml', 'html', this.htmlCode)
            this.setEditorValue('editorJs', 'js', this.jsCode)
            this.setEditorValue('editorCss', 'css', this.cssCode)
            if (!this.isInitcode) {
              this.isRefreshCode = true
              this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
            }
            this.loading = false
          })
        })
      })
    },
    onClose() {
      this.visible = false
      this.isInitcode = false
      this.isRefreshCode = false
      // this.$refs.previewPage.src = this.iframeSrc
    },
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isRefreshCode && (this.isInitcode = true) && this.runCode()
      }
    },
    setEditorValue(id, type, codeStr) {
      if (editorObj[type]) {
        editorObj[type].setValue(codeStr)
      } else {
        editorObj[type] = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: mode[type],
          automaticLayout: true
        })
      }
      // ctrl + s 刷新
      editorObj[type].onKeyDown(e => {
        if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
          this.runCode()
        }
      })
    },
    runCode() {
      const jsCodeStr = editorObj.js.getValue()
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm(
            this.$t('base.js.format.failed'),
            this.$t('base.hint'),
            {
              type: 'warning'
            }
          )
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              generateConf: this.generateConf,
              html: editorObj.html.getValue(),
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css.getValue(),
              scripts: this.scripts,
              links: this.links
            }
          }
          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          )
        } else {
          this.$message.error(this.$t('base.use.export.export'))
        }
      } catch (err) {
        this.$message.error(`${this.$t('base.use.export.export')}: ${err}`)
        console.error(err)
      }
    },
    generateCode() {
      const html = vueTemplate(editorObj.html.getValue())
      const script = vueScript(editorObj.js.getValue())
      const css = cssStyle(editorObj.css.getValue())
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    exportFile(fileName) {
      if (!fileName) fileName = `${+new Date()}.vue`
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, fileName)
    },
    showResource() {
      this.$refs.resourceModal.onOpen(this.resources)
    },
    setResource(arr) {
      const scripts = []; const
        links = []
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (item.endsWith('.css')) {
            links.push(item)
          } else {
            scripts.push(item)
          }
        })
        this.scripts = scripts
        this.links = links
      } else {
        this.scripts = []
        this.links = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.tab-editor {
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14px;
}
.left-editor {
  position: relative;
  height: 100%;
  background: #1e1e1e;
  overflow: hidden;
}
.setting{
  position: absolute;
  right: 15px;
  top: 3px;
  color: #a9f122;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 40px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
@include action-bar;
</style>
