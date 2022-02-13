<script>
import { deepClone } from '@/utils/index'
import render from '@/components/render/render.js'
import { i18nRender } from '@/locales'

const ruleTrigger = {
  'a-input': 'blur',
  'a-textarea': 'blur',
  'a-input-number': 'blur',
  'a-input-password': 'blur',
  'a-input-search': 'blur',
  'a-auto-complete': 'blur',
  'a-mentions': 'blur',
  'a-select': 'change',
  'a-switch': 'change',
  'a-slider': 'change',
  'a-radio-group': 'change',
  'a-checkbox-group': 'change',
  'a-cascader': 'change',
  'a-tree-select': 'change',
  'a-time-picker': 'change',
  'a-date-picker': 'change',
  'a-week-picker': 'change',
  'a-month-picker': 'change',
  'a-range-picker': 'change',
  'a-rate': 'change'
}

const layouts = {
  colFormItem(h, scheme) {
    const config = scheme.__config__
    // 穿梭框特殊处理
    if (config.tag === 'a-transfer') {
      this.$set(scheme, 'render', item => item.title)
    }
    const listeners = buildListeners.call(this, scheme)
    return (
      <a-form-model-item prop={scheme.__vModel__}
        label={config.showLabel ? config.label : ''}>
        <render conf={scheme} on={listeners} />
      </a-form-model-item>
    )
  },
  rowFormItem(h, scheme) {
    let child = renderChildren.apply(this, arguments)
    if (scheme.type === 'flex') {
      child = <a-row type={scheme.type} justify={scheme.justify} align={scheme.align}>
              {child}
            </a-row>
    }
    return (
      <a-col span={scheme.span}>
        <a-row gutter={scheme.gutter}>
          {child}
        </a-row>
      </a-col>
    )
  }
}

function renderFrom(h) {
  const { formConfCopy } = this

  return (
    <a-form-model
      size='1'
      layout={formConfCopy.layout}
      disabled={formConfCopy.disabled}
      label-col={formConfCopy.layout === 'horizontal' ? formConfCopy.labelCol : null}
      wrapper-col={formConfCopy.layout === 'horizontal' ? formConfCopy.wrapperCol : null}
      size={formConfCopy.size}
      ref={formConfCopy.formRef}
      // model不能直接赋值 https://github.com/vuejs/jsx/issues/49#issuecomment-472013664
      props={{ model: this[formConfCopy.formModel] }}
      rules={this[formConfCopy.formRules]}
    >
      {renderFormItem.call(this, h, formConfCopy.fields)}
      {formConfCopy.formBtns && formBtns.call(this, h)}
    </a-form-model>
  )
}

function formBtns(h) {
  return <a-col>
    <a-form-model-item size="large">
      <a-space>
        <a-button type="primary" onClick={this.submitForm}>{i18nRender('base.submit')}</a-button>
        <a-button onClick={this.resetForm}>{i18nRender('base.reset')}</a-button>
      </a-space>
    </a-form-model-item>
  </a-col>
}

function renderFormItem(h, elementList) {
  return elementList.map(scheme => {
    const config = scheme.__config__
    const layout = layouts[config.layout]

    if (layout) {
      return layout.call(this, h, scheme)
    }
    throw new Error(`${config.layout}${i18nRender('base.layout.format.failed')}`)
  })
}

function renderChildren(h, scheme) {
  const config = scheme.__config__
  if (!Array.isArray(config.children)) return null
  return renderFormItem.call(this, h, config.children)
}

function setValue(event, config, scheme) {
  let value = event
  if (config.tag === 'a-input'
    || config.tag === 'a-textarea'
    || config.tag === 'a-input-password'
    || config.tag === 'a-input-search'
    || config.tag === 'a-radio-group') {
    value = event.target.value
  }
  this.$set(config, 'defaultValue', value)
  // 穿梭框特殊处理
  if (config.tag === 'a-transfer') {
    this.$set(scheme, 'target-keys', value)
  }
  // this.$set(config, 'defaultValue', event)
  this.$set(this[this.formConf.formModel], scheme.__vModel__, value)
}

function buildListeners(scheme) {
  const config = scheme.__config__
  const methods = this.formConf.__methods__ || {}
  const listeners = {}

  // 给__methods__中的方法绑定this和event
  Object.keys(methods).forEach(key => {
    listeners[key] = event => methods[key].call(this, event)
  })
  // 响应 render.js 中的 vModel $emit('input', val)
  listeners.input = event => setValue.call(this, event, config, scheme)

  return listeners
}

export default {
  components: {
    render
  },
  props: {
    formConf: {
      type: Object,
      required: true
    }
  },
  data() {
    const data = {
      formConfCopy: deepClone(this.formConf),
      [this.formConf.formModel]: {},
      [this.formConf.formRules]: {}
    }
    this.initFormData(data.formConfCopy.fields, data[this.formConf.formModel])
    this.buildRules(data.formConfCopy.fields, data[this.formConf.formRules])
    return data
  },
  methods: {
    initFormData(componentList, formData) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (cur.__vModel__) formData[cur.__vModel__] = config.defaultValue
        if (config.children) this.initFormData(config.children, formData)
      })
    },
    buildRules(componentList, rules) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (Array.isArray(config.regList)) {
          if (config.required) {
            const required = { required: config.required, message: cur.placeholder }
            if (Array.isArray(config.defaultValue)) {
              required.type = 'array'
              required.message = `${this.$t('base.select.least.one')}${config.label}`
            }
            required.message === undefined && (required.message = `${config.label}${this.$t('base.not.null')}`)
            config.regList.push(required)
          }
          rules[cur.__vModel__] = config.regList.map(item => {
            item.pattern && (item.pattern = eval(item.pattern))
            item.trigger = ruleTrigger && ruleTrigger[config.tag]
            return item
          })
        }
        if (config.children) this.buildRules(config.children, rules)
      })
    },
    resetForm() {
      this.formConfCopy = deepClone(this.formConf)
      this.$refs[this.formConf.formRef].resetFields()
    },
    submitForm() {
      this.$refs[this.formConf.formRef].validate(valid => {
        if (!valid) return false
        // 触发sumit事件
        this.$emit('submit', this[this.formConf.formModel])
        return true
      })
    }
  },
  render(h) {
    return renderFrom.call(this, h)
  }
}
</script>
