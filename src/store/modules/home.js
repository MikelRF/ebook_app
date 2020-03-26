const home = {
  state: {
    randomBookVisible: false,
    randomBook: null
  },
  mutations: {
    SET_RANDOM_BOOK_VISIBLE: (state, visible) => {
      state.randomBookVisible = visible
    },
    SET_RANDOM_BOOK: (state, book) => {
      state.randomBook = book
    }
  }
}

export default home
