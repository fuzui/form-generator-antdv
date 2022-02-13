<template>
  <a-modal
    v-model="visible"
    :title="$t('base.external.resource.reference')"
    @ok="handelConfirm"
    @cancel="close"
  >
    <a-space direction="vertical">
      <a-input-search
        v-for="(item, index) in resources"
        :key="index"
        v-model="resources[index]"
        :placeholder="$t('base.cssjs.resource.url.placeholder')"
        allow-clear
      >
        <a-icon slot="prefix" type="link" />
        <a-button
          slot="enterButton"
          type="danger"
          icon="delete"
          @click="deleteOne(index)"
        />
      </a-input-search>
      <a-button-group class="add-item">
        <a-button
          type="dashed"
          @click="addOne('https://lib.baomitu.com/jquery/1.8.3/jquery.min.js')"
        >
          jQuery1.8.3
        </a-button>
        <a-button
          type="dashed"
          @click="addOne('https://unpkg.com/http-vue-loader')"
        >
          http-vue-loader
        </a-button>
        <a-button
          icon="plus"
          type="dashed"
          @click="addOne('')"
        >
          {{ $t('base.add.other') }}
        </a-button>
      </a-button-group>
    </a-space>
  </a-modal>
</template>
<script>
import { deepClone } from '@/utils/index'

export default {
  components: {},
  inheritAttrs: false,
  data() {
    return {
      visible: false,
      resources: null
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen(originResource) {
      this.resources = originResource.length ? deepClone(originResource) : ['']
      this.visible = true
    },
    close() {
      this.visible = false
    },
    handelConfirm() {
      const results = this.resources.filter(item => !!item) || []
      this.$emit('save', results)
      if (results.length) {
        this.resources = results
      }
    },
    deleteOne(index) {
      this.resources.splice(index, 1)
    },
    addOne(url) {
      if (this.resources.indexOf(url) > -1) {
        this.$message(this.$t('base.resource.existed'))
      } else {
        this.resources.push(url)
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.add-item{
  margin-top: 8px;
}
.url-item{
  margin-bottom: 12px;
}
</style>
