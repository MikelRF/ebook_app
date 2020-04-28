const user = {
  state: {
    userName: '', // 用户名
    userStorage: '' // 用户缓存名
  },
  mutations: {
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_USER_STORAGE: (state, userStorage) => {
      state.userStorage = userStorage
    }
  }
}

export default user
