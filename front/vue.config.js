module.exports = {
    // project deployment base
    baseUrl:  process.env.NODE_ENV === 'production' ? '/glp/' : '/',

    // where to output built files
    outputDir: 'dist/glp/',

    // where to put static assets (js/css/img/font/...)
    // assetsDir: '',

    // filename for index.html (relative to outputDir)
    indexPath: 'index.html',

    // whether filename will contain hash part
    filenameHashing: true,

    // boolean, use full build?
    runtimeCompiler: false,

    // deps to transpile
    transpileDependencies: [/* string or regex */],

    // sourceMap for production build?
    // productionSourceMap: !process.env.VUE_CLI_TEST,

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    // parallel: hasMultipleCores(),

    // multi-page config
    pages: undefined,

    // <script type="module" crossorigin="use-credentials">
    // #1656, #1867, #2025
    crossorigin: undefined,

    // subresource integrity
    integrity: false,

    css: {
        // extract: true,
        // modules: false,
        // localIdentName: '[name]_[local]_[hash:base64:5]',
        // sourceMap: false,
        // loaderOptions: {}
    },

    // whether to use eslint-loader
    lintOnSave: true,

    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                // target: 'http://192.168.20.9:10081',
                // target: 'http://10.100.111.2:8080',  
                target: 'http://172.16.6.194:8090',                                
                logLevel: 'debug',
                ws: true,
                changeOrigin: true
            }
        }
    }
}