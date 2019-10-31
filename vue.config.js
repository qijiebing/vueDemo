const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const env = process.env.NODE_ENV
module.exports = {
    publicPath: '/mobile/',
    indexPath: 'main.html',
    css: {
        extract: env !== 'development' // css拆分ExtractTextPlugin插件，默认true - 骨架屏需要为true
    },
    devServer: {
        // host: '10.101.34.42',
        // port: 8080,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://tms.qa.ly.com/',
                // target: 'http://10.101.34.31:8010/',
                // target: 'http://10.101.32.18:8010/',
                // target: 'http://10.101.34.20:8010/',
                changeOrigin: true
            }
        },
        before(app) {
            app.get('/minPriceCalendar', (req, res) => {
                res.json({
                    errCode: 200,
                    data: { 'errCode': 'EC_ALL_00000', 'body': { '2019-07-09': 0.80, '2019-07-10': 2.00, '2019-07-11': 2.00, '2019-07-12': 2.00 }, 'success': true }
                })
            }),
            app.get('/page', (req, res) => {
                res.json({
                    errCode: 200,
                    data: {
                        'code': 'string',
                        'data': {
                            'endRow': 0,
                            'hasNextPage': true,
                            'hasPreviousPage': true,
                            'isFirstPage': true,
                            'isLastPage': true,
                            'list': [
                                {
                                    'afterDay': 0,
                                    'couponBatch': 'string',
                                    'couponDesc': 'string',
                                    'couponName': 'string',
                                    'couponType': 0,
                                    'createTime': '2019-10-16T02:04:58.147Z',
                                    'createUserId': 0,
                                    'discount': 0,
                                    'discountCondition': 0,
                                    'effectDay': 0,
                                    'effectEndDate': '2019-10-16T02:04:58.147Z',
                                    'effectStartDate': '2019-10-16T02:04:58.147Z',
                                    'effectWay': 0,
                                    'enableStatus': 0,
                                    'exemptionCondition': 0,
                                    'exemptionFee': 0,
                                    'id': 0,
                                    'inventory': 0,
                                    'lineId': 0,
                                    'status': 0,
                                    'updateTime': '2019-10-16T02:04:58.147Z',
                                    'updateUserId': 0,
                                    'vcode': 'string'
                                }
                            ],
                            'navigateFirstPage': 0,
                            'navigateLastPage': 0,
                            'navigatePages': 0,
                            'navigatepageNums': [
                                0
                            ],
                            'nextPage': 0,
                            'pageNum': 0,
                            'pageSize': 0,
                            'pages': 0,
                            'prePage': 0,
                            'size': 0,
                            'startRow': 0,
                            'total': 0
                        },
                        'msg': 'string',
                        'success': false
                    }
                })
            })
        }
    },
    chainWebpack: config => {},
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, './monitor.jsp'),
                to: path.resolve(__dirname, './dist')
            }])
        ]
    }
}
