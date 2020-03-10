const book = {
  state: {
    test: 1
  },
  mutations: {
    asd: (state, newTest) => {
      state.test = newTest
    }
  },
  actions: {
    setTest: ({ commit, state }, newTest) => {
      return commit('asd', newTest)
    }
  }
}

export default book
