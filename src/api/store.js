import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function login (userName, passWord) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/home/login`,
    params: {
      userName,
      passWord
    }
  })
}

export function reSetPass (userName, passWord) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/home/reSetPass`,
    params: {
      userName,
      passWord
    }
  })
}

export function register (userName, passWord) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/home/register`,
    params: {
      userName,
      passWord
    }
  })
}

export function getCommentList (title) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/detail/commentList`,
    params: {
      title
    }
  })
}

export function submitComment (userName, title, comment, score) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/submit/comment`,
    params: {
      userName,
      title,
      comment,
      score
    }
  })
}

export function getScore (fileName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/getScore`,
    params: {
      fileName
    }
  })
}

export function updateScore (title, currentScore, score) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/updateScore`,
    params: {
      title,
      currentScore,
      score
    }
  })
}

export function commentText (title) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/detail/comment`,
    params: {
      title
    }
  })
}

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function list (category) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`,
    params: {
      category
    }
  })
}

export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function flatList () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flatList`
  })
}

export function getBookShelf (userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/getBookShelf`,
    params: {
      userName
    }
  })
}

export function addBookToShelf (book, userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/addToShelf`,
    params: {
      book,
      userName
    }
  })
}

export function getIdList (list) {
  const res = []
  if (list.length && list.length > 0) {
    list.forEach(item => {
      res.push(item.bookId)
    })
  } else {
    res.push(list.id)
  }
  return res
}

export function removeBookFromShelf (book, userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/removeBookFromShelf`,
    params: {
      userName,
      list: getIdList(book)
    }
  })
}

export function getCategoryList (shelfCategoryName, userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/getCategoryList`,
    params: {
      shelfCategoryName,
      userName
    }
  })
}

export function moveToGroup (selected, userName, groupName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/moveToGroup`,
    params: {
      list: getIdList(selected),
      userName,
      groupName
    }
  })
}

export function moveOutOfGroup (selected, userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/moveOutOfGroup`,
    params: {
      list: getIdList(selected),
      userName
    }
  })
}

export function changeGroupName (newName, userName, oldName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/changeGroupName`,
    params: {
      newName,
      oldName,
      userName
    }
  })
}

export function duplicateGroupName (newName, userName) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/shelf/duplicateGroupName`,
    params: {
      newName,
      userName
    }
  })
}
// 电子书下载
// onSuccess， onError， onProgress 为回调函数
export function download (book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: process.env.VUE_APP_RES_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      // 缓存
      const userName = sessionStorage.getItem('userName')
      setLocalForage(`${userName}/${book.fileName}`, blob,
        () => { // 成功回调
          if (onSuccess) onSuccess(res)
        },
        err => { // 失败回调
          if (onError) onError(err)
        })
    }).catch(err => {
      if (onError) onError(err)
    })
}
