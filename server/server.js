/**
 * Created by gh on 2019/3/21.
 */
const Koa = require('koa2')
const fs = require('fs')
const path = require('path')
const mount = require('koa-mount')
const statics = require('koa-static')
const channelScript = require('./channelScript')
// const compress = require('koa-compress')
const app = new Koa()
const staticApp = new Koa()

let page = ''

if (!page) {
    // 缓存页面数据，减少重复读取消耗
    page = fs.readFileSync(path.join(__dirname, '../dist/main.html'), {
        encoding: 'utf8'
    })
}

staticApp.use(statics(path.join(__dirname, '../dist')), {
    maxage: 1000 * 60 * 60 * 24
})
// gizp 要在框架里处理好 后面再弄
// app.use(
//     compress({
//         filter: function(contentType) {
//             if (/html/.test(contentType)) {
//                 return false
//             }

//             return /(css)|(javascript)|(image)|(application\/font)/i.test(
//                 contentType
//             )
//         },
//         threshold: 2048,
//         flush: require('zlib').Z_SYNC_FLUSH
//     })
// )

app.use(mount('/mobile', staticApp))

app.use(async(ctx, next) => {
    let userAgent = ctx.request.headers['user-agent'] || ctx.request.headers['User-Agent']
    if (userAgent) {
        userAgent = userAgent.toLowerCase()
    }
    let html = page.replace('#{channelScripts}', channelScript.getBridge(userAgent))
    ctx.body = html
})

let port = process.env.PORT0 || 8882

app.listen(port, '0.0.0.0', error => {
    if (error) {
        console.log(error)
        return
    }
    console.log(`server listening on http://0.0.0.0:${port}`)
})
