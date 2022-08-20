'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // page title

// 如果您的端口设置为80，
// 使用管理员权限执行命令行。
// 例如:Mac: sudo npm run
// 可以通过以下方法修改端口:
// port = 9527 npm run dev OR npm run dev——port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port  此处修改端口号

// 所有配置项说明请参见 https://cli.vuejs.org/config/
module.exports = {
  /**
   *您需要设置publicPath，如果您计划部署您的网站的子路径，
   *例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/，
   *那么publicPath应该设置为/bar/。
   *在大多数情况下请使用'/' !!
   *细节:https://cli.vuejs.org/config/ publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'admin/static',
  // lintOnSave: process.env.NODE_ENV === 'development',  //在development 模式下开启保存即检查
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 是否使用包含运行时编译器的 Vue 构建版本
  // runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    inline: true, // 开启实时刷新
    host: '0.0.0.0',

    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/dev-api': {
        // ws: true,  // 跨域使用
        // target: 'https://api.haorenxinxi.com/moban-api/',
        target: 'https://testqj.yuanfangyun.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api': ''
        }
      }
    },
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用程序的标题，这样
    // 它可以在index.html中访问，以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src') // 配置@直接到 src 文件夹
      }
    }
  },
  chainWebpack(config) {
    // 可以提高第一屏的速度，建议打开预加载
    // 可以提高第一屏的速度，建议打开预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // 当页面很多时，会导致太多无意义的请求
    config.plugins.delete('prefetch')

    // 设置 svg 使用的loader svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 只打包最初依赖的第三方
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分为单个包
                  priority: 20, // 重量需要大于libs和app，否则会被打包成libs或app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 为了适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
