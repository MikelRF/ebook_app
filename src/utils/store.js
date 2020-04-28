import { saveBookShelf, getBookShelf, getLocalStorage } from './LocalStorage'

export function backToUpLevel (vue) {
  vue.$router.go(-1)
}

export const categoryList = {
  ComputerScience: 1,
  SocialSciences: 2,
  Economics: 3,
  Education: 4,
  Engineering: 5,
  Environment: 6,
  Geography: 7,
  History: 8,
  Laws: 9,
  LifeSciences: 10,
  Literature: 11,
  Biomedicine: 12,
  BusinessandManagement: 13,
  EarthSciences: 14,
  MaterialsScience: 15,
  Mathematics: 16,
  MedicineAndPublicHealth: 17,
  Philosophy: 18,
  Physics: 19,
  PoliticalScienceAndInternationalRelations: 20,
  Psychology: 21,
  Statistics: 22
}

export function getCategoryName (id) {
  switch (id) {
    case 1:
      return 'ComputerScience'
    case 2:
      return 'SocialSciences'
    case 3:
      return 'Economics'
    case 4:
      return 'Education'
    case 5:
      return 'Engineering'
    case 6:
      return 'Environment'
    case 7:
      return 'Geography'
    case 8:
      return 'History'
    case 9:
      return 'Laws'
    case 10:
      return 'LifeSciences'
    case 11:
      return 'Literature'
    case 12:
      return 'Biomedicine'
    case 13:
      return 'BusinessandManagement'
    case 14:
      return 'EarthSciences'
    case 15:
      return 'MaterialsScience'
    case 16:
      return 'Mathematics'
    case 17:
      return 'MedicineAndPublicHealth'
    case 18:
      return 'Philosophy'
    case 19:
      return 'Physics'
    case 20:
      return 'PoliticalScienceAndInternationalRelations'
    case 21:
      return 'Psychology'
    case 22:
      return 'Statistics'
  }
}

export function categoryText (category) {
  switch (category) {
    case 1:
      return '计算机科学'
    case 2:
      return '社会科学'
    case 3:
      return '经济学'
    case 4:
      return '教育学'
    case 5:
      return '工程学'
    case 6:
      return '环境学'
    case 7:
      return '地理学'
    case 8:
      return '历史学'
    case 9:
      return '法学'
    case 10:
      return '生命科学'
    case 11:
      return '文学'
    case 12:
      return '生物医学'
    case 13:
      return '工商管理'
    case 14:
      return '地球科学'
    case 15:
      return '材料科学'
    case 16:
      return '数学'
    case 17:
      return '公共卫生'
    case 18:
      return '哲学'
    case 19:
      return '物理'
    case 20:
      return '国际关系'
    case 21:
      return '心理学'
    case 22:
      return '统计学'
  }
}

export function appendAddToShelf (list) {
  list.push({
    id: -1,
    type: 3
  })
  return list
}

export function removeAddFromShelf (list) {
  return list.filter(item => item.type !== 3)
}

export function gotoStoreHome (vue) {
  vue.$router.push({
    path: '/store/home'
  })
}

export function gotoBookDetail (vue, book) {
  vue.$router.push({
    path: '/store/detail',
    query: {
      fileName: book.fileName,
      category: book.categoryText
    }
  })
}

export function computedId (list) {
  return list.map((book, index) => {
    if (book.type !== 3) {
      book.id = index + 1 // 书架id
      if (book.itemList) {
        // 当前图书是分组
        book.itemList = computedId(book.itemList)
      }
    }
    return book
  })
}

export function addToShelf (book) {
  let shelfList = getBookShelf(sessionStorage.getItem('userName'))
  if (!shelfList) {
    shelfList = []
  } else {
    shelfList = removeAddFromShelf(shelfList)
  }
  book.type = 1
  shelfList.push(book)
  shelfList = computedId(shelfList)
  shelfList = appendAddToShelf(shelfList)
  saveBookShelf(sessionStorage.getItem('userName'), shelfList)
}

export function removeFromBookShelf (book) {
  return getBookShelf(sessionStorage.getItem('userName')).filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subBook => subBook.fileName !== book.fileName)
    }
    return book.fileName !== item.fileName
  })
}

export function flatBookList (bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}

export function findBook (fileName) {
  const bookList = getLocalStorage('shelf')
  return flatBookList(bookList).find(item => item.fileName === fileName)
}
