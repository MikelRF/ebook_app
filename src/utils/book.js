// 字号集合
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

// 字体集合
export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

// 主题样式
export function ThemeList(vue) {
  return [
    {
      alias: '默认',
      name: 'Default',
      style: {
        body: {
          // color: '#4c5059',
          background: '#efefef'
        }
      }
    },
    {
      alias: '雅致',
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6'
        }
      }
    },
    {
      alias: '护眼',
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9'
        }
      }
    },
    {
      alias: '夜间',
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000'
        }
      }
    }
  ]
}

// 加载全局动态主题样式
export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 删除css全局样式
export function removeCss(href) {
  const link = document.getElementsByTagName('link')
  for (let i = link.length; i >= 0; i--) {
    if (link[i] && link[i].getAttribute('href') &&
      link[i].getAttribute('href') === href) {
      link[i].parentNode.removeChild(link[i])
    }
  }
}

export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}
