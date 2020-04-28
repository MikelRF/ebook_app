import { mapActions, mapGetters } from 'vuex'
import { addCss, removeAllCss, ThemeList } from './book'
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './LocalStorage'
import { appendAddToShelf, computedId, gotoBookDetail, removeAddFromShelf } from './store'

export const userMixin = {
  computed: {
    ...mapGetters([
      'userName',
      'userStorage'
    ])
  },
  methods: {
    ...mapActions([
      'setUserName',
      'setUserStorage'
    ])
  }
}

export const shelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'shelfCategory',
      'currentType',
      'offsetY'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setShelfCategory',
      'setCurrentType',
      'setOffsetY'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    },
    getShelfList () {
      let shelfList = getBookShelf(sessionStorage.getItem('userName'))
      // 无缓存
      if (!shelfList) {
        shelfList = appendAddToShelf([])
        saveBookShelf(sessionStorage.getItem('userName'), shelfList)
        return this.setShelfList(shelfList)
      } else {
        return this.setShelfList(shelfList)
      }
    },
    getCategoryList (title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    // 隐藏弹窗
    hidePopup () {
      this.popupMenu.hide()
    },
    // 创建弹窗选项
    createPopupBtn (text, onClick, type = 'normal') {
      return {
        text: text,
        type: type,
        click: onClick
      }
    },
    popupCancelBtn () { // 取消按钮
      return this.createPopupBtn('取消', () => {
        this.hidePopup()
      })
    },
    moveOutOfGroup (cb) {
      // 过滤
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          // 保留未被选中的图书
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => { // 放回书架页
        let list = removeAddFromShelf(this.shelfList) // 移出 +
        list = [].concat(list, ...this.shelfSelected)
        list = appendAddToShelf(list) // 加上 +
        list = computedId(list) // 重新计算id
        this.setShelfList(list)
        this.simpleToast('成功移出分组')
        if (cb) cb()
      })
    }
  }
}
export const homeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'randomBookVisible',
      'randomBook'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setRandomBookVisible',
      'setRandomBook'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  }
}
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList () {
      return ThemeList(this)
    },
    getSectionName () {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    // 初始全局主题样式 (ebookReader、ebookSettingTheme 中调用)
    initGlobalTheme () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          break
      }
    },
    // 刷新
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        // 通过cfi转换为进度百分比并取整
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.userStorage, startCfi)
        /* 判断当前页面是否是书签，不是则把Bookmark设为false
      防止将当前页设置为书签后，翻到下一页仍有书签标记 */
        const bookmark = getBookmark(this.userStorage)
        // console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    // 自定义display方法，cb为回调函数
    myDisplay (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    // 隐藏标题,菜单
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    }
  }
}
