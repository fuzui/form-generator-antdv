import loadScript from './loadScript'
import pluginsConfig from './pluginsConfig'

// monaco-editor单例
let monacoEidtor

/**
 * 动态加载monaco-editor cdn资源
 * @param {Function} cb 回调，必填
 */
export default function loadMonaco(cb) {
  if (monacoEidtor) {
    cb(monacoEidtor)
    return
  }

  const { monacoEditorUrl: vs } = pluginsConfig

  !window.require && (window.require = {})
  !window.require.paths && (window.require.paths = {})
  window.require.paths.vs = vs

  loadScript(`${vs}/loader.js`, () => {
    window.require(['vs/editor/editor.main'], () => {
      monacoEidtor = window.monaco
      cb(monacoEidtor)
    })
  })
}
