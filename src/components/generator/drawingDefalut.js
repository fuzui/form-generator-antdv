export default [
  {
    __config__: {
      label: '单行文本',
      showLabel: true,
      changeTag: true,
      tag: 'a-input',
      tagIcon: 'inputIcon',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://1x.antdv.com/components/input-cn/',
      // 正则校验规则
      regList: [{
        pattern: '/^1(3|4|5|7|8|9)\\d{9}$/',
        message: '手机号格式错误'
      }]
    },
    // 组件的插槽属性
    __slot__: {
      addonBefore: '',
      addonAfter: ''
    },
    __vModel__: 'mobile',
    placeholder: '请输入',
    style: { width: '100%' },
    allowClear: true,
    maxLength: null,
    disabled: false,
    size: 'default',
    prefix: '',
    suffix: ''
  }
]
