import {
  Icon, Menu, Dropdown, Space
} from 'ant-design-vue'
import { i18nRender, loadLanguageAsync } from '@/locales'
import i18nMixin from '@/store/i18n-mixin'

const locales = ['zh-CN', 'en-US']
const languageLabels = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}
const languageIcons = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸'
}

const SelectLang = {
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-drop-down'
    }
  },
  name: 'SelectLang',
  mixins: [i18nMixin],
  render() {
    const { prefixCls } = this
    const changeLang = ({ key }) => {
      this.setLang(key)
    }
    const langMenu = (
      <Menu class={['menu', 'ant-pro-header-menu']} selectedKeys={[this.currentLang]} onClick={changeLang}>
        {locales.map(locale => (
          <Menu.Item key={locale}>
            <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '}
            {languageLabels[locale]}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <Space>
          <Icon type="global" title={i18nRender('navBar.lang')} />
          {languageLabels[this.currentLang]}
        </Space>
      </Dropdown>
    )
  }
}

export default SelectLang
