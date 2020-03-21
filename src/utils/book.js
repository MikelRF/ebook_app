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
          color: '#4c5059',
          background: '#efefef',
          'padding-top': `${realpx(40)}px!important`,
          'padding-bottom': `${realpx(32)}px!important`
        }
      }
    },
    {
      alias: '雅致',
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6',
          'padding-top': `${realpx(40)}px!important`,
          'padding-bottom': `${realpx(32)}px!important`
        }
      }
    },
    {
      alias: '护眼',
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9',
          'padding-top': `${realpx(40)}px!important`,
          'padding-bottom': `${realpx(32)}px!important`
        }
      }
    },
    {
      alias: '夜间',
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000',
          'padding-top': `${realpx(40)}px!important`,
          'padding-bottom': `${realpx(32)}px!important`
        }
      }
    }
  ]
}

// 自适应不同屏幕宽度
export function px2rem (px) {
  const ration = 375 / 10
  return px / ration
}

// 自适应下的真实px
export function realpx (px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth
  return px * (maxWidth / 375)
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

// 多级目录转一级
export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
