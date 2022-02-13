const getters = {
  drawingItems: state => state.app.drawingItems,
  drawingItemsVersion: state => state.app.drawingItemsVersion,
  idGlobal: state => state.app.idGlobal,
  treeNodeId: state => state.app.treeNodeId,
  formConf: state => state.app.formConf,
  lang: state => state.app.lang
}

export default getters
