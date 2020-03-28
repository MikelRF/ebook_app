const book = {
  state: {
    fileName: '', // 电子书路径
    menuVisible: false, // 菜单栏是否可见
    settingVisible: -1, // -1不显示 0字号 1主题 2进度 3目录
    defaultFontSize: 18, // 默认字体大小
    defaultFontFamily: 'Default', // 当前选中的字体
    fontFamilyVisible: false, // 字体弹窗是否可见
    defaultTheme: 'Default', // 默认主题
    bookAvailable: false, // 当前电子书加载是否完毕
    progress: 0, // 阅读进度百分比
    section: 0, // 阅读章节
    isPaginating: true,
    currentBook: null, // 获取当前阅览书籍对象
    navigation: null, // 目录
    cover: null, // 封面
    metadata: null, // 书籍信息
    paginate: '',
    pagelist: null,
    offsetY: 0, // 下拉书签偏移量
    isBookmark: null // 当前页是否是书签
  },
  mutations: {
    SET_FILENAME: (state, fileName) => {
      state.fileName = fileName
    },
    SET_MENU_VISIBLE: (state, visible) => {
      state.menuVisible = visible
    },
    SET_SETTING_VISIBLE: (state, visible) => {
      state.settingVisible = visible
    },
    SET_DEFAULT_FONT_SIZE: (state, fontSize) => {
      state.defaultFontSize = fontSize
    },
    SET_DEFAULT_FONT_FAMILY: (state, font) => {
      state.defaultFontFamily = font
    },
    SET_FONT_FAMILY_VISIBLE: (state, visible) => {
      state.fontFamilyVisible = visible
    },
    SET_DEFAULT_THEME: (state, theme) => {
      state.defaultTheme = theme
    },
    SET_BOOK_AVAILABLE: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    SET_PROGRESS: (state, progress) => {
      state.progress = progress
    },
    SET_SECTION: (state, section) => {
      state.section = section
    },
    SET_IS_PAGINATING: (state, isPaginating) => {
      state.isPaginating = isPaginating
    },
    SET_CURRENT_BOOK: (state, currentBook) => {
      state.currentBook = currentBook
    },
    SET_NAVIGATION: (state, navigation) => {
      state.navigation = navigation
    },
    SET_COVER: (state, cover) => {
      state.cover = cover
    },
    SET_METADATA: (state, metadata) => {
      state.metadata = metadata
    },
    SET_PAGINATE: (state, paginate) => {
      state.paginate = paginate
    },
    SET_PAGELIST: (state, pagelist) => {
      state.pagelist = pagelist
    },
    SET_OFFSETY: (state, offsetY) => {
      state.offsetY = offsetY
    },
    SET_IS_BOOKMARK: (state, isBookmark) => {
      state.isBookmark = isBookmark
    }
  }
}

export default book
