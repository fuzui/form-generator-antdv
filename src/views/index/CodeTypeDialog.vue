<template>
  <div>
    <a-modal
      v-bind="$attrs"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @ok="handelConfirm"
      @cancel="close"
    >
      <a-row :gutter="15">
        <a-form-model
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <a-col :span="24">
            <a-form-model-item :label="$t('base.build.type')" prop="type">
              <a-radio-group v-model="formData.type">
                <a-radio-button
                  v-for="(item, index) in typeOptions"
                  :key="index"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item v-if="showFileName" :label="$t('base.filename')" prop="fileName">
              <a-input v-model="formData.fileName" :placeholder="$t('base.enter')" allow-clear />
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </a-row>

      <div slot="footer">
        <a-button @click="close">
          {{ $t('base.cancel') }}
        </a-button>
        <a-button type="primary" @click="handelConfirm">
          {{ $t('base.ok') }}
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ['showFileName'],
  data() {
    return {
      formData: {
        fileName: undefined,
        type: 'file'
      }
    }
  },
  computed: {
    rules() {
      return {
        fileName: [{
          required: true,
          message: `${this.$t('base.enter')}${this.$t('base.filename')}`,
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: this.$t('base.choose.build.type'),
          trigger: 'change'
        }]
      }
    },
    typeOptions() {
      return [{
        label: this.$t('base.page'),
        value: 'file'
      }, {
        label: this.$t('base.modal'),
        value: 'dialog'
      }]
    }
  },
  watch: {},
  mounted() {},
  methods: {
    onOpen() {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`
      }
    },
    onClose() {
    },
    close(e) {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        this.$emit('confirm', { ...this.formData })
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
