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

// 清空图书缓存
export function clearLocalStorage() {
  return localStorage.clear()
}

// 获取缓存用户名
export function getUserName() {
  return getLocalStorage('user')
}

// 缓存用户名
  export function saveUserName(userName) {
  return setLocalStorage('user', userName)
}

// 获取缓存密码
export function getPassWord() {
  return getLocalStorage('pass')
}

// 缓存密码
export function savePassWord(passWord) {
  return setLocalStorage('pass', passWord, 1800)
}

// 缓存书架
export function saveBookShelf(username, shelf) {
  return setLocalStorage(username + '/shelf', shelf)
}

// 获取书架
export function getBookShelf(username) {
  return getLocalStorage(username + '/shelf')
}

// 获取阅读位置
export function getLocation(userStorage) {
  return getBookObject(userStorage, 'location')
}

// 保存阅读位置
export function saveLocation(userStorage, location) {
  setBookObject(userStorage, 'location', location)
}

// 获取书签
export function getBookmark(userStorage) {
  return getBookObject(userStorage, 'bookmark')
}

// 保存书签
export function saveBookmark(userStorage, bookmark) {
  setBookObject(userStorage, 'bookmark', bookmark)
}

// 获取阅读进度
export function getProgress(userStorage) {
  return getBookObject(userStorage, 'progress')
}

// 保存阅读进度
export function saveProgress(userStorage, progress) {
  setBookObject(userStorage, 'progress', progress)
}

// 获取目录
export function getNavigation(userStorage) {
  return getBookObject(userStorage, 'navigation')
}

// 保存目录
export function saveNavigation(userStorage, navigation) {
  setBookObject(userStorage, 'navigation', navigation)
}

// 获取书籍信息
export function getMetadata(userStorage) {
  return getBookObject(userStorage, 'metadata')
}

// 保存书籍信息
export function saveMetadata(userStorage, metadata) {
  setBookObject(userStorage, 'metadata', metadata)
}

// 获取书籍封面
export function getCover(userStorage) {
  return getBookObject(userStorage, 'cover')
}

// 保存书籍封面
export function saveCover(userStorage, cover) {
  setBookObject(userStorage, 'cover', cover)
}

// 获取字体
export function getFontFamily(userStorage) {
  return getBookObject(userStorage, 'fontFamily')
}

// 缓存字体
export function saveFontFamily(userStorage, fontFamily) {
  setBookObject(userStorage, 'fontFamily', fontFamily)
}

// 获取主题
export function getTheme(userStorage) {
  return getBookObject(userStorage, 'theme')
}

// 缓存主题
export function saveTheme(userStorage, theme) {
  setBookObject(userStorage, 'theme', theme)
}

// 获取字号
export function getFontSize(userStorage) {
  return getBookObject(userStorage, 'fontSize')
}

// 缓存字号
export function saveFontSize(userStorage, fontSize) {
  setBookObject(userStorage, 'fontSize', fontSize)
}

// 获取电子书
export function getBookObject(userStorage, key) {
  if (getLocalStorage(`${userStorage}-info`)) {
    return getLocalStorage(`${userStorage}-info`)[key]
  } else {
    return null
  }
}

// 缓存电子书
export function setBookObject(userStorage, key, value) {
  let book = {}
  // 缓存中有该书的信息
  if (getLocalStorage(`${userStorage}-info`)) {
    book = getLocalStorage(`${userStorage}-info`)
  }
  // 无信息,添加缓存
  book[key] = value
  setLocalStorage(`${userStorage}-info`, book)
}
