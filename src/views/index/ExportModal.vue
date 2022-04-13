<template>
  <a-modal
    v-model="visible"
    :title="$t('base.export.file')"
    @ok="handelConfirm"
    @cancel="close"
  >
    <a-form-model
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
    >
      <a-form-model-item :label="$t('base.filename')" prop="fileName">
        <a-input v-model="formData.fileName" :placeholder="$t('base.enter')" allow-clear />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  props: ['showFileName'],
  data() {
    return {
      visible: false,
      formData: {
        fileName: undefined
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
        }]
      }
    }
  },
  watch: {},
  mounted() {},
  methods: {
    onOpen(suffix) {
      this.formData.fileName = `${+new Date()}.${suffix}`
      this.visible = true
    },
    onClose() {
    },
    close(e) {
      this.visible = false
    },
    handelConfirm() {
      this.$refs.elForm.validate(valid => {
        if (!valid) return
        this.$emit('confirm', this.formData.fileName)
        this.close()
      })
    }
  }
}
</script>
