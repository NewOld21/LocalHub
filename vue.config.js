const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.VUE_APP_ROUTER_BASE_PATH || '/',
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL || 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
