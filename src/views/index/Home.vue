<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider
      :collapsed-width="0"
      :width="250"
      theme="light"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <div class="left-header">
        <img src="~@/assets/logo.png" alt="logo">
        <h3>Form Generator Antdv</h3>
      </div>
      <div class="left-main">
        <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
          <a-divider orientation="left">
            <a-icon type="control" />
            {{ $t(item.title) }}
          </a-divider>
          <draggable
            class="components-draggable"
            :list="item.list"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div
              v-for="(element, index) in item.list"
              :key="index"
              class="components-item"
              @click="addComponent(element)"
            >
              <div class="components-body">
                <a-icon :component="allIcon[element.__config__.tagIcon]" />
                {{ $t(element.__config__.label) }}
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '250px', marginRight: '350px' }">
      <a-layout-header class="center-header">
        <a-button icon="play-circle" type="link" size="small" @click="run">
          {{ $t('base.run') }}
        </a-button>
        <a-divider type="vertical" />
        <a-button icon="eye" type="link" size="small" @click="showJson">
          {{ $t('base.view.json') }}
        </a-button>
        <a-divider type="vertical" />
        <a-button icon="cloud-download" type="link" size="small" @click="download">
          {{ $t('base.export.vue.file') }}
        </a-button>
        <a-divider type="vertical" />
        <a-button icon="copy" size="small" type="link" @click="copy">
          {{ $t('base.copy.code') }}
        </a-button>
        <a-divider type="vertical" />
        <a-button icon="delete" size="small" type="link" @click="empty">
          {{ $t('base.empty') }}
        </a-button>
        <select-lang class="select-lang-trigger" />
      </a-layout-header>
      <div class="center-main">
        <a-layout-content>
          <a-row class="center-board-row">
            <a-form-model
              :label-align="formConf.labelAlign"
              :layout="formConf.layout"
              :label-col="formConf.layout === 'horizontal' ? formConf.labelCol : null"
              :wrapper-col="formConf.layout === 'horizontal' ? formConf.wrapperCol : null"
              :size="formConf.size"
              :disabled="formConf.disabled"
            >
              <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                <draggable-item
                  v-for="(item, index) in drawingList"
                  :key="item.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index"
                  :active-id="activeId"
                  :form-conf="formConf"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
                />
                <a-result v-show="!drawingList.length" :title="$t('base.left.drag')">
                  <template #icon>
                    <a-icon type="appstore" theme="twoTone" />
                  </template>
                  <template #extra />
                </a-result>
              </draggable>
            </a-form-model>
          </a-row>
        </a-layout-content>
        <a-layout-footer :style="{ textAlign: 'center' }">
          ©2022 <a href="https://github.com/fuzui/form-generator-antdv" target="_blank">Form Generator Antdv</a>
        </a-layout-footer>
      </div>
    </a-layout>
    <a-layout-sider
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', right: 0 }"
      :collapsed-width="0"
      :width="350"
      theme="light"
    >
      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="!!drawingList.length"
        @tag-change="tagChange"
        @fetch-data="fetchData"
      />
    </a-layout-sider>
    <form-drawer
      ref="formDrawer"
      :form-data="formData"
      size="100%"
      :generate-conf="generateConf"
    />
    <json-drawer
      ref="jsonDrawer"
      size="60%"
      @refresh="refreshJson"
    />
    <code-type-dialog
      ref="codeTypeDialog"
      @confirm="generate"
    />
    <input id="copyNode" type="hidden">
  </a-layout>
</template>
<script>
import allIcon from '@/core/icons'
import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import { saveAs } from 'file-saver'
import ClipboardJS from 'clipboard'
import render from '@/components/render/render'
import FormDrawer from './FormDrawer'
import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel'
import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config'
import {
  beautifierConf, stringify, titleCase, deepClone, isObjectObject
} from '@/utils/index'
import {
  makeUpHtml, vueTemplate, vueScript, cssStyle
} from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import drawingDefalut from '@/components/generator/drawingDefalut'
import logo from '@/assets/logo.png'
import CodeTypeDialog from './CodeTypeDialog'
import DraggableItem from './DraggableItem'
import { DRAWING_ITEMS, DRAWING_ID } from '@/store/mutation-types'
import loadBeautifier from '@/utils/loadBeautifier'
import SelectLang from '@/components/SelectLang'
import { baseMixin } from '@/store/app-mixin'

let beautifier
let oldActiveId
let tempActiveData

export default {
  components: {
    draggable,
    render,
    FormDrawer,
    JsonDrawer,
    RightPanel,
    CodeTypeDialog,
    DraggableItem,
    SelectLang
  },
  mixins: [baseMixin],
  data() {
    return {
      allIcon,
      collapsed: false,
      logo,
      inputComponents,
      selectComponents,
      layoutComponents,
      drawingList: drawingDefalut,
      drawingData: {},
      activeId: drawingDefalut[0].formId,
      formData: {},
      generateConf: null,
      activeData: drawingDefalut[0],
      leftComponents: [
        {
          title: 'base.input_components',
          list: inputComponents
        },
        {
          title: 'base.optional_components',
          list: selectComponents
        },
        {
          title: 'base.layout_components',
          list: layoutComponents
        }
      ]
    }
  },
  computed: {
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function (val, oldVal) {
      if (
        this.activeData.placeholder === undefined
        || !this.activeData.__config__.tag
        || oldActiveId !== this.activeId
        || this.activeData.__config__.tag !== 'a-range-picker'
      ) {
        return
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    drawingList: {
      handler(val) {
        debounce(340, this.$store.commit(DRAWING_ITEMS, val))
        if (val.length === 0) {
          debounce(340, this.$store.commit(DRAWING_ID, 100))
        }
      },
      deep: true
    }
  },
  mounted() {
    if (Array.isArray(this.drawingItems) && this.drawingItems.length > 0) {
      this.drawingList = this.drawingItems
    } else {
      this.drawingList = drawingDefalut
    }
    this.activeFormItem(this.drawingList[0])

    loadBeautifier(btf => {
      beautifier = btf
    })
    const clipboard = new ClipboardJS('#copyNode', {
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
  methods: {
    setObjectValueReduce(obj, strKeys, data) {
      const arr = strKeys.split('.')
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = data
        } else if (!isObjectObject(pre[item])) {
          pre[item] = {}
        }
        return pre[item]
      }, obj)
    },
    setRespData(component, resp) {
      const { dataPath, renderKey, dataConsumer } = component.__config__
      if (!dataPath || !dataConsumer) return
      const respData = dataPath.split('.').reduce((pre, item) => pre[item], resp)

      // 将请求回来的数据，赋值到指定属性。
      // 以el-tabel为例，根据Element文档，应该将数据赋值给el-tabel的data属性，所以dataConsumer的值应为'data';
      // 此时赋值代码可写成 component[dataConsumer] = respData；
      // 但为支持更深层级的赋值（如：dataConsumer的值为'options.data'）,使用setObjectValueReduce
      this.setObjectValueReduce(component, dataConsumer, respData)
      const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey)
      if (i > -1) this.$set(this.drawingList, i, component)
    },
    fetchData(component) {
      const { dataType, method, url } = component.__config__
      if (dataType === 'dynamic' && method && url) {
        this.setLoading(component, true)
        this.$axios({
          method,
          url
        }).then(resp => {
          this.setLoading(component, false)
          this.setRespData(component, resp.data)
        })
      }
    },
    setLoading(component, val) {
      const { directives } = component
      if (Array.isArray(directives)) {
        const t = directives.find(d => d.name === 'loading')
        if (t) t.value = val
      }
    },
    activeFormItem(currentItem) {
      this.activeData = currentItem
      this.activeId = currentItem.__config__.formId
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.fetchData(tempActiveData)
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item)
      this.fetchData(clone)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      const clone = deepClone(origin)
      // 组件国际化处理
      if (clone.__config__) {
        if (clone.__config__.label) {
          clone.__config__.label = this.$t(clone.__config__.label)
        }
        if (clone.__config__.document) {
          clone.__config__.document = this.$t(clone.__config__.document)
        }
      }
      if (clone.placeholder) {
        clone.placeholder = this.$t(clone.placeholder)
      }
      if (clone.__config__.tag === 'a-button') {
        clone.__slot__.default = this.$t(clone.__slot__.default)
      }
      if (clone.__config__.tag === 'a-upload') {
        clone.__config__.buttonText = this.$t(clone.__config__.buttonText)
      }
      const config = clone.__config__
      // config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone)
      if (clone.placeholder !== undefined && clone.__config__.tag !== 'a-range-picker') {
        clone.placeholder += config.label
      }
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      this.$store.commit(DRAWING_ID, this.idGlobal + 1)
      config.formId = this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${this.idGlobal}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`
        !Array.isArray(config.children) && (config.children = [])
        delete config.label // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem))
      }
      return item
    },
    AssembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`]
      this.generateConf = data
      func && func(data)
    },
    execRun(data) {
      this.AssembleFormData()
      this.$refs.formDrawer.onOpen(this.formData, this.generateConf)
    },
    execDownload(data) {
      const codeStr = this.generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, data.fileName)
    },
    execCopy(data) {
      document.getElementById('copyNode').click()
    },
    empty() {
      const that = this
      this.$confirm({
        title: that.$t('base.confirm.empty.components'),
        onOk() {
          that.drawingList = []
          that.idGlobal = 100
        }
      })
    },
    drawingItemCopy(item, list) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },
    drawingItemDelete(index, list) {
      list.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    generateCode() {
      const { type } = this.generateConf
      this.AssembleFormData()
      const script = vueScript(makeUpJs(this.formData, type))
      const html = vueTemplate(makeUpHtml(this.formData, type))
      const css = cssStyle(makeUpCss(this.formData))
      return beautifier.html(html + script + css, beautifierConf.html)
    },
    showJson() {
      this.AssembleFormData()
      this.$refs.jsonDrawer.onOpen(stringify(this.formData))
    },
    download() {
      this.$refs.codeTypeDialog.onOpen(true)
      this.operationType = 'download'
    },
    run() {
      this.$refs.codeTypeDialog.onOpen(false)
      this.operationType = 'run'
    },
    copy() {
      this.$refs.codeTypeDialog.onOpen(false)
      this.operationType = 'copy'
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
        })
      }
    },
    refreshJson(data) {
      this.drawingList = deepClone(data.fields)
      delete data.fields
      this.formConf = data
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/home';
</style>
