<script>
import draggable from 'vuedraggable'
import render from '@/components/render/render'

const components = {
  itemBtns(h, currentItem, index, list) {
    const { copyItem, deleteItem } = this.$listeners
    return [
      <span class="drawing-item-copy" title={this.$t('base.copy')} onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
        <a-icon type="copy" />
      </span>,
      <span class="drawing-item-delete" title={this.$t('base.remove')} onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
        <a-icon type="delete" />
      </span>
    ]
  }
}
const layouts = {
  colFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    // 穿梭框特殊处理
    if (config.tag === 'a-transfer') {
      this.$set(currentItem, 'render', item => item.title)
    }
    let className = this.activeId === config.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    return (
      <a-col span={config.span} class={className}
        nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
        <a-form-model-item
          label={config.showLabel ? config.label : ''}
          required={config.required}
        >
          <render key={config.renderKey} conf={currentItem} onInput={ event => {
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
              this.$set(currentItem, 'target-keys', value)
            }
          }}>
            {child}
          </render>
        </a-form-model-item>
        {components.itemBtns.apply(this, arguments)}
      </a-col>
    )
  },
  rowFormItem(h, currentItem, index, list) {
    const { activeItem } = this.$listeners
    const config = currentItem.__config__
    const className = this.activeId === config.formId
      ? 'drawing-row-item active-from-item'
      : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (currentItem.type === 'flex') {
      child = <a-row type={currentItem.type} justify={currentItem.justify} align={currentItem.align}>
              {child}
            </a-row>
    }
    return (
      <a-col span={config.span}>
        <a-row gutter={config.gutter} class={className}
          nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
          <span class="component-name">{config.componentName}</span>
          <draggable list={config.children || []} animation={340}
            group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </a-row>
      </a-col>
    )
  },
  raw(h, currentItem, index, list) {
    const config = currentItem.__config__
    const child = renderChildren.apply(this, arguments)
    return <render key={config.renderKey} conf={currentItem} onInput={ event => {
      this.$set(config, 'defaultValue', event)
    }}>
      {child}
    </render>
  }
}

function renderChildren(h, currentItem, index, list) {
  const config = currentItem.__config__
  if (!Array.isArray(config.children)) return null
  return config.children.map((el, i) => {
    const layout = layouts[el.__config__.layout]
    if (layout) {
      return layout.call(this, h, el, i, config.children)
    }
    return layoutIsNotFound.call(this)
  })
}

function layoutIsNotFound() {
  throw new Error(`${this.currentItem.__config__.layout}${this.$t('base.layout.format.failed')}`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'currentItem',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.currentItem.__config__.layout]
    if (layout) {
      return layout.call(this, h, this.currentItem, this.index, this.drawingList)
    }
    return layoutIsNotFound.call(this)
  }
}
</script>
