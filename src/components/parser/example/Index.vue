<template>
  <div class="test-form">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="调查问卷">
        <parser :form-conf="formConf" @submit="sumbitForm1" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="提交问题" force-render>
        <parser :form-conf="formConf2" @submit="sumbitForm2" />
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="提示"
      :visible="visible"
      :footer="null"
      @cancel="close"
    >
      <p>该页面只是一个示例，不会收集到任何信息</p>
    </a-modal>
    <a-modal
      title="提示"
      :visible="visible2"
      :footer="null"
      @cancel="close"
    >
      <p>该页面只是一个示例，如有问题或者建议请点击以下提交Issue</p>
      <a href="https://github.com/fuzui/form-generator-antdv/issues" target="_blank">Github Issue</a>
      <a href="https://gitee.com/fuzui/form-generator-antdv/issues" target="_blank">Gitee Issue</a>
    </a-modal>
  </div>
</template>

<script>
import Parser from '../Parser'

// 若parser是通过安装npm方式集成到项目中的，使用此行引入
// import Parser from 'form-gen-parser'

export default {
  components: {
    Parser
  },
  props: {},
  data() {
    return {
      visible: false,
      visible2: false,
      key2: +new Date(),
      formConf: {
        fields: [{
          __config__: {
            label: '您的邮箱',
            showLabel: true,
            changeTag: true,
            tag: 'a-input',
            tagIcon: 'inputIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://1x.antdv.com/components/input-cn/',
            regList: [{
              pattern: '/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]'
                + '+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/',
              message: '请输入邮箱'
            }],
            formId: 101,
            renderKey: '1011644565966363'
          },
          __slot__: {
            addonBefore: '',
            addonAfter: 'mail'
          },
          placeholder: 'xx@gmail.com',
          style: {
            width: '100%'
          },
          allowClear: true,
          maxLength: null,
          disabled: false,
          size: 'default',
          prefix: '',
          suffix: '',
          __vModel__: 'field101'
        }, {
          __config__: {
            label: '您的别名',
            showLabel: true,
            changeTag: true,
            tag: 'a-input',
            tagIcon: 'inputIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://1x.antdv.com/components/input-cn/',
            regList: [],
            formId: 110,
            renderKey: '1101644568365576'
          },
          __slot__: {
            addonBefore: 'user',
            addonAfter: ''
          },
          placeholder: '张三',
          style: {
            width: '100%'
          },
          allowClear: true,
          maxLength: null,
          disabled: false,
          size: 'default',
          prefix: '',
          suffix: '',
          __vModel__: 'field110'
        }, {
          __config__: {
            label: '性别',
            showLabel: true,
            tag: 'a-radio-group',
            tagIcon: 'radioIcon',
            changeTag: true,
            defaultValue: 1,
            layout: 'colFormItem',
            span: 24,
            optionType: 'button',
            regList: [],
            required: true,
            document: 'https://1x.antdv.com/components/radio-cn/',
            formId: 112,
            renderKey: '1121644568483655'
          },
          __slot__: {
            options: [{
              label: '男',
              value: 1
            }, {
              label: '女',
              value: 2
            }]
          },
          style: {},
          size: 'default',
          buttonStyle: 'solid',
          disabled: false,
          __vModel__: 'field112'
        }, {
          __config__: {
            label: '身份',
            showLabel: true,
            tag: 'a-select',
            tagIcon: 'selectIcon',
            layout: 'colFormItem',
            span: 24,
            required: true,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/select-cn/',
            formId: 113,
            renderKey: '1131644568631414'
          },
          __slot__: {
            options: [{
              label: '老板',
              value: 1
            }, {
              label: '架构师',
              value: 2
            }, {
              label: '项目经理',
              value: 3
            }, {
              label: '测试',
              value: 4
            }, {
              label: '运维',
              value: 5
            }, {
              label: '程序员',
              value: 6
            }]
          },
          placeholder: '请选择职业',
          style: {
            width: '100%'
          },
          allowClear: true,
          disabled: false,
          showSearch: false,
          mode: 'default',
          __vModel__: 'field113'
        }, {
          __config__: {
            label: '通过什么方式得知该项目的',
            tag: 'a-checkbox-group',
            tagIcon: 'checkboxIcon',
            defaultValue: [],
            span: 24,
            showLabel: true,
            layout: 'colFormItem',
            required: true,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/checkbox-cn/',
            formId: 103,
            renderKey: '1031644566265011'
          },
          __slot__: {
            options: [{
              label: 'Github',
              value: 1
            }, {
              label: 'Gitee',
              value: 2
            }, {
              label: 'BLog',
              value: 3
            }, {
              label: '微信公众号',
              value: ''
            }, {
              label: '其他',
              value: ''
            }]
          },
          style: {},
          min: null,
          max: null,
          disabled: false,
          __vModel__: 'field103'
        }, {
          __config__: {
            label: '希望添加什么组件？',
            showLabel: true,
            tag: 'a-transfer',
            tagIcon: 'transferIcon',
            layout: 'colFormItem',
            span: 24,
            required: true,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/transfer-cn/',
            formId: 108,
            renderKey: '1081644566669092',
            defaultValue: ['Input', 'Textarea', 'Password', 'Number', 'Search', 'Complete', 'Mentions',
              'Select', 'Cascader', 'TreeSelect', 'Transfer', 'Radio', 'Checkbox', 'Switch', 'Slider', 'Rate',
              'Upload', 'TimePicker', 'DatePicker', 'MonthPicker', 'WeekPicker', 'RangePicker', 'Row',
              'Button'
            ]
          },
          'data-source': [{
            key: 'Input',
            title: '单行文本'
          }, {
            key: 'Textarea',
            title: '多行文本'
          }, {
            key: 'Password',
            title: '密码'
          }, {
            titel: '',
            key: 'Number',
            title: '数字'
          }, {
            titel: '',
            key: 'Search',
            title: '搜索'
          }, {
            titel: '',
            key: 'Complete',
            title: '自动完成'
          }, {
            titel: '',
            key: 'Mentions',
            title: '提及'
          }, {
            titel: '',
            key: 'Select',
            title: '下拉选择'
          }, {
            titel: '',
            key: 'Cascader',
            title: '级联选择'
          }, {
            titel: '',
            key: 'TreeSelect',
            title: '树选择'
          }, {
            titel: '',
            key: 'Transfer',
            title: '穿梭框'
          }, {
            titel: '',
            key: 'Radio',
            title: '单选框组'
          }, {
            titel: '',
            key: 'Checkbox',
            title: '多选框组'
          }, {
            titel: '',
            key: 'Switch',
            title: '开关'
          }, {
            titel: '',
            key: 'Slider',
            title: '滑块'
          }, {
            titel: '',
            key: 'Rate',
            title: '评分'
          }, {
            titel: '',
            key: 'Upload',
            title: '上传'
          }, {
            titel: '',
            key: 'TimePicker',
            title: '时间选择'
          }, {
            titel: '',
            key: 'DatePicker',
            title: '日期选择'
          }, {
            titel: '',
            key: 'MonthPicker',
            title: '月份选择'
          }, {
            titel: '',
            key: 'WeekPicker',
            title: '周选择'
          }, {
            titel: '',
            key: 'RangePicker',
            title: '日期反问'
          }, {
            titel: '',
            key: 'Row',
            title: '行容器'
          }, {
            titel: '',
            key: 'Button',
            title: '按钮'
          }, {
            titel: '',
            key: 'Layout',
            title: '布局'
          }, {
            titel: '',
            key: 'space',
            title: '间距'
          }, {
            titel: '',
            key: 'affix',
            title: '固钉'
          }, {
            titel: '',
            key: 'Breadcrumb',
            title: '面包屑'
          }, {
            titel: '',
            key: 'Dropdown',
            title: '下拉菜单'
          }, {
            titel: '',
            key: 'Menu',
            title: '导航菜单'
          }, {
            titel: '',
            key: 'PageHeader',
            title: '页头'
          }, {
            titel: '',
            key: 'Pagination',
            title: '分页'
          }, {
            titel: '',
            key: 'Steps',
            title: '步骤条'
          }, {
            titel: '',
            key: 'Divider',
            title: '分割线'
          }, {
            titel: '',
            key: 'BackTop',
            title: '回到顶部'
          }, {
            titel: '',
            key: 'Anchor',
            title: '锚点'
          }, {
            titel: '',
            key: 'Avatar',
            title: '头像'
          }, {
            titel: '',
            key: 'Badge',
            title: '徽标数'
          }, {
            titel: '',
            key: 'Calendar',
            title: '日历'
          }, {
            titel: '',
            key: 'Card',
            title: '卡片'
          }, {
            titel: '',
            key: 'Carousel',
            title: '走马灯'
          }, {
            titel: '',
            key: 'Collapse',
            title: '折叠面板'
          }, {
            titel: '',
            key: 'Comment',
            title: '评论'
          }],
          showSearch: false,
          disabled: false,
          titles: ['未开发', '已有组件'],
          __vModel__: 'field108',
          // render: 'function (item) {\n        return item.title;\n      }',
          'target-keys': ['Input', 'Textarea', 'Password', 'Number', 'Search', 'Complete', 'Mentions', 'Select',
            'Cascader', 'TreeSelect', 'Transfer', 'Radio', 'Checkbox', 'Switch', 'Slider', 'Rate', 'Upload',
            'TimePicker', 'DatePicker', 'MonthPicker', 'WeekPicker', 'RangePicker', 'Row', 'Button'
          ]
        }, {
          __config__: {
            label: '期待您的评分',
            tag: 'a-rate',
            tagIcon: 'rateIcon',
            defaultValue: 0,
            span: 24,
            showLabel: true,
            layout: 'colFormItem',
            required: true,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/rate-cn/',
            formId: 104,
            renderKey: '1041644566436153'
          },
          style: {},
          count: 5,
          allowClear: true,
          'allow-half': false,
          disabled: false,
          __vModel__: 'field104'
        }, {
          __config__: {
            label: '对Form Generator Antdv还有什么好的建议？',
            showLabel: true,
            tag: 'a-textarea',
            tagIcon: 'textareaIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/input-cn/',
            formId: 106,
            renderKey: '1061644566477736'
          },
          placeholder: '写下您宝贵的建议',
          autoSize: {
            minRows: 4,
            maxRows: 4
          },
          defaultValue: '',
          style: {
            width: '100%'
          },
          allowClear: true,
          disabled: false,
          __vModel__: 'field106'
        }, {
          __config__: {
            label: '匿名提交',
            tag: 'a-switch',
            tagIcon: 'switchIcon',
            defaultValue: false,
            span: 24,
            showLabel: true,
            layout: 'colFormItem',
            required: true,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/switch-cn/',
            formId: 109,
            renderKey: '1091644568341128'
          },
          style: {},
          disabled: false,
          size: 'default',
          'checked-children': '',
          'un-checked-children': '',
          __vModel__: 'field109'
        }],
        formRef: 'elForm2',
        formModel: 'formData',
        layout: 'vertical',
        labelAlign: 'left',
        labelCol: {
          span: '3',
          offset: '0'
        },
        wrapperCol: {
          span: '21',
          offset: 0
        },
        formRules: 'rules',
        disabled: false,
        formBtns: true,
        gutter: 12,
        unFocusedComponentBorder: false,
        span: 10
      },
      formConf2: {
        fields: [{
          __config__: {
            label: '标题',
            showLabel: false,
            changeTag: true,
            tag: 'a-input',
            tagIcon: 'inputIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://1x.antdv.com/components/input-cn/',
            regList: [],
            formId: 101,
            renderKey: '1011644576921706'
          },
          __slot__: {
            addonBefore: '',
            addonAfter: ''
          },
          placeholder: '标题',
          style: {
            width: '100%'
          },
          allowClear: true,
          maxLength: null,
          disabled: false,
          size: 'large',
          prefix: '',
          suffix: '',
          __vModel__: 'field101'
        }, {
          __config__: {
            label: '版本号',
            showLabel: true,
            changeTag: true,
            tag: 'a-input',
            tagIcon: 'inputIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            document: 'https://1x.antdv.com/components/input-cn/',
            regList: [],
            formId: 102,
            renderKey: '1021644577291927'
          },
          __slot__: {
            addonBefore: '',
            addonAfter: ''
          },
          placeholder: '1.0.0',
          style: {
            width: '100%'
          },
          allowClear: true,
          maxLength: null,
          disabled: false,
          size: 'default',
          prefix: '',
          suffix: '',
          __vModel__: 'field102'
        }, {
          __config__: {
            label: '环境',
            showLabel: true,
            tag: 'a-radio-group',
            tagIcon: 'radioIcon',
            changeTag: true,
            defaultValue: 1,
            layout: 'colFormItem',
            span: 24,
            optionType: 'button',
            regList: [],
            required: true,
            document: 'https://1x.antdv.com/components/radio-cn/',
            formId: 105,
            renderKey: '1051644577795282'
          },
          __slot__: {
            options: [{
              label: '线上',
              value: 1
            }, {
              label: '开发',
              value: 2
            }]
          },
          style: {},
          size: 'default',
          buttonStyle: 'outline',
          disabled: false,
          __vModel__: 'field105'
        }, {
          __config__: {
            label: '浏览器',
            showLabel: true,
            changeTag: true,
            tag: 'a-auto-complete',
            tagIcon: 'autoIcon',
            span: 24,
            layout: 'colFormItem',
            required: true,
            regList: [],
            document: 'https://1x.antdv.com/components/auto-complete-cn/',
            formId: 108,
            renderKey: '1081644577943800'
          },
          style: {
            width: '100%'
          },
          size: 'default',
          'data-source': ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera', 'Electron', 'IE'],
          'filter-option': true,
          backfill: false,
          'default-open': false,
          placeholder: '请填写或选择浏览器',
          allowClear: true,
          disabled: false,
          __vModel__: 'field108'
        }, {
          __config__: {
            label: '发生时间',
            tag: 'a-date-picker',
            tagIcon: 'dateIcon',
            defaultValue: null,
            showLabel: true,
            span: 24,
            layout: 'colFormItem',
            required: false,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/date-picker-cn/',
            formId: 110,
            renderKey: '1101644578161679'
          },
          placeholder: '问题发生时间',
          style: {
            width: '100%'
          },
          disabled: false,
          'show-today': true,
          'show-time': true,
          allowClear: true,
          size: 'default',
          format: 'YYYY-MM-DD HH:mm:ss',
          'value-format': 'YYYY-MM-DD HH:mm:ss',
          'input-read-only': false,
          __vModel__: 'field110'
        }, {
          __config__: {
            label: '详细信息',
            showLabel: true,
            tag: 'a-textarea',
            tagIcon: 'textareaIcon',
            required: true,
            layout: 'colFormItem',
            span: 24,
            regList: [],
            changeTag: true,
            document: 'https://1x.antdv.com/components/input-cn/',
            formId: 109,
            renderKey: '1091644578135152'
          },
          placeholder: '请简要说明问题',
          autoSize: {
            minRows: 4,
            maxRows: 4
          },
          defaultValue: '',
          style: {
            width: '100%'
          },
          allowClear: true,
          disabled: false,
          __vModel__: 'field109'
        }, {
          __config__: {
            label: '问题截图',
            tag: 'a-upload',
            tagIcon: 'uploadIcon',
            layout: 'colFormItem',
            defaultValue: null,
            showLabel: true,
            required: false,
            span: 24,
            showTip: false,
            buttonText: '点击上传',
            regList: [],
            changeTag: true,
            fileSize: 2,
            sizeUnit: 'MB',
            document: 'https://1x.antdv.com/components/upload-cn/',
            formId: 111,
            renderKey: '1111644578215325'
          },
          __slot__: {
            'list-type': true
          },
          action: 'https://jsonplaceholder.typicode.com/posts/',
          disabled: false,
          accept: 'image/*',
          name: 'file',
          'list-type': 'picture-card',
          multiple: true,
          __vModel__: 'field111'
        }, {
          __config__: {
            label: '联系邮箱',
            showLabel: true,
            changeTag: true,
            tag: 'a-input',
            tagIcon: 'inputIcon',
            required: false,
            layout: 'colFormItem',
            span: 24,
            document: 'https://1x.antdv.com/components/input-cn/',
            regList: [{
              pattern: '/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]'
                + '+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/',
              message: '请填写正确的邮箱'
            }],
            formId: 112,
            renderKey: '1121644578277823'
          },
          __slot__: {
            addonBefore: '',
            addonAfter: 'mail'
          },
          placeholder: 'xx@gmail.com',
          style: {
            width: '100%'
          },
          allowClear: true,
          maxLength: null,
          disabled: false,
          size: 'default',
          prefix: '',
          suffix: '',
          __vModel__: 'field112'
        }],
        formRef: 'elForm',
        formModel: 'formData',
        layout: 'vertical',
        labelAlign: 'left',
        labelCol: {
          span: '3',
          offset: '0'
        },
        wrapperCol: {
          span: '21',
          offset: 0
        },
        formRules: 'rules',
        disabled: false,
        formBtns: true,
        gutter: 12,
        unFocusedComponentBorder: false,
        span: 10
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    sumbitForm1(data) {
      console.log('sumbitForm1提交数据：', data)
      this.visible = true
    },
    sumbitForm2(data) {
      console.log('sumbitForm2提交数据：', data)
      this.visible2 = true
    },
    close() {
      this.visible = false
    },
    close2() {
      this.visible2 = false
    }
  }
}
</script>

<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}
</style>
