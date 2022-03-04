import { i18nRender } from '@/locales'
// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  layout: 'horizontal',
  labelAlign: 'right',
  labelCol: {
    span: 3,
    offset: 0
  },
  wrapperCol: {
    span: 21,
    offset: 0
  },
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  // span: 24,
  formBtns: true
}

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: 'tag.input.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-input',
      tagIcon: 'inputIcon',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'tag.input.document',
      // 正则校验规则
      regList: []
    },
    // 组件的插槽属性
    __slot__: {
      addonBefore: '',
      addonAfter: ''
    },
    // 其余的为可直接写在组件标签上的属性
    // 'default-value': 'aaaa',
    placeholder: 'base.enter',
    style: { width: '100%' },
    allowClear: true,
    maxLength: null,
    disabled: false,
    size: 'default',
    prefix: '',
    suffix: ''
  },
  {
    __config__: {
      label: 'tag.textarea.label',
      showLabel: true,
      tag: 'a-textarea',
      tagIcon: 'textareaIcon',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      changeTag: true,
      document: 'tag.textarea.document'
    },
    placeholder: 'base.enter',
    autoSize: {
      minRows: 4,
      maxRows: 4
    },
    defaultValue: '',
    style: { width: '100%' },
    allowClear: true,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.input.password.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-input-password',
      tagIcon: 'passwordIcon',
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      document: 'tag.input.password.document'
    },
    __slot__: {
      addonBefore: '',
      addonAfter: ''
    },
    placeholder: 'base.enter',
    style: { width: '100%' },
    size: 'default',
    defaultValue: '',
    allowClear: true,
    maxLength: null,
    disabled: false,
    prefix: '',
    suffix: ''
  },
  {
    __config__: {
      label: 'tag.input.number.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-input-number',
      tagIcon: 'numberIcon',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'tag.input.number.document'
    },
    style: { width: '100%' },
    size: 'default',
    placeholder: '',
    min: undefined,
    max: undefined,
    step: 1,
    precision: undefined,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.input.search.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-input-search',
      tagIcon: 'searchIcon',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'tag.input.search.document'
    },
    style: { width: '100%' },
    size: 'default',
    placeholder: '',
    'enter-button': false,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.auto.complete.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-auto-complete',
      tagIcon: 'autoIcon',
      defaultValue: undefined,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      document: 'tag.auto.complete.document'
    },
    style: { width: '100%' },
    size: 'default',
    'data-source': ['aaa', 'bbb'],
    'filter-option': true,
    backfill: false,
    'default-open': false,
    placeholder: 'base.enter',
    allowClear: true,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.mentions.label',
      showLabel: true,
      tag: 'a-mentions',
      tagIcon: 'mentionsIcon',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.mentions.document'
    },
    __slot__: {
      options: [{
        label: 'afc163',
        value: 'afc163'
      }, {
        label: 'zombieJ',
        value: 'zombieJ'
      }, {
        label: 'yesmeck',
        value: 'yesmeck'
      }]
    },
    placeholder: 'base.enter',
    style: { width: '100%' },
    placement: 'bottom',
    prefix: '@',
    split: ' ',
    allowClear: true,
    disabled: false
  }
]

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: 'tag.select.label',
      showLabel: true,
      tag: 'a-select',
      tagIcon: 'selectIcon',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.select.document'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    placeholder: 'base.choose',
    style: { width: '100%' },
    allowClear: true,
    disabled: false,
    showSearch: false,
    mode: 'default'
  },
  {
    __config__: {
      label: 'tag.cascader.label',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      tag: 'a-cascader',
      tagIcon: 'cascaderIcon',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'dynamic',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.cascader.document'
    },
    options: [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: 'base.choose',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children'
      }
    },
    'change-on-select': true,
    disabled: false,
    allowClear: true,
    showSearch: false,
    'expand-trigger': 'click'
  },
  {
    __config__: {
      label: 'tag.tree.select.label',
      url: 'https://www.fastmock.site/mock/f8d7a54fb1e60561e2f720d5a810009d/fg/cascaderList',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      tag: 'a-tree-select',
      tagIcon: 'treeIcon',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'dynamic',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.tree.select.document'
    },
    'tree-data': [{
      id: 1,
      value: 1,
      label: '选项1',
      children: [{
        id: 2,
        value: 2,
        label: '选项1-1'
      }]
    }],
    placeholder: 'base.choose',
    style: { width: '100%' },
    'replace-fields': {
      children: 'children',
      title: 'label',
      value: 'value',
      key: 'id'
    },
    disabled: false,
    allowClear: true,
    size: 'default',
    'label-in-value': false,
    'dropdown-matc-select-width': true,
    multiple: false,
    'tree-default-expand-all': false,
    'tree-checkable': false,
    'tree-check-strictly': false,
    showSearch: false
  },
  {
    __config__: {
      label: 'tag.transfer.label',
      showLabel: true,
      tag: 'a-transfer',
      tagIcon: 'transferIcon',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.transfer.document'
    },
    'data-source': [{
      key: 'afc163',
      title: 'afc163'
    }, {
      key: 'zombieJ',
      title: 'zombieJ'
    }, {
      key: 'yesmeck',
      title: 'yesmeck'
    }],
    showSearch: false,
    disabled: false,
    titles: ['Source', 'Target']
  },
  {
    __config__: {
      label: 'tag.radio.group.label',
      showLabel: true,
      tag: 'a-radio-group',
      tagIcon: 'radioIcon',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      required: true,
      document: 'tag.radio.group.document'
    },
    __slot__: {
      options: [{
        label: '选项一',
        value: 1
      }, {
        label: '选项二',
        value: 2
      }]
    },
    style: {},
    size: 'default',
    buttonStyle: 'outline',
    disabled: false
  },
  {
    __config__: {
      label: 'tag.checkbox.group.label',
      tag: 'a-checkbox-group',
      tagIcon: 'checkboxIcon',
      defaultValue: [],
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.checkbox.group.document'
    },
    __slot__: {
      options: [{
        label: 'Option1',
        value: 1
      }, {
        label: 'Option2',
        value: 2
      }]
    },
    style: {},
    min: null,
    max: null,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.switch.label',
      tag: 'a-switch',
      tagIcon: 'switchIcon',
      defaultValue: false,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.switch.document'
    },
    style: {},
    disabled: false,
    size: 'default',
    'checked-children': '',
    'un-checked-children': ''
  },
  {
    __config__: {
      label: 'tag.slider.label',
      tag: 'a-slider',
      tagIcon: 'sliderIcon',
      defaultValue: 0,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.slider.document'
    },
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    reverse: false,
    range: false
  },
  {
    __config__: {
      label: 'tag.rate.label',
      tag: 'a-rate',
      tagIcon: 'rateIcon',
      defaultValue: 0,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.rate.document'
    },
    style: {},
    count: 5,
    allowClear: true,
    'allow-half': false,
    character: undefined,
    disabled: false
  },
  {
    __config__: {
      label: 'tag.upload.label',
      tag: 'a-upload',
      tagIcon: 'uploadIcon',
      layout: 'colFormItem',
      defaultValue: null,
      showLabel: true,
      required: true,
      span: 24,
      showTip: false,
      buttonText: 'tag.upload.button.text',
      regList: [],
      changeTag: true,
      fileSize: 2,
      sizeUnit: 'MB',
      document: 'tag.upload.document'
    },
    __slot__: {
      'list-type': true
    },
    action: 'https://jsonplaceholder.typicode.com/posts/',
    disabled: false,
    accept: '',
    name: 'file',
    'list-type': 'text',
    multiple: false
  },
  {
    __config__: {
      label: 'tag.time.picker.label',
      tag: 'a-time-picker',
      tagIcon: 'timeIcon',
      defaultValue: null,
      span: 24,
      showLabel: true,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.time.picker.document'
    },
    placeholder: 'base.choose',
    style: { width: '100%' },
    disabled: false,
    allowClear: true,
    size: 'default',
    'use12-hours': false,
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss'
  },
  {
    __config__: {
      label: 'tag.date.picker.label',
      tag: 'a-date-picker',
      tagIcon: 'dateIcon',
      defaultValue: '2021-12-20',
      showLabel: true,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.date.picker.document'
    },
    placeholder: 'base.choose',
    style: { width: '100%' },
    disabled: false,
    'show-today': true,
    'show-time': true,
    allowClear: true,
    size: 'default',
    format: 'YYYY-MM-DD HH:mm:ss',
    'value-format': 'YYYY-MM-DD HH:mm:ss',
    'input-read-only': false
  },
  {
    __config__: {
      label: 'tag.month.picker.label',
      tag: 'a-month-picker',
      tagIcon: 'monthIcon',
      defaultValue: '2021-12-20',
      showLabel: true,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.month.picker.document'
    },
    placeholder: 'base.choose',
    style: { width: '100%' },
    disabled: false,
    allowClear: true,
    size: 'default',
    format: 'YYYY-MM',
    'value-format': 'YYYY-MM',
    'input-read-only': false
  },
  {
    __config__: {
      label: 'tag.week.picker.label',
      tag: 'a-week-picker',
      tagIcon: 'weekIcon',
      defaultValue: '',
      showLabel: true,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      changeTag: true,
      document: 'tag.week.picker.document'
    },
    placeholder: 'base.choose',
    style: { width: '100%' },
    disabled: false,
    allowClear: true,
    size: 'default',
    format: 'YYYY-ww',
    'value-format': 'YYYY-ww',
    'input-read-only': false
  },
  {
    __config__: {
      label: 'tag.range.picker.label',
      tag: 'a-range-picker',
      tagIcon: 'timeRangeIcon',
      defaultValue: null,
      showLabel: true,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      'start-placeholder': 'Start',
      'end-placeholder': 'End',
      changeTag: true,
      document: 'tag.range.picker.document'
    },
    placeholder: ['Start', 'End'],
    style: { width: '100%' },
    separator: '~',
    disabled: false,
    allowClear: true,
    size: 'default',
    format: 'YYYY-MM-DD HH:mm:ss',
    'show-time': true,
    'value-format': 'YYYY-MM-DD HH:mm:ss',
    'input-read-only': false
  }
]

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      span: 24,
      layout: 'rowFormItem',
      tagIcon: 'rowIcon',
      label: 'tag.row.label',
      layoutTree: true,
      document: 'tag.row.document'
    },
    type: 'default',
    justify: 'start',
    align: 'top'
  },
  {
    __config__: {
      label: 'tag.button.label',
      showLabel: true,
      changeTag: true,
      tag: 'a-button',
      tagIcon: 'buttonIcon',
      span: 24,
      layout: 'colFormItem',
      document: 'tag.button.document'
    },
    __slot__: {
      default: 'tag.button.slot.default'
    },
    type: 'default',
    icon: 'search',
    size: 'default',
    block: false,
    shape: undefined,
    disabled: false
  }
]
