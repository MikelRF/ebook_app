function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookCategoryList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  }
}
// 在vue-cli.3.3版本后 baseUrl被废除了，因此这边要写成 publicPath
