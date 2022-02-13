import loadScript from './loadScript'
import pluginsConfig from './pluginsConfig'

let beautifierObj

export default function loadBeautifier(cb) {
  const { beautifierUrl } = pluginsConfig
  if (beautifierObj) {
    cb(beautifierObj)
    return
  }

  loadScript(beautifierUrl, () => {
    // eslint-disable-next-line no-undef
    beautifierObj = beautifier
    cb(beautifierObj)
  })
}
