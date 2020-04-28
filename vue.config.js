module.exports = {

  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  devServer: {
    host: '192.168.3.2'
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 512 * 1024,
      maxEntrypointSize: 512 * 1024
    }
  }
}
// 在vue-cli.3.3版本后 baseUrl被废除了，因此这边要写成 publicPath
