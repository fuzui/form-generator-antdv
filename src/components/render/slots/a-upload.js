export default {
  'list-type': (h, conf, key) => {
    const list = []
    const config = conf.__config__
    if (conf['list-type'] === 'picture-card') {
      list.push(<div><a-icon type="plus" /><div class="ant-upload-text">{config.buttonText}</div></div>)
    } else {
      list.push(<a-button> <a-icon type="upload" /> {config.buttonText}</a-button>)
    }
    return list
  }
}
