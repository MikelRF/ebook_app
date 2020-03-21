// 本地缓存
import Storage from 'web-storage-cache'

const localStorage = new Storage()

// 获取键值
export function getLocalStorage(key) {
  return localStorage.get(key)
}

// 设置键值
export function setLocalStorage(key, value, expire = 30 * 24 * 3600) {
  return localStorage.set(key, value, { exp: expire })
}

// 清除键值
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

// 清空缓存
export function clearLocalStorage() {
  return localStorage.clear()
}

export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStorage('home', home, 1800)
}

export function getLocale() {
  return getLocalStorage('locale')
}

export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}

// 获取阅读位置
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}

// 保存阅读位置
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}

// 获取书签
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}

// 保存书签
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}

// 获取阅读进度
export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}

// 保存阅读进度
export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}

// 获取目录
export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}

// 保存目录
export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

// 获取书籍信息
export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

// 保存书籍信息
export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

// 获取书籍封面
export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}

// 保存书籍封面
export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}

// 获取字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}

// 缓存字体
export function saveFontFamily(fileName, fontFamily) {
  setBookObject(fileName, 'fontFamily', fontFamily)
}

// 获取主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

// 缓存主题
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

// 获取字号
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}

// 缓存字号
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}

// 获取电子书
export function getBookObject(fileName, key) {
  if (getLocalStorage(`${fileName}-info`)) {
    return getLocalStorage(`${fileName}-info`)[key]
  } else {
    return null
  }
}

// 缓存电子书
export function setBookObject(fileName, key, value) {
  let book = {}
  // 缓存中有该书的信息
  if (getLocalStorage(`${fileName}-info`)) {
    book = getLocalStorage(`${fileName}-info`)
  }
  // 无信息,添加缓存
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
