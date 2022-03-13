import ruleTrigger from './ruleTrigger'
import { titleCase } from '@/utils/index'
import { i18nRender } from '@/locales'

let confGlobal
let someSpanIsNot24

export function modalWrapper(str) {
  return `<div id="modal"><a-modal :visible="visible" get-container="#modal" @cancel="close" title="Form Titile">
    ${str}
    <div slot="footer">
      <a-button @click="close">${(i18nRender('base.close'))}</a-button>
      <a-button type="primary" @click="handelConfirm">${(i18nRender('base.ok'))}</a-button>
    </div>
  </a-modal></div>`
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate(scheme, child, type) {
  let labelCol = ''
  let wrapperCol = ''
  let labelAlign = ''
  if (scheme.labelCol && (!scheme.layout || scheme.layout === 'horizontal')) {
    labelCol = `:label-col="{ span: ${scheme.labelCol.span},
      offset: ${scheme.labelCol.offset ? scheme.labelCol.offset : 0} }" `
  }
  if (scheme.wrapperCol && (!scheme.layout || scheme.layout === 'horizontal')) {
    wrapperCol = `:wrapper-col="{ span: ${scheme.wrapperCol.span},
      offset: ${scheme.wrapperCol.offset ? scheme.wrapperCol.offset : 0} }"`
  }
  if (scheme.labelAlign && scheme.labelAlign !== 'right') {
    labelAlign = `label-align="${scheme.labelAlign}"`
  }
  let layout = ''
  if (scheme.layout) {
    layout = `layout="${scheme.layout}"`
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : ''
  let str = `<a-form-model
      ref="${scheme.formRef}"
      :model="${scheme.formModel}"
      :rules="${scheme.formRules}"
      ${labelCol}
      ${wrapperCol}
      ${disabled}
      ${layout}
      ${labelAlign}
    >
      ${child}
      ${buildFromBtns(scheme, type)}
    </a-form-model>`
  if (someSpanIsNot24) {
    str = `<a-row :gutter="${scheme.gutter}">
        ${str}
      </a-row>`
  }
  return str
}

function buildFromBtns(scheme, type) {
  let str = ''
  let wrapperCol = ''
  if (scheme.labelCol && scheme.wrapperCol && (!scheme.layout || scheme.layout === 'horizontal')) {
    wrapperCol = `:wrapper-col="{ span: ${scheme.wrapperCol.span}, offset: ${scheme.labelCol.span} }" `
  }
  if (scheme.formBtns && type === 'file') {
    str = `<a-form-model-item ${wrapperCol}>
          <a-space>
          <a-button type="primary" @click="submitForm">${(i18nRender('base.submit'))}</a-button>
          <a-button @click="resetForm">${(i18nRender('base.reset'))}</a-button>
          </a-space>
        </a-form-model-item>`
    if (someSpanIsNot24) {
      str = `<a-col :span="24">
          ${str}
        </a-col>`
    }
  }
  return str
}

// span不为24的用a-col包裹
function colWrapper(scheme, str) {
  if (someSpanIsNot24 || scheme.__config__.span !== 24) {
    return `<a-col :span="${scheme.__config__.span}">
      ${str}
    </a-col>`
  }
  return str
}

const layouts = {
  colFormItem(scheme) {
    const config = scheme.__config__
    let labelCol = ''
    let wrapperCol = ''
    let labelAlign = ''
    let label = `label="${config.label}"`
    if (config.labelCol && (!config.layout || scheme.layout === 'horizontal')) {
      labelCol = `:label-col="{ span: ${config.labelCol.span},
        offset: ${config.labelCol.offset ? config.labelCol.offset : 0} }" `
    }
    if (config.wrapperCol && (!config.layout || scheme.layout === 'horizontal')) {
      wrapperCol = `:wrapper-col="{ span: ${config.wrapperCol.span},
        offset: ${config.wrapperCol.offset ? config.wrapperCol.offset : 0} }"`
    }
    if (config.showLabel === false) {
      label = ''
    }
    if (config.labelAlign && config.labelAlign !== 'right') {
      labelAlign = `:label-align="${config.labelAlign}"`
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
    let str = `<a-form-model-item ${labelCol} ${wrapperCol} ${labelAlign} ${label}
      prop="${scheme.__vModel__}" ${required}>
        ${tagDom}
      </a-form-model-item>`
    str = colWrapper(scheme, str)
    return str
  },
  rowFormItem(scheme) {
    const config = scheme.__config__
    const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`
    const justify = scheme.type === 'default' ? '' : `justify="${scheme.justify}"`
    const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : ''
    const children = config.children.map(el => layouts[el.__config__.layout](el))
    let str = `<a-row ${type} ${justify} ${align} ${gutter}>
      ${children.join('\n')}
    </a-row>`
    str = colWrapper(scheme, str)
    return str
  }
}

const tags = {
  'a-button': el => {
    const {
      tag, disabled, size
    } = attrBuilder(el)
    const type = el.type ? `type="${el.type}"` : ''
    const icon = el.icon ? `icon="${el.icon}"` : ''
    const block = el.block ? 'block' : ''
    const shape = el.shape ? `shape="${el.shape}"` : ''
    let child = buildElButtonChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${type} ${icon} ${size} ${block} ${disabled} ${shape}>${child}</${tag}>`
  },
  'a-input': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)
    const maxLength = el.maxLength ? `:maxLength="${el.maxLength}"` : ''
    const prefix = el.prefix ? `prefix='${el.prefix}'` : ''
    const suffix = el.suffix ? `suffix='${el.suffix}'` : ''
    const type = el.type ? `type="${el.type}"` : ''
    const autoSize = el.autoSize && el.autoSize.minRows
      ? `:auto-size="{minRows: ${el.autoSize.minRows}, maxRows: ${el.autoSize.maxRows}}"`
      : ''
    let child = buildElInputChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${type} ${placeholder} ${maxLength} ${prefix} ${suffix} ${autoSize}
      ${width} ${allowClear} ${disabled}>${child}</${tag}>`
  },
  'a-textarea': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)
    const autoSize = el.autoSize && el.autoSize.minRows
      ? `:auto-size="{minRows: ${el.autoSize.minRows}, maxRows: ${el.autoSize.maxRows}}"`
      : ''
    return `<${tag} ${vModel} ${placeholder} ${autoSize} ${width} ${allowClear} ${disabled} />`
  },
  'a-input-password': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)
    const maxLength = el.maxLength ? `:maxLength="${el.maxLength}"` : ''
    const prefix = el.prefix ? `prefix='${el.prefix}'` : ''
    const suffix = el.suffix ? `suffix='${el.suffix}'` : ''
    let child = buildElInputPasswordChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${placeholder} ${maxLength} ${prefix} ${suffix} ${width}
      ${disabled} ${allowClear}>${child}</${tag}>`
  },
  'a-input-number': el => {
    const {
      tag, disabled, vModel, placeholder, width
    } = attrBuilder(el)
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step && el.step !== 1 ? `:step='${el.step}'` : ''
    const precision = el.precision ? `:precision='${el.precision}'` : ''

    return `<${tag} ${vModel} ${placeholder} ${step} ${precision} ${min} ${max} ${width} ${disabled} />`
  },
  'a-input-search': el => {
    const {
      tag, disabled, vModel, placeholder, width
    } = attrBuilder(el)
    const enterButton = el['enter-button'] ? 'enter-button' : ''

    return `<${tag} ${vModel} ${placeholder} ${width} ${enterButton} ${disabled} />`
  },
  'a-auto-complete': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder
    } = attrBuilder(el)
    const dataSource = el['data-source'] ? `:data-source="${el.__vModel__}DataSource"` : ''
    const filterOption = el['filter-option'] ? 'filter-option' : ''
    const backfill = el.backfill ? 'backfill' : ''
    const defaultOpen = el['default-open'] ? 'default-open' : ''
    return `<${tag} ${vModel} ${placeholder} ${dataSource} ${filterOption} ${backfill}
      ${defaultOpen} ${allowClear} ${disabled} />`
  },
  'a-mentions': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)

    const placement = el.placement !== 'bottom' ? `placement='${el.placement}'` : ''
    const prefix = el.prefix !== '@' ? `prefix='${el.prefix}'` : ''
    const split = el.split !== ' ' ? `split='${el.split}'` : ''
    let child = buildElMentionsChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${placeholder} ${placement} ${prefix} ${split}
      ${disabled} ${allowClear} ${width}>${child}</${tag}>`
  },
  'a-transfer': el => {
    const {
      tag, disabled
    } = attrBuilder(el)
    const showSearch = el.showSearch ? 'show-search' : ''
    const dataSource = el['data-source'] ? `:data-source="${el.__vModel__}DataSource"` : ''
    const render = ':render="item => item.title"'
    const targetKeys = `:target-keys="${confGlobal.formModel}.${el.__vModel__}"`
    const titles = el.titles ? `:titles="['${el.titles[0]}', '${el.titles[1]}']"` : ''
    const changeTargetKeys = `@change="change${titleCase(el.__vModel__)}TargetKeys"`
    return `<${tag} ${dataSource} ${render} ${targetKeys} ${titles} ${showSearch}
      ${disabled} ${changeTargetKeys} />`
  },
  'a-select': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)
    const showSearch = el.showSearch ? 'show-search' : ''
    const mode = el.mode === 'default' ? '' : `mode='${el.mode}'`
    let child = buildElSelectChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${mode} ${showSearch} ${allowClear} ${width}>${child}</${tag}>`
  },
  'a-radio-group': el => {
    const {
      tag, disabled, vModel, size
    } = attrBuilder(el)
    const buttonStyle = el.buttonStyle === 'outline' ? '' : `button-style="${el.buttonStyle}"`
    let child = buildElRadioGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${size} ${buttonStyle} ${disabled}>${child}</${tag}>`
  },
  'a-checkbox-group': el => {
    const { tag, disabled, vModel } = attrBuilder(el)
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    let child = buildElCheckboxGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${min} ${max} ${disabled}>${child}</${tag}>`
  },
  'a-switch': el => {
    const {
      tag, disabled, vModel, size
    } = attrBuilder(el)
    const checkedChildren = el['checked-children'] ? `checked-children="${el['checked-children']}"` : ''
    const unCheckedChildren = el['un-checked-children'] ? `un-checked-children="${el['un-checked-children']}"` : ''

    return `<${tag} ${vModel} ${checkedChildren} ${unCheckedChildren} ${size} ${disabled} />`
  },
  'a-cascader': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width
    } = attrBuilder(el)
    const options = el.options ? `:options="${el.__vModel__}Options"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const changeOnSelect = el['change-on-select'] ? 'change-on-select' : ''
    const showSearch = el.showSearch ? 'show-search' : ''
    const expandTrigger = el['expand-trigger'] === 'click' ? '' : `expand-trigger="${el['expand-trigger']}"`

    return `<${tag} ${vModel} ${options} ${props} ${width} ${changeOnSelect} ${placeholder}
      ${expandTrigger} ${showSearch} ${allowClear} ${disabled} />`
  },
  'a-tree-select': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width, size
    } = attrBuilder(el)
    const treeData = el['tree-data'] ? `:tree-data="${el.__vModel__}TreeData"` : ''
    const replaceFields = el['replace-fields'] ? `:replace-fields="${el.__vModel__}ReplaceFields"` : ''
    const showSearch = el.showSearch && !el.multiple ? 'show-search' : ''
    const dropdownMatchSelectWidth = el['dropdown-matc-select-width'] ? 'dropdown-matc-select-width' : ''
    // treeCheckStrictly会使得labelInValue强制为true
    const labelInValue = el['label-in-value'] && !el['tree-check-strictly'] ? 'label-in-value' : ''
    const treeDefaultExpandAll = el['tree-default-expand-all'] ? 'tree-default-expand-all' : ''
    const multiple = el.multiple && !el['tree-checkable'] ? 'multiple' : ''
    const treeCheckable = el['tree-checkable'] ? 'tree-checkable' : ''
    const treeCheckStrictly = el['tree-check-strictly'] && el['tree-checkable'] ? 'tree-check-strictly' : ''

    return `<${tag} ${vModel} ${treeData} ${replaceFields} ${width} ${size} ${placeholder}
      ${dropdownMatchSelectWidth} ${labelInValue} ${treeDefaultExpandAll} ${multiple} ${treeCheckable}
      ${treeCheckStrictly} ${showSearch} ${allowClear} ${disabled} />`
  },
  'a-slider': el => {
    const { tag, disabled, vModel } = attrBuilder(el)
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step && el.step !== 1 ? `:step='${el.step}'` : ''
    const range = el.range ? 'range' : ''
    const reverse = el.reverse ? 'reverse' : ''

    return `<${tag} ${min} ${max} ${step} ${vModel} ${range} ${reverse} ${disabled} />`
  },
  'a-time-picker': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width, size
    } = attrBuilder(el)
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const use12Hours = el['use12-hours'] ? 'use12-hours' : ''

    return `<${tag} ${vModel} ${format} ${valueFormat} ${use12Hours} ${width} ${size}
      ${placeholder} ${allowClear} ${disabled} />`
  },
  'a-date-picker': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width, size
    } = attrBuilder(el)
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const inputReadOnly = el['input-read-only'] ? 'input-read-only' : ''
    const showToday = el['show-today'] ? '' : `show-today="${el['show-today']}"`
    const showTime = el['show-time'] ? `show-time="${el['show-time']}"` : ''

    return `<${tag} ${vModel} ${format} ${valueFormat} ${showToday} ${showTime} ${width}
      ${size} ${placeholder} ${allowClear} ${inputReadOnly} ${disabled} />`
  },
  'a-month-picker': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width, size
    } = attrBuilder(el)
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const inputReadOnly = el['input-read-only'] ? 'input-read-only' : ''

    return `<${tag} ${vModel} ${format} ${valueFormat} ${width} ${size} ${placeholder}
      ${allowClear} ${inputReadOnly} ${disabled} />`
  },
  'a-week-picker': el => {
    const {
      tag, disabled, vModel, allowClear, placeholder, width, size
    } = attrBuilder(el)
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const inputReadOnly = el['input-read-only'] ? 'input-read-only' : ''

    return `<${tag} ${vModel} ${format} ${valueFormat} ${width} ${size} ${placeholder}
      ${allowClear} ${inputReadOnly} ${disabled} />`
  },
  'a-range-picker': el => {
    const {
      tag, disabled, vModel, allowClear, width, size
    } = attrBuilder(el)
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const inputReadOnly = el['input-read-only'] ? 'input-read-only' : ''
    const placeholders = (`${el.placeholder}`).split(',')
    const placeholder = el.placeholder ? `:placeholder="['${placeholders[0]}', '${placeholders[1]}']"` : ''
    const separator = el.separator === '~' ? '' : `separator="${el.separator}"`
    const showTime = el['show-time'] ? `show-time="${el['show-time']}"` : ''

    return `<${tag} ${vModel} ${format} ${valueFormat} ${separator} ${showTime}
      ${width} ${size} ${placeholder} ${allowClear} ${inputReadOnly} ${disabled} />`
  },
  'a-rate': el => {
    const {
      tag, disabled, allowClear, vModel
    } = attrBuilder(el)
    const count = el.count ? `:max='${el.count}'` : ''
    const allowHalf = el['allow-half'] ? 'allow-half' : ''
    const character = el.character ? `character="${el.character}"` : ''

    return `<${tag} ${vModel} ${count} ${allowHalf} ${character} ${allowClear} ${disabled} />`
  },
  'a-upload': el => {
    const { tag } = el.__config__
    const disabled = el.disabled ? ':disabled=\'true\'' : ''
    const action = el.action ? `:action="${el.__vModel__}Action"` : ''
    const multiple = el.multiple ? 'multiple' : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const name = el.name !== 'file' ? `name="${el.name}"` : ''
    const beforeUpload = `:before-upload="${el.__vModel__}BeforeUpload"`
    const fileList = `:file-list="${el.__vModel__}fileList"`
    const ref = `ref="${el.__vModel__}"`
    let child = buildElUploadChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${ref} ${fileList} ${action} ${multiple} ${beforeUpload}
      ${listType} ${accept} ${name} ${disabled}>${child}</${tag}>`
  }
}

function attrBuilder(el) {
  return {
    tag: el.__config__.tag,
    vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
    allowClear: el.allowClear ? 'allow-clear' : '',
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: '${el.style.width}'}"` : '',
    disabled: el.disabled ? ':disabled=\'true\'' : '',
    size: el.size === 'default' ? '' : `size="${el.size}"`
  }
}

// a-buttin 子级
function buildElButtonChild(scheme) {
  const children = []
  const slot = scheme.__slot__ || {}
  if (slot.default) {
    children.push(slot.default)
  }
  return children.join('\n')
}

// a-input 子级
function buildElInputChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.addonBefore) {
    children.push(`<template slot="addonBefore"><a-icon type=${slot.addonBefore} /></template>`)
  }
  if (slot && slot.addonAfter) {
    children.push(`<template slot="addonAfter"><a-icon type=${slot.addonAfter} /></template>`)
  }
  return children.join('\n')
}

// a-input-password 子级
function buildElInputPasswordChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.addonBefore) {
    children.push(`<template slot="addonBefore"><a-icon type=${slot.addonBefore} /></template>`)
  }
  if (slot && slot.addonAfter) {
    children.push(`<template slot="addonAfter"><a-icon type=${slot.addonAfter} /></template>`)
  }
  return children.join('\n')
}

// a-select 子级
function buildElSelectChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    children.push(`<a-select-option v-for="(item, index) in ${scheme.__vModel__}Options"
      :key="index" :value="item.value" :disabled="item.disabled">{{item.label}}</a-select-option>`)
  }
  return children.join('\n')
}

// a-mentions 子级
function buildElMentionsChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    children.push(`<a-mentions-option v-for="(item, index) in ${scheme.__vModel__}Options"
      :key="index" :value="item.value">{{item.label}}</a-mentions-option>`)
  }
  return children.join('\n')
}

// a-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === 'button' ? 'a-radio-button' : 'a-radio'
    const buttonStyle = scheme.buttonStyle === 'outline' ? '' : `button-style = ${scheme.buttonStyle}`
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options"
      :key="index" :value="item.value" :disabled="item.disabled" ${buttonStyle}>{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

// a-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options && slot.options.length) {
    children.push(`<a-checkbox v-for="(item, index) in ${scheme.__vModel__}Options"
      :key="index" :value="item.value" :disabled="item.disabled">{{item.label}}</a-checkbox>`)
  }
  return children.join('\n')
}

// a-upload 子级
function buildElUploadChild(scheme) {
  const list = []
  const config = scheme.__config__
  if (scheme['list-type'] === 'picture-card') {
    list.push(`<div><a-icon type="plus" /><div class="ant-upload-text">${config.buttonText}</div></div>`)
  } else {
    list.push(`<a-button> <a-icon type="upload" /> ${config.buttonText}</a-button>`)
  }
  return list.join('\n')
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig, type) {
  const htmlList = []
  confGlobal = formConfig
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(item => item.__config__.span !== 24)
  // 遍历渲染每个组件成html
  formConfig.fields.forEach(el => {
    htmlList.push(layouts[el.__config__.layout](el))
  })
  const htmlStr = htmlList.join('\n')
  // 将组件代码放进form标签
  let temp = buildFormTemplate(formConfig, htmlStr, type)
  // modal标签包裹代码
  if (type === 'modal') {
    temp = modalWrapper(temp)
  }
  confGlobal = null
  return temp
}
