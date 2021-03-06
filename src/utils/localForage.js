import localForage from 'localforage'

// 添加KV
export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

// 获取KV
export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    if (cb) cb(err, value)
  })
}

// 移除指定KV
export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

// 清空
export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

// 获取数据数量
export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      console.log(numberOfKeys)
    }).catch(function(err) {
    console.log(err)
  })
}

// 遍历DB中数据
export function iteratorLocalForage() {
  localForage.iterate(function(value, key, iterationNumber) {
    console.log([key, value])
  }).then(function() {
    console.log('Iteration has completed')
  }).catch(function(err) {
    console.log(err)
  })
}

// 是否支持indexedDB
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
