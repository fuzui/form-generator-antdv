<template>
  <a-config-provider :locale="locale">
    <div>
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>

export default {
  computed: {
    locale() {
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  mounted() {
    // 取消开始的loading动画
    const preLoader = document.querySelector('#pre-loader')
    preLoader.style.display = 'none'

    // fix: firefox 下 拖拽 会新打卡一个选项卡
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = event => {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>
