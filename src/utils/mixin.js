import { mapActions, mapGetters } from 'vuex'
import { addCss, removeAllCss, ThemeList } from './book'
import { saveLocation, getBookmark } from './LocalStorage'
import { appendAddToShelf, computedId, gotoBookDetail, removeAddFromShelf } from './store'
import { getBookShelf, moveOutOfGroup } from '../api/store'
import { getLocalForage, removeLocalForage } from './localForage'

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
    updateCache(list, userName) {
      list.map(book => {
        if (book.itemList) {
          book.itemList = this.updateCache(book.itemList, userName)
        }
        getLocalForage(userName + '/' + book.fileName, (err, res) => {
          if (!err && res) {
            book.cache = true
          }
        })
      })
      return list
    },
    getShelfList () {
      getBookShelf(sessionStorage.getItem('userName')).then(response => {
        const result = response.data
        let shelfList
        if (result.error_code === 0) { // 有收藏
          // shelfList = result.data
          // this.setShelfList(appendAddToShelf(computedId(shelfList)))
          shelfList = this.updateCache(result.data, sessionStorage.getItem('userName'))
          this.setShelfList(appendAddToShelf(computedId(shelfList)))
        } else if (result.error_code === 2) { // 无收藏
          shelfList = appendAddToShelf([])
          this.setShelfList(shelfList)
        } else {
          this.simpleToast('获取书架失败...')
          this.setShelfList(appendAddToShelf([]))
        }
      })
    },
    getCategoryList (title) {
      const categoryList = this.shelfList.filter(book => book.type === 2 && book.shelfCategoryName === title)[0]
      this.setShelfCategory(categoryList)
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
      moveOutOfGroup(this.shelfSelected, sessionStorage.getItem('userName')).then(response => {
        console.log(response)
        if (response.data.error_code === 0) {
          // 过滤
          this.setShelfList(this.shelfList.map(book => {
            if (book.type === 2 && book.itemList) {
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
          })
        } else {
          this.simpleToast('移出分组失败...')
        }
        if (cb) cb()
      })
    },
    // 删除离线
    removeSelectedBook (bookItem) {
      console.log(bookItem)
      if (bookItem) {
        console.log('123')
        this.removeBook(bookItem)
      } else {
        Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
          .then(books => {
            books.map(book => {
              book.cache = false
            })
          })
        this.getShelfList()
      }
    },
    removeBook (book) {
      return new Promise((resolve, reject) => {
        removeLocalForage(`${sessionStorage.getItem('userName')}/${book.fileName}`)
        resolve(book)
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
