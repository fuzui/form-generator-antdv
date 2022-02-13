export default {
  options(h, conf, key) {
    const list = []
    conf.__slot__.options.forEach(item => {
      list.push(<a-select-option value={item.value} disabled={item.disabled}> {item.label} </a-select-option>)
    })
    return list
  }
}
