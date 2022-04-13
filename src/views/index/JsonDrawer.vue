<template>
  <div>
    <a-drawer
      :visible.sync="jsonDrawerVisible"
      width="45%"
      :body-style="{ padding: '0px' }"
      :closable="false"
    >
      <a-spin tip="Loading..." :spinning="loading">
        <div id="editorJson" class="json-editor" />
        <div
          :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '5px 10px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }"
        >
          <a-button icon="reload" type="dashed" style="marginRight: 8px" @click="refresh">
            {{ $t('base.refresh') }}
          </a-button>
          <a-button icon="copy" type="primary" class="copy-json-btn" style="marginRight: 8px">
            {{ $t('base.copy.json.code') }}
          </a-button>
          <a-button
            icon="cloud-download"
            type="primary"
            style="marginRight: 8px"
            @click="$refs.exportModal.onOpen('json')"
          >
            {{ $t('base.export.json.file') }}
          </a-button>
          <a-button icon="close" @click="onClose">
            {{ $t('base.close') }}
          </a-button>
        </div>
      </a-spin>
    </a-drawer>
    <export-modal ref="exportModal" @confirm="exportJsonFile" />
  </div>
</template>

<script>
import { beautifierConf } from '@/utils/index'
import ClipboardJS from 'clipboard'
import { saveAs } from 'file-saver'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'
import ExportModal from './ExportModal'

let beautifier
let monaco

export default {
  components: {
    ExportModal
  },
  props: {
  },
  data() {
    return {
      jsonStr: {},
      loading: true,
      jsonDrawerVisible: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    window.addEventListener('keydown', this.preventDefaultSave)
    const clipboard = new ClipboardJS('.copy-json-btn', {
      text: trigger => {
        this.$notification.success({
          message: this.$t('base.successfully'),
          description:
            this.$t('base.code.copy.successfully')
        })
        return this.beautifierJson
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
    onOpen(jsonStr) {
      const that = this
      this.jsonDrawerVisible = true
      loadBeautifier(btf => {
        beautifier = btf
        this.beautifierJson = beautifier.js(jsonStr, beautifierConf.js)
        loadMonaco(val => {
          monaco = val
          this.$nextTick(() => {
            this.setEditorValue('editorJson', this.beautifierJson)
            this.loading = false
          })
        })
      })
    },
    onClose() {
      this.jsonDrawerVisible = false
    },
    setEditorValue(id, codeStr) {
      if (this.jsonEditor) {
        this.jsonEditor.setValue(codeStr)
      } else {
        this.jsonEditor = monaco.editor.create(document.getElementById(id), {
          value: codeStr,
          theme: 'vs-dark',
          language: 'json',
          automaticLayout: true
        })
        // ctrl + s 刷新
        this.jsonEditor.onKeyDown(e => {
          if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
            this.refresh()
          }
        })
      }
    },
    exportJsonFile(fileName) {
      if (!fileName) fileName = `${+new Date()}.json`
      const codeStr = this.jsonEditor.getValue()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, fileName)
    },
    refresh() {
      try {
        this.$emit('refresh', JSON.parse(this.jsonEditor.getValue()))
      } catch (error) {
        this.$notification.error({
          message: this.$t('base.err'),
          description:
            this.$t('base.json.format.failed')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

@include action-bar;

.json-editor{
  height: 100vh;
}
</style>
