'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //设置反向代理 在开发环境使用本地服务查询ajax的数据
    proxyTable: {
      // //获取推荐页面信息
      // '/getRecommend': {
      //   target: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
      //   changeOrigin: true,//更改源使之可以跨域
      //   pathRewrite: {
      //     '^/getRecommend': ""//相当于一个正则，将url中key的部分替换成value
      //   }
      // },
      // //获取歌手信息
      // '/getSinger': {
      //   target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      //   changeOrigin: true,
      //   bypass: function (req, res, proxyOptions) {
      //     req.headers.referer = 'https://y.qq.com/portal/singer_list.html'
      //     // req.headers.host = 'music.163.com'
      //   },
      //   pathRewrite: {
      //     '^/getSinger': ""
      //   }
      // },
      // '/getMusicVkey': {
      //   target: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
      //   changeOrigin: true,
      //   bypass: function (req, res, proxyOptions) {
      //     req.headers.referer = 'https://c.y.qq.com/'
      //     req.headers.host = 'c.y.qq.com'
      //   },
      //   pathRewrite: {
      //     '^/getMusicVkey': ""
      //   }
      // },
      //获得歌词
      '/getLyric': {
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/portal/player.html'
          req.headers.host = 'c.y.qq.com'
        },
        pathRewrite: {
          '^/getLyric': ""
        }
      },
      //获得推荐歌单
      '/getRecommendSonglist': {
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/'
          req.headers.host = 'c.y.qq.com'
        },
        pathRewrite: {
          '^/getRecommendSonglist': ""
        }
      },

      //推荐页歌单的歌曲列表
      '/getSongListByDiscId': {
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/w/taoge.html'
          req.headers.host = 'c.y.qq.com'
        },
        pathRewrite: {
          '^/getSongListByDiscId': ""
        }
      },

      //获取排行榜数据
      "/getRankData": {
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/m/index.html'
          req.headers.host = 'c.y.qq.com'
          // req.headers.host = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/getRankData': ""
        },
      },

      //获取具体排行榜歌单数据
      "/getTopListData": {
        target: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/w/toplist.html'
          req.headers.host = 'c.y.qq.com'
          // req.headers.host = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/getTopListData': ""
        },
      },

      //获取搜索页热门搜索词条
      "/getHotKeys": {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/m/index.html'
          req.headers.host = 'c.y.qq.com'
          // req.headers.host = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/getHotKeys': ""
        }
      },

      //获取搜索页搜索结果
      "/getSearchData": {
        target: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
        changeOrigin: true,
        bypass: function (req, res, proxyOptions) {
          req.headers.referer = 'https://y.qq.com/m/index.html'
          req.headers.host = 'c.y.qq.com'
          // req.headers.host = 'https://y.qq.com'
        },
        pathRewrite: {
          '^/getSearchData': ""
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
