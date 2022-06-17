import { mapState } from 'vuex'

const baseMixin = {
  computed: {
    ...mapState({
      drawingItems: state => state.app.drawingItems,
      drawingItemsVersion: state => state.app.drawingItemsVersion,
      // idGlobal: state => state.app.idGlobal,
      treeNodeId: state => state.app.treeNodeId,
      formConf: state => state.app.formConf,
      lang: state => state.app.lang
    }),
    idGlobal: {
      get() {
        return this.$store.state.app.idGlobal
      },
      set(value) {
        return value
      }
    }
  },
  methods: {
  }
}

export {
  baseMixin
}
