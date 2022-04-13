<template>
  <div>
    <a-tabs v-model="currentTab" class="right-header">
      <a-tab-pane key="field" :tab="$t('base.component.properties')" />
      <a-tab-pane key="form" :tab="$t('base.form.properties')" />
    </a-tabs>
    <div class="right-main">
      <!-- 组件属性 -->
      <a-form-model v-show="currentTab==='field' && showField" size="small" label-width="90px">
        <a-form-model-item v-if="activeData.__config__.changeTag" :label="$t('base.component.type')">
          <a-select
            v-model="activeData.__config__.tagIcon"
            :placeholder="$t('base.choose') + $t('base.component.type')"
            :style="{width: '100%'}"
            @change="tagChange"
          >
            <a-select-opt-group v-for="group in tagList" :key="group.label" :label="group.label">
              <a-select-option
                v-for="item in group.options"
                :key="item.__config__.label"
                :value="item.__config__.tagIcon"
              >
                <a-icon :component="allIcon[item.__config__.tagIcon]" />
                <span> {{ $t(item.__config__.label) }}</span>
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__vModel__!==undefined" :label="$t('base.field.name')">
          <a-input
            v-model="activeData.__vModel__"
            :placeholder="`${$t('base.enter')}${$t('base.field.name')} (v-model)`"
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.componentName!==undefined" :label="$t('base.component.name')">
          {{ activeData.__config__.componentName }}
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.label!==undefined" :label="$t('base.title')">
          <a-input
            v-model="activeData.__config__.label"
            :placeholder="`${$t('base.enter')}${$t('base.title')}`"
            @input="changeRenderKey"
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-transfer'" :label="$t('base.top.title')">
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="12">
                <a-input v-model="activeData.titles[0]" :placeholder="$t('base.source.title')" />
              </a-col>
              <a-col :span="12">
                <a-input v-model="activeData.titles[1]" :placeholder="$t('base.target.title')" />
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.placeholder!==undefined && activeData.__config__.tag!=='a-range-picker'"
          :label="$t('base.placeholder')"
        >
          <a-input
            v-model="activeData.placeholder"
            :placeholder="`${$t('base.enter')}${$t('base.placeholder')}`"
            @input="changeRenderKey"
          />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__['start-placeholder']!==undefined"
          :label="$t('base.start.placeholder')"
        >
          <a-input
            v-model="activeData.__config__['start-placeholder']"
            :placeholder="`${$t('base.enter')}${$t('base.placeholder')}`"
            @change="changeStartPlaceholder"
          />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__['end-placeholder']!==undefined"
          :label="$t('base.end.placeholder')"
        >
          <a-input
            v-model="activeData.__config__['end-placeholder']"
            :placeholder="`${$t('base.enter')}${$t('base.placeholder')}`"
            @change="changeEndPlaceholder"
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.span!==undefined" :label="$t('base.form.grid')">
          <a-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined"
          :label="$t('base.grid.space')"
        >
          <a-input-number v-model="activeData.gutter" :min="0" :placeholder="$t('base.grid.space')" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined"
          :label="$t('base.layout.model')"
        >
          <a-radio-group v-model="activeData.type" button-style="solid">
            <a-radio-button value="default">
              default
            </a-radio-button>
            <a-radio-button value="flex">
              flex
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.justify!==undefined&&activeData.type==='flex'"
          :label="$t('base.horizontal.arrangement')"
        >
          <a-select
            v-model="activeData.justify"
            :placeholder="`${$t('base.choose')}${$t('base.horizontal.arrangement')}`"
            :style="{width: '100%'}"
          >
            <a-select-option
              v-for="(item, index) in justifyOptions"
              :key="index"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.align!==undefined&&activeData.type==='flex'"
          :label="$t('base.vertical.arrangement')"
        >
          <a-radio-group v-model="activeData.align" button-style="solid">
            <a-radio-button value="top">
              top
            </a-radio-button>
            <a-radio-button value="middle">
              middle
            </a-radio-button>
            <a-radio-button value="bottom">
              bottom
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.style&&activeData.style.width!==undefined"
          :label="$t('base.component.width')"
        >
          <a-input
            v-model="activeData.style.width"
            :placeholder="`${$t('base.enter')}${$t('base.component.width')}`"
            allow-clear
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__vModel__!==undefined" :label="$t('base.default.value')">
          <a-input
            :value="setDefaultValue(activeData.__config__.defaultValue)"
            :placeholder="`${$t('base.enter')}${$t('base.default.value')}`"
            @input="onDefaultValueInput"
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['prefix']!==undefined" :label="$t('base.prefix')">
          <a-input v-model="activeData['prefix']" :placeholder="$t('base.prefix')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['suffix']!==undefined" :label="$t('base.suffix')">
          <a-input v-model="activeData['suffix']" :placeholder="$t('base.suffix')" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__slot__&&activeData.__slot__.addonBefore!==undefined"
          :label="$t('base.icon.before')"
        >
          <a-space size="large">
            <a-icon v-if="activeData.__slot__.addonBefore" :type="activeData.__slot__.addonBefore" />
            <a-button type="dashed" @click="openIconsModal('addonBefore', true)">
              {{ $t('base.icon.choose') }}
            </a-button>
            <a-button
              v-if="activeData.__slot__.addonBefore && activeData.__slot__.addonBefore !== ''"
              type="dashed"
              @click="() => activeData.__slot__.addonBefore = ''"
            >
              {{ $t('base.empty') }}
            </a-button>
          </a-space>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__slot__&&activeData.__slot__.addonAfter!==undefined"
          :label="$t('base.icon.after')"
        >
          <a-space size="large">
            <a-icon v-if="activeData.__slot__.addonAfter" :type="activeData.__slot__.addonAfter" />
            <a-button type="dashed" @click="openIconsModal('addonAfter', true)">
              {{ $t('base.icon.choose') }}
            </a-button>
            <a-button
              v-if="activeData.__slot__.addonAfter && activeData.__slot__.addonAfter !== ''"
              type="dashed"
              @click="() => activeData.__slot__.addonAfter = ''"
            >
              {{ $t('base.empty') }}
            </a-button>
          </a-space>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'a-button'"
          :label="$t('base.button.icon')"
        >
          <a-space size="large">
            <a-icon :type="activeData['icon']" />
            <a-button type="dashed" @click="openIconsModal('icon', false)">
              {{ $t('base.icon.choose') }}
            </a-button>
            <a-button
              v-if="activeData['icon'] && activeData['icon'] !== ''"
              type="dashed"
              @click="() => activeData['icon'] = ''"
            >
              {{ $t('base.empty') }}
            </a-button>
          </a-space>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-cascader'" :label="$t('base.separator')">
          <a-input v-model="activeData.separator" :placeholder="$t('base.separator')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.autoSize !== undefined" :label="$t('base.min.row')">
          <a-input-number v-model="activeData.autoSize.minRows" :min="1" placeholder="$t('base.min.row')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.autoSize !== undefined" :label="$t('base.max.row')">
          <a-input-number v-model="activeData.autoSize.maxRows" :min="1" :placeholder="$t('base.max.row')" />
        </a-form-model-item>
        <a-form-model-item v-if="isShowMin" :label="$t('base.min')">
          <a-input-number v-model="activeData.min" :placeholder="$t('base.min')" />
        </a-form-model-item>
        <a-form-model-item v-if="isShowMax" :label="$t('base.max')">
          <a-input-number v-model="activeData.max" :placeholder="$t('base.max')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.count !== undefined" :label="$t('base.total')">
          <a-input-number v-model="activeData.count" :placeholder="$t('base.total')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.height!==undefined" :label="$t('base.component.height')">
          <a-input-number
            v-model="activeData.height"
            :placeholder="$t('base.component.height')"
            @input="changeRenderKey"
          />
        </a-form-model-item>
        <a-form-model-item v-if="isShowStep" :label="$t('base.step')">
          <a-input-number v-model="activeData.step" :placeholder="$t('base.step')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.maxLength !== undefined" :label="$t('base.most.enter')">
          <a-input v-model="activeData.maxLength" :placeholder="$t('base.maxlength')">
            <template slot="append">
              {{ $t('base.most.enter.after') }}
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item v-if="activeData['checked-children'] !== undefined" :label="$t('base.checked')">
          <a-input v-model="activeData['checked-children']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['un-checked-children'] !== undefined" :label="$t('base.unchecked')">
          <a-input v-model="activeData['un-checked-children']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.name !== undefined" :label="$t('base.file.field.name')">
          <a-input v-model="activeData.name" :placeholder="$t('base.file.field.name')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.accept !== undefined" :label="$t('base.file.type')">
          <a-select
            v-model="activeData.accept"
            :placeholder="$t('base.choose')"
            :style="{ width: '100%' }"
            allow-clear
          >
            <a-select-option value="image/*">
              {{ $t('base.image') }}
            </a-select-option>
            <a-select-option value="video/*">
              {{ $t('base.video') }}
            </a-select-option>
            <a-select-option value="audio/*">
              {{ $t('base.audio') }}
            </a-select-option>
            <a-select-option value=".xls,.xlsx">
              excel
            </a-select-option>
            <a-select-option value=".doc,.docx">
              word
            </a-select-option>
            <a-select-option value=".pdf">
              pdf
            </a-select-option>
            <a-select-option value=".txt">
              txt
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.fileSize !== undefined" :label="$t('base.file.size')">
          <a-input v-model.number="activeData.__config__.fileSize" :placeholder="$t('base.enter')">
            <a-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
              <a-select-option value="KB">
                KB
              </a-select-option>
              <a-select-option value="MB">
                MB
              </a-select-option>
              <a-select-option value="GB">
                GB
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.action !== undefined" :label="$t('base.upload.url')">
          <a-input v-model="activeData.action" :placeholder="$t('base.enter')" allow-clear />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['list-type'] !== undefined" :label="$t('base.list.type')">
          <a-radio-group v-model="activeData['list-type']" button-style="solid">
            <a-radio-button value="text">
              text
            </a-radio-button>
            <a-radio-button value="picture">
              picture
            </a-radio-button>
            <a-radio-button value="picture-card">
              picture-card
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.type !== undefined && activeData.__config__.tag === 'a-button'"
          :label="$t('base.button.type')"
        >
          <a-select v-model="activeData.type" :style="{ width: '100%' }">
            <a-select-option value="default">
              default
            </a-select-option>
            <a-select-option value="primary">
              primary
            </a-select-option>
            <a-select-option value="dashed">
              dashed
            </a-select-option>
            <a-select-option value="danger">
              danger
            </a-select-option>
            <a-select-option value="link">
              link
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-button'"
          :label="$t('base.button.shape')"
        >
          <a-select v-model="activeData.shape" :style="{ width: '100%' }" allow-clear>
            <a-select-option value="circle">
              circle
            </a-select-option>
            <a-select-option value="round">
              round
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-button'" :label="$t('base.button.block')">
          <a-switch v-model="activeData.block" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.buttonText !== undefined"
          v-show="'picture-card' !== activeData['list-type']"
          :label="$t('base.button.text')"
        >
          <a-input v-model="activeData.__config__.buttonText" :placeholder="$t('base.enter')" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-button'"
          :label="$t('base.button.text')"
        >
          <a-input v-model="activeData.__slot__.default" :placeholder="$t('base.enter')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.separator !== undefined" :label="$t('base.separator')">
          <a-input v-model="activeData.separator" :placeholder="$t('base.separator')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['show-time']!==undefined" :label="$t('base.time.choose')">
          <a-switch v-model="activeData['show-time']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['show-today'] !== undefined" :label="$t('base.show.today')">
          <a-switch v-model="activeData['show-today']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['use12-hours'] !== undefined" :label="$t('base.use12.hours')">
          <a-switch v-model="activeData['use12-hours']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.format !== undefined" :label="$t('base.time.format')">
          <a-input
            :value="activeData.format"
            :placeholder="$t('base.enter')"
            @input="setTimeValue($event)"
          />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['enter-button'] !== undefined" :label="$t('base.button.style')">
          <a-switch v-model="activeData['enter-button']" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-auto-complete'"
          :label="$t('base.datasource')"
        >
          <template v-for="(tag) in activeData['data-source']">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag :key="tag" :closable="true" @close="() => handleAutoDataSourceClose(tag)">
                {{ `${tag.slice(0, 20)}...` }}
              </a-tag>
            </a-tooltip>
            <a-tag v-else :key="tag" :closable="true" @close="() => handleAutoDataSourceClose(tag)">
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="inputAutoDataSourceVisible"
            ref="inputAutoDataSource"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            :value="inputAutoDataSourceValue"
            @change="handleInputAutoDataSourceChange"
            @blur="handleInputAutoDataSourceConfirm"
            @keyup.enter="handleInputAutoDataSourceConfirm"
          />
          <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showAutoDataSourceInput">
            <a-icon type="plus" /> New
          </a-tag>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-auto-complete'" :label="$t('base.filter.option')">
          <a-switch v-model="activeData['filter-option']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.backfill !== undefined">
          <template slot="label">
            <a-tooltip>
              <template slot="title">
                {{ $t('base.backfill.tip') }}
              </template>
              {{ $t('base.backfill') }}
              <a-icon type="question-circle" />
            </a-tooltip>
          </template>
          <a-switch v-model="activeData.backfill" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['default-open'] !== undefined" :label="$t('base.default.open')">
          <a-switch v-model="activeData['default-open']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.placement !== undefined" :label="$t('base.placement')">
          <a-radio-group v-model="activeData.placement" button-style="solid">
            <a-radio-button value="top">
              top
            </a-radio-button>
            <a-radio-button value="bottom">
              bottom
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.prefix!==undefined && activeData.__config__.tag === 'a-mentions'"
          :label="$t('base.trigger.keyword')"
        >
          <a-input v-model="activeData.prefix" :placeholder="$t('base.enter')" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.split!==undefined" :label="$t('base.separator')">
          <a-input v-model="activeData.split" :placeholder="$t('base.separator')" />
        </a-form-model-item>
        <template
          v-if="['a-checkbox-group', 'a-radio-group', 'a-select', 'a-mentions'].indexOf(activeData.__config__.tag) > -1"
        >
          <a-divider>{{ $t('base.option') }}</a-divider>
          <draggable
            :list="activeData.__slot__.options"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
              <div class="select-line-icon option-drag">
                <a-icon type="pic-left" />
              </div>
              <a-input v-model="item.label" :placeholder="$t('base.option.name')" />
              <a-input
                :placeholder="$t('base.option.value')"
                :value="item.value"
                @input="setOptionValue(item, $event)"
              />
              <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                <a-icon type="minus-circle" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px;">
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addSelectItem"
            >
              {{ $t('base.add.option') }}
            </a-button>
          </div>
          <a-divider />
        </template>
        <!-- 穿梭框数据源 -->
        <template v-if="activeData.__config__.tag === 'a-transfer'">
          <a-divider>{{ $t('base.datasource') }}</a-divider>
          <draggable
            :list="activeData['data-source']"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div v-for="(item, index) in activeData['data-source']" :key="item.key" class="select-item">
              <div class="select-line-icon option-drag">
                <a-icon type="pic-left" />
              </div>
              <a-input v-model="item.title" :placeholder="$t('base.show.name')" />
              <a-input
                :placeholder="$t('base.data.value')"
                :value="item.key"
                @input="setDataSourceKey(item, $event)"
              />
              <div class="close-btn select-line-icon" @click="activeData['data-source'].splice(index, 1)">
                <a-icon type="minus-circle" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px;">
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addDataSourceItem"
            >
              {{ $t('base.add.data') }}
            </a-button>
          </div>
          <a-divider />
        </template>

        <template v-if="['a-cascader', 'a-tree-select'].includes(activeData.__config__.tag)">
          <a-divider>{{ $t('base.option') }}</a-divider>
          <a-form-model-item v-if="activeData.__config__.dataType" :label="$t('base.data.type')">
            <a-radio-group v-model="activeData.__config__.dataType" size="small" button-style="solid">
              <a-radio-button value="dynamic">
                {{ $t('base.data.dynamic') }}
              </a-radio-button>
              <a-radio-button value="static">
                {{ $t('base.data.static') }}
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>

          <template v-if="activeData.__config__.dataType === 'dynamic'">
            <a-form-model-item :label="$t('base.url')">
              <a-input
                v-model="activeData.__config__.url"
                :title="activeData.__config__.url"
                :placeholder="$t('base.enter')"
                allow-clear
                @blur="$emit('fetch-data', activeData)"
              >
                <a-select
                  slot="prepend"
                  v-model="activeData.__config__.method"
                  :style="{width: '85px'}"
                  @change="$emit('fetch-data', activeData)"
                >
                  <a-select-option value="get">
                    get
                  </a-select-option>
                  <a-select-option value="post">
                    post
                  </a-select-option>
                  <a-select-option value="put">
                    put
                  </a-select-option>
                  <a-select-option value="delete">
                    delete
                  </a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
            <a-form-model-item :label="$t('base.data.path')">
              <a-input
                v-model="activeData.__config__.dataPath"
                :placeholder="$t('base.enter')"
                @blur="$emit('fetch-data', activeData)"
              />
            </a-form-model-item>

            <template v-if="activeData.props && activeData.props.props">
              <a-form-model-item :label="$t('base.prop.label')">
                <a-input v-model="activeData.props.props.label" :placeholder="$t('base.enter')" />
              </a-form-model-item>
              <a-form-model-item l:label="$t('base.prop.value')">
                <a-input v-model="activeData.props.props.value" :placeholder="$t('base.enter')" />
              </a-form-model-item>
              <a-form-model-item :label="$t('base.prop.children')">
                <a-input v-model="activeData.props.props.children" :placeholder="$t('base.enter')" />
              </a-form-model-item>
            </template>
          </template>

          <!-- 级联选择静态树 -->
          <!-- {{activeData.options}} -->
          <a-tree
            draggable
            :tree-data="activeData.__config__.tag === 'a-cascader' ? activeData.options : activeData['tree-data']"
            :replace-fields="{children: 'children', title: 'label', key: 'id'}"
          >
            <template #title="data">
              <a-dropdown :trigger="['contextmenu']">
                <span>{{ data.label }}</span>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="append(data.dataRef)">
                      <a-icon type="plus" style="color: #1890ff;" />
                      {{ $t('base.add') }}
                    </a-menu-item>
                    <a-menu-item key="2" @click="remove(data)">
                      <a-icon type="delete"
                              theme="twoTone"
                              two-tone-color="#eb2f96"
                      />
                      {{ $t('base.remove') }}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </a-tree>
          <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
            <a-button
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addTreeItem(activeData.__config__.tag === 'a-cascader' ? 'options' : 'tree-data')"
            >
              {{ $t('base.add.parent') }}
            </a-button>
          </div>
          <a-divider />
        </template>

        <a-form-model-item v-if="activeData.__config__.optionType !== undefined" :label="$t('base.option.type')">
          <a-radio-group v-model="activeData.__config__.optionType" button-style="solid">
            <a-radio-button value="default">
              {{ $t('base.default') }}
            </a-radio-button>
            <a-radio-button value="button">
              {{ $t('base.button') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.showLabel !== undefined" :label="$t('base.show.label')">
          <a-switch v-model="activeData.__config__.showLabel" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['allow-half'] !== undefined" :label="$t('base.allow.half')">
          <a-switch v-model="activeData['allow-half']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-rate'" :label="$t('base.character')">
          <a-input v-model="activeData.character" @change="characterChange" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.reverse !== undefined" :label="$t('base.reverse')">
          <a-switch v-model="activeData.reverse" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.range !== undefined" :label="$t('base.range')">
          <a-switch v-model="activeData.range" @change="rangeChange" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.buttonStyle !== undefined && activeData.__config__.optionType === 'button'"
          :label="$t('base.button.style')"
        >
          <a-radio-group v-model="activeData.buttonStyle" button-style="solid">
            <a-radio-button value="outline">
              {{ $t('base.button.style.outline') }}
            </a-radio-button>
            <a-radio-button value="solid">
              {{ $t('base.button.style.solid') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.size !== undefined"
          :label="$t('base.component.size')"
        >
          <a-radio-group v-model="activeData.size" button-style="solid">
            <a-radio-button v-if="activeData.__config__.tag !== 'a-switch'" value="large">
              {{ $t('base.component.size.large') }}
            </a-radio-button>
            <a-radio-button value="default">
              {{ $t('base.component.size.default') }}
            </a-radio-button>
            <a-radio-button value="small">
              {{ $t('base.component.size.small') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="activeData['show-word-limit'] !== undefined" :label="$t('base.word.limit')">
          <a-switch v-model="activeData['show-word-limit']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-cascader'" :label="$t('base.expand.trigger')">
          <a-radio-group v-model="activeData['expand-trigger']" button-style="solid">
            <a-radio-button value="click">
              click
            </a-radio-button>
            <a-radio-button value="hover">
              hover
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-cascader'" :label="$t('base.change.on.select')">
          <a-switch v-model="activeData['change-on-select']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.allowClear !== undefined" :label="$t('base.allow.clear')">
          <a-switch v-model="activeData.allowClear" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-upload'" :label="$t('base.file.multiple')">
          <a-switch v-model="activeData.multiple" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData['input-read-only'] !== undefined" :label="$t('base.read.only')">
          <a-switch v-model="activeData['input-read-only']" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.disabled !== undefined" :label="$t('base.disabled')">
          <a-switch v-model="activeData.disabled" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.showSearch !== undefined" :label="$t('base.show.search')">
          <a-switch v-model="activeData.showSearch" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" :label="$t('base.mode')">
          <a-radio-group v-model="activeData.mode" button-style="solid">
            <a-radio-button value="default">
              {{ $t('base.default') }}
            </a-radio-button>
            <a-radio-button value="multiple">
              {{ $t('base.multiple') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.required !== undefined" :label="$t('base.required')">
          <a-switch v-model="activeData.__config__.required" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-tree-select'"
          :label="$t('base.dropdown.matc.select.width')"
        >
          <a-switch v-model="activeData['dropdown-matc-select-width']" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-tree-select'"
          :label="$t('base.tree.default.expand.all')"
        >
          <a-switch v-model="activeData['tree-default-expand-all']" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-tree-select' && !activeData['tree-checkable']"
          :label="$t('base.multiple')"
        >
          <a-switch v-model="activeData.multiple" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-tree-select'" :label="$t('base.tree.checkable')">
          <a-switch v-model="activeData['tree-checkable']" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-tree-select' && activeData['tree-checkable']"
          :label="$t('base.tree.check.strictly')"
        >
          <a-switch v-model="activeData['tree-check-strictly']" />
        </a-form-model-item>
        <a-form-model-item
          v-if="activeData.__config__.tag === 'a-tree-select' && !activeData['tree-check-strictly']"
          :label="$t('base.label.in.value')"
        >
          <a-switch v-model="activeData['label-in-value']" />
        </a-form-model-item>

        <template v-if="activeData.__config__.layoutTree">
          <a-divider>{{ $t('base.layout.tree') }}</a-divider>
          <a-tree
            :tree-data="[activeData.__config__]"
            :replace-fields="{children: 'children', title: 'componentName', key: 'renderKey'}"
          >
            <template #title="data">
              <a-dropdown :trigger="['contextmenu']">
                <span>
                  <a-icon :component="allIcon[data.__config__?data.__config__.tagIcon:data.tagIcon]" />
                  {{ data.componentName || data.__config__.componentName
                    || `${data.__config__.label} : ${data.__vModel__}` }}
                </span>
              </a-dropdown>
            </template>
          </a-tree>
        </template>

        <template v-if="Array.isArray(activeData.__config__.regList)">
          <a-divider>{{ $t('base.reg.list') }}</a-divider>
          <div
            v-for="(item, index) in activeData.__config__.regList"
            :key="index"
            class="reg-item"
          >
            <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
              <a-icon :style="{ fontSize: '16px' }" type="close-circle" theme="twoTone" two-tone-color="#ff4d4f" />
            </span>
            <a-form-model-item :label="$t('base.pattern')">
              <a-auto-complete
                v-model="item.pattern"
                :data-source="patternSource"
                :placeholder="$t('base.enter.pattern')"
                :filter-option="filterOption"
                option-label-prop="value"
                allow-clear
              />
            </a-form-model-item>
            <a-form-model-item :label="$t('base.error.message')" style="margin-bottom:0">
              <a-input v-model="item.message" :placeholder="$t('base.enter')" />
            </a-form-model-item>
          </div>
          <a-button icon="plus-circle" type="link" @click="addReg">
            {{ $t('base.add.reg') }}
          </a-button>
        </template>
      </a-form-model>
      <!-- 表单属性 -->
      <a-form-model v-show="currentTab === 'form'" size="small" label-width="90px">
        <a-form-model-item :label="$t('base.form.name')">
          <a-input
            v-model="formConf.formRef"
            :placeholder="`${$t('base.enter')}${$t('base.form.name')}(ref)`"
          />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.form.model')">
          <a-input v-model="formConf.formModel" :placeholder="$t('base.enter')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.form.rules')">
          <a-input v-model="formConf.formRules" :placeholder="$t('base.enter')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.form.layout')">
          <a-radio-group v-model="formConf.layout" button-style="solid">
            <a-radio-button value="horizontal">
              {{ $t('base.form.layout.horizontal') }}
            </a-radio-button>
            <a-radio-button value="vertical">
              {{ $t('base.form.layout.vertical') }}
            </a-radio-button>
            <a-radio-button value="inline">
              <a-tooltip>
                <template slot="title">
                  {{ $t('base.form.layout.inline.tip') }}
                </template>
                {{ $t('base.form.layout.inline') }}
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item v-if="formConf.layout === 'horizontal'" :label="$t('base.form.label.span')">
          <a-input v-model="formConf.labelCol.span" />
        </a-form-model-item>
        <a-form-model-item v-if="formConf.layout === 'horizontal'" :label="$t('base.form.label.offset')">
          <a-input v-model="formConf.labelCol.offset" />
        </a-form-model-item>
        <a-form-model-item v-if="formConf.layout === 'horizontal'" :label="$t('base.form.wrapper.span')">
          <a-input v-model="formConf.wrapperCol.span" />
        </a-form-model-item>
        <a-form-model-item v-if="formConf.layout === 'horizontal'" :label="$t('base.form.wrapper.offset')">
          <a-input v-model="formConf.wrapperCol.offset" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.label.align')">
          <a-radio-group v-model="formConf.labelAlign" button-style="solid">
            <a-radio-button value="left">
              {{ $t('base.label.align.left') }}
            </a-radio-button>
            <a-radio-button value="right">
              {{ $t('base.label.align.right') }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item :label="$t('base.grid.space')">
          <a-input-number v-model="formConf.gutter" :min="0" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.form.disabled')">
          <a-switch v-model="formConf.disabled" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.form.button')">
          <a-switch v-model="formConf.formBtns" />
        </a-form-model-item>
        <a-form-model-item :label="$t('base.un.focused.component.border')">
          <a-switch v-model="formConf.unFocusedComponentBorder" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <!-- field-box -->
    <div>
      <a-tooltip>
        <template slot="title">
          {{ $t('base.component.doc') }}
        </template>
        <a class="document-link" target="_blank" :href="documentLink" :title="$t('base.component.doc')">
          <a-icon type="link" />
        </a>
      </a-tooltip>
    </div>

    <!-- 图标选择器 -->
    <a-modal
      v-model="iconsVisible"
      :footer="null"
      width="40%"
      :title="$t('base.icon.component')"
    >
      <icon-selector
        :value="iconsVisible && currentIconModelSlot
          ? activeData.__slot__[currentIconModel] : activeData[currentIconModel]"
        @change="handleIconChange"
      />
    </a-modal>
    <treeNode-modal ref="treeNodeModal" :title="$t('base.add.option')" @commit="addNode" />
  </div>
</template>

<script>
import allIcon from '@/core/icons'
import { isArray } from 'util'
import TreeNodeModal from '@/views/index/TreeNodeModal'
import { isNumberStr } from '@/utils/index'
import {
  inputComponents, selectComponents
} from '@/components/generator/config'
import IconSelector from '@/components/IconSelector'
import { FORM_CONF } from '@/store/mutation-types'

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = []

export default {
  components: {
    TreeNodeModal,
    IconSelector
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      allIcon,
      currentTab: 'field',
      currentNode: null,
      iconsVisible: false,
      currentIconModelSlot: false,
      currentIconModel: null,
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      inputAutoDataSourceVisible: false,
      inputAutoDataSourceValue: ''
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.__config__.document
        || this.$t('tag.document')
      )
    },
    tagList() {
      return [
        {
          label: this.$t('base.input_components'),
          options: inputComponents
        },
        {
          label: this.$t('base.optional_components'),
          options: selectComponents
        }
      ]
    },
    patternSource() {
      return [
        {
          text: this.$t('base.number'),
          value: '/^[0-9]*$/'
        },
        {
          text: this.$t('base.letter'),
          value: '/^[A-Za-z]+$/'
        },
        {
          text: this.$t('base.letter.number'),
          value: '^[A-Za-z0-9]+$'
        },
        {
          text: this.$t('base.letter.number.underliner'),
          value: '/^\\w+$/'
        },
        {
          text: this.$t('base.chinese.characters'),
          value: '/^[\u4e00-\u9fa5],{0,}$ /'
        },
        {
          text: this.$t('base.mail'),
          value: '/^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$/'
        },
        {
          text: 'URL',
          value: '/^http://([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$ ；^[a-zA-z]+://(w+(-w+)*)(.(w+(-w+)*))*(?S*)?$/'
        }
      ]
    },
    activeTag() {
      return this.activeData.__config__.tag
    },
    isShowMin() {
      return ['a-input-number', 'a-slider'].indexOf(this.activeTag) > -1
    },
    isShowMax() {
      return ['a-input-number', 'a-slider'].indexOf(this.activeTag) > -1
    },
    isShowStep() {
      return ['a-input-number', 'a-slider'].indexOf(this.activeTag) > -1
    }
  },
  watch: {
    formConf: {
      handler(val) {
        this.$store.commit(FORM_CONF, val)
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    addDataSourceItem() {
      this.activeData['data-source'].push({
        titel: '',
        key: ''
      })
    },
    addTreeItem(keyName) {
      ++this.idGlobal
      this.$refs.treeNodeModal.open()
      this.currentNode = this.activeData[keyName]
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.$refs.treeNodeModal.open()
      this.currentNode = data.children
    },
    remove(node) {
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { pos } = node
      const dataPos = pos.split('-')
      this.treeRemove(this.activeData.options, 1, dataPos)
    },
    treeRemove(node, index, dataPos) {
      const i = index + 1
      if (index < dataPos.length - 1) {
        this.treeRemove(node[Number(dataPos[index])].children, i, dataPos)
      } else {
        node.splice(Number(dataPos[index]), 1)
      }
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, event) {
      const val = event.target.value
      item.value = isNumberStr(val) ? +val : val
    },
    setDataSourceKey(item, event) {
      const val = event.target.value
      item.key = isNumberStr(val) ? +val : val
    },
    changeStartPlaceholder(val) {
      this.activeData.placeholder[0] = val.target._value
    },
    changeEndPlaceholder(val) {
      this.activeData.placeholder[1] = val.target._value
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      if (['string', 'number'].indexOf(typeof val) > -1) {
        return val
      }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(event) {
      const str = event.target.value
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(event) {
      this.$set(this.activeData.__config__, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', event.target.value)
      this.$set(this.activeData, 'format', event.target.value)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    openIconsModal(model, modelConfig) {
      this.iconsVisible = true
      this.currentIconModelSlot = modelConfig
      this.currentIconModel = model
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date()
      }
    },
    characterChange(e) {
      if (!e.target.value || e.target.value === '') {
        this.activeData.character = undefined
      }
    },
    handleIconChange(icon) {
      this.iconsVisible = false
      if (this.currentIconModelSlot) {
        this.activeData.__slot__[this.currentIconModel] = icon
      } else {
        this.activeData[this.currentIconModel] = icon
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    },
    // 自动完成数据源
    handleAutoDataSourceClose(removedTag) {
      const dataSource = this.activeData['data-source'].filter(tag => tag !== removedTag)
      this.activeData['data-source'] = dataSource
    },

    showAutoDataSourceInput() {
      this.inputAutoDataSourceVisible = true
      this.$nextTick(() => {
        this.$refs.inputAutoDataSource.focus()
      })
    },

    handleInputAutoDataSourceChange(e) {
      this.inputAutoDataSourceValue = e.target.value
    },

    handleInputAutoDataSourceConfirm() {
      const { inputAutoDataSourceValue } = this
      let dataSource = this.activeData['data-source']
      if (inputAutoDataSourceValue && dataSource.indexOf(inputAutoDataSourceValue) === -1) {
        dataSource = [...dataSource, inputAutoDataSourceValue]
      }
      this.activeData['data-source'] = dataSource
      Object.assign(this, {
        inputAutoDataSourceVisible: false,
        inputAutoDataSourceValue: ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
.right-header {
  position: relative;
  height: 64px;
  overflow: hidden;
  -webkit-transition: all .3s;
  transition: all .3s;
  line-height: 64px;
  background: #fff;
  padding: 15px;
}
.right-main {
  height: calc(100vh - 64px - 30px);
  overflow-y: auto;
  margin: 10px 10px 0;
  padding: 5px;
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .a-input + .a-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
