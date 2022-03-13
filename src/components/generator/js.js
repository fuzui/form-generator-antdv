import { isArray } from 'util'
import { exportDefault, titleCase, deepClone } from '@/utils/index'
import ruleTrigger from './ruleTrigger'
import { i18nRender } from '@/locales'

const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
const inheritAttrs = {
  file: '',
  modal: 'inheritAttrs: false,'
}

const visibleType = {
  file: '',
  modal: 'visible: false,'
}

/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
  confGlobal = formConfig = deepClone(formConfig)
  const dataList = []
  const ruleList = []
  const optionsList = []
  const treeDataList = []
  const dataSourceList = []
  const propsList = []
  const replaceFieldsList = []
  const methodList = mixinMethod(type)
  const uploadVarList = []
  const created = []

  formConfig.fields.forEach(el => {
    buildAttributes(el, dataList, ruleList, optionsList, treeDataList, dataSourceList,
      methodList, propsList, replaceFieldsList, uploadVarList, created)
  })

  const script = buildexport(
    formConfig,
    type,
    dataList.join('\n'),
    ruleList.join('\n'),
    optionsList.join('\n'),
    treeDataList.join('\n'),
    dataSourceList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    replaceFieldsList.join('\n'),
    methodList.join('\n'),
    created.join('\n')
  )
  confGlobal = null
  return script
}

// 构建组件属性
function buildAttributes(scheme, dataList, ruleList, optionsList, treeDataList,
  dataSourceList, methodList, propsList, replaceFieldsList, uploadVarList, created) {
  const config = scheme.__config__
  const slot = scheme.__slot__
  buildData(scheme, dataList)
  buildRules(scheme, ruleList)

  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList)
    if (config.dataType === 'dynamic') {
      const model = `${scheme.__vModel__}Options`
      const options = titleCase(model)
      const methodName = `get${options}`
      buildOptionMethod(methodName, model, methodList, scheme)
      callInCreated(methodName, created)
    }
  }

  if (config.tag === 'a-transfer') {
    const model = `${scheme.__vModel__}`
    const options = titleCase(`${model}TargetKeys`)
    const methodName = `change${options}`
    buildTargetMethod(methodName, `${confGlobal.formModel}.${model}`, methodList, scheme)
  }

  // 处理dataSource
  if (scheme['tree-data'] && config.tag === 'a-tree-select') {
    buildTreeData(scheme, treeDataList)
    if (config.dataType === 'dynamic') {
      const model = `${scheme.__vModel__}TreeData`
      const options = titleCase(model)
      const methodName = `get${options}`
      buildOptionMethod(methodName, model, methodList, scheme)
      callInCreated(methodName, created)
    }
  }

  // 处理dataSource
  if (scheme['data-source'] && (config.tag === 'a-auto-complete' || config.tag === 'a-transfer')) {
    buildDataSource(scheme, dataSourceList)
  }

  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList)
  }

  // 处理replaceFields
  if (scheme['replace-fields']) {
    buildReplaceFields(scheme, replaceFieldsList)
  }

  // 处理a-upload的action
  if (scheme.action && config.tag === 'a-upload') {
    uploadVarList.push(
      `${scheme.__vModel__}Action: '${scheme.action}',
      ${scheme.__vModel__}fileList: [],`
    )
    methodList.push(buildBeforeUpload(scheme))
  }

  // 构建子级组件属性
  if (config.children) {
    config.children.forEach(item => {
      buildAttributes(item, dataList, ruleList, optionsList, treeDataList,
        dataSourceList, methodList, propsList, replaceFieldsList, uploadVarList, created)
    })
  }
}

// 在Created调用函数
function callInCreated(methodName, created) {
  created.push(`this.${methodName}()`)
}

// 混入处理函数
function mixinMethod(type) {
  const list = []; const
    minxins = {
      file: confGlobal.formBtns ? {
        submitForm: `submitForm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
        })
      },`,
        resetForm: `resetForm() {
        this.$refs['${confGlobal.formRef}'].resetFields()
      },`
      } : null,
      modal: {
        onOpen: `onOpen() {
          this.visible = true
      },`,
        close: `close() {
        this.$refs['${confGlobal.formRef}'].resetFields()
        this.visible = false
      },`,
        handelConfirm: `handelConfirm() {
        this.$refs['${confGlobal.formRef}'].validate(valid => {
          if(!valid) return
          this.close()
        })
      },`
      }
    }

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

// 构建data
function buildData(scheme, dataList) {
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  const defaultValue = JSON.stringify(config.defaultValue)
  dataList.push(`${scheme.__vModel__}: ${defaultValue},`)
}

// 构建校验规则
function buildRules(scheme, ruleList) {
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = isArray(config.defaultValue) ? 'type: \'array\',' : ''
      let message = isArray(config.defaultValue)
        ? `${i18nRender('base.select.least.one')}${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}${i18nRender('base.not.null')}`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
    }
    if (config.regList && isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern != null) {
          rules.push(
            `{ pattern: ${eval(item.pattern)}, message: '${item.message}', trigger: '${ruleTrigger[config.tag]}' }`
          )
        }
      })
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(',')}],`)
  }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  // a-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  let { options } = scheme
  if (!options) options = scheme.__slot__.options
  if (scheme.__config__.dataType === 'dynamic') { options = [] }
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`
  optionsList.push(str)
}

// 构建treeData
function buildTreeData(scheme, treeDataList) {
  if (scheme.__vModel__ === undefined) return
  let treeData = scheme['tree-data']
  if (scheme.__config__.dataType === 'dynamic') { treeData = [] }
  const str = `${scheme.__vModel__}TreeData: ${JSON.stringify(treeData)},`
  treeDataList.push(str)
}

// 构建dataSource
function buildDataSource(scheme, dataSourceList) {
  if (scheme.__vModel__ === undefined) return
  // a-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  const dataSource = scheme['data-source']
  const str = `${scheme.__vModel__}DataSource: ${JSON.stringify(dataSource)},`
  dataSourceList.push(str)
}

function buildProps(scheme, propsList) {
  const str = `${scheme.__vModel__}Props: ${JSON.stringify(scheme.props.props)},`
  propsList.push(str)
}

function buildReplaceFields(scheme, replaceFieldsList) {
  const str = `${scheme.__vModel__}ReplaceFields: ${JSON.stringify(scheme['replace-fields'])},`
  replaceFieldsList.push(str)
}

// a-upload的BeforeUpload
function buildBeforeUpload(scheme) {
  const config = scheme.__config__
  const unitNum = units[config.sizeUnit]; let rightSizeCode = ''; let acceptCode = ''; const
    returnList = []
  if (config.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${config.fileSize}
    if(!isRightSize){
      this.$message.error('${i18nRender('base.file.size.overflow')} ${config.fileSize}${config.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (scheme.accept) {
    acceptCode = `let isAccept = new RegExp('${scheme.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('${i18nRender('base.file.should.choose.type')}${scheme.accept}')
    }`
    returnList.push('isAccept')
  }
  const str = `${scheme.__vModel__}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}

function buildOptionMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__
  const str = `${methodName}() {
    // Vue.prototype.$axios = axios
    this.$axios({
      method: '${config.method}',
      url: '${config.url}'
    }).then(resp => {
      var { data } = resp
      this.${model} = data.${config.dataPath}
    })
  },`
  methodList.push(str)
}

function buildTargetMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__
  const str = `${methodName}(nextTargetKeys, direction, moveKeys) {
    this.${model} = nextTargetKeys
  },`
  methodList.push(str)
}

// js整体拼接
function buildexport(conf, type, data, rules, selectOptions,
  treeDataList, dataSourceList, uploadVar, props, replaceFields, methods, created) {
  const str = `${exportDefault}{
  ${inheritAttrs[type]}
  components: {},
  props: [],
  data () {
    return {
      ${visibleType[type]}
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${uploadVar}
      ${selectOptions}
      ${treeDataList}
      ${dataSourceList}
      ${props}
      ${replaceFields}
    }
  },
  computed: {},
  watch: {},
  created () {
    ${created}
  },
  mounted () {},
  methods: {
    ${methods}
  }
}`
  return str
}
