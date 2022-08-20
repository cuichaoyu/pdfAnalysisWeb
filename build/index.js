//这个文件的作用主要是为 查看构建文件的体积大小
//运行之后你就可以在 http://localhost:9526/report.html 页面看到具体的体积分布
//具体的优化可以参考 Webpack 大法之 Code Splitting
//强烈建议开启 gzip ，使用之后普遍体积只有原先 1/3 左右。打出来的 app.js 过大，查看一下是不是 Uglify 配置不正确或者 sourceMap 没弄对。 优化相关请看该 Webpack Freestyle 之 Long Term Cache

// 使用：
// npm run preview
//运行之后你就可以在 http://localhost:9526/report.html 页面看到具体的体积分布

const { run } = require('runjs')  //代码分享平台 插件
const chalk = require('chalk')    // 使输出的内容有颜色
const config = require('../vue.config.js')  //vue配置文件
const rawArgv = process.argv.slice(2)  //process.argv：返回一个数组，成员是当前进程的所有命令行参数。
const args = rawArgv.join(' ') //命令合并

//判断确保运行的是 package 里面的 preview
if (process.env.npm_config_preview || rawArgv.includes('--preview')) {

  // console.log(process.argv)
  // console.log(rawArgv)
  const report = rawArgv.includes('--report')  //命令中 是否包含  --report 包含的话则要生成 report.html 用来查看文件占用

  run(`vue-cli-service build ${args}`) //运行这些命令

  const port = 9526
  const publicPath = config.publicPath

  var connect = require('connect')
  var serveStatic = require('serve-static')
  const app = connect()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  app.listen(port, function () {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))  //打印带颜色的字体
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }

  })
} else {
  run(`vue-cli-service build ${args}`)
}
