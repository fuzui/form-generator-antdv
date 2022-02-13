export default {
  addonBefore(h, conf, key) {
    return <template slot="addonBefore"><a-icon type={conf.__slot__[key]} /></template>
  },
  addonAfter(h, conf, key) {
    return <template slot="addonAfter"><a-icon type={conf.__slot__[key]} /></template>
  }
}
