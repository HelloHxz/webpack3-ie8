const path = require('path');
const webpack = require('webpack');
var fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var useIE8 = true;
module.exports = function(env) {
  const appList = {
    mobile: {
      html: true,
      path: "./src/entry/mobile/index.js"
    },
    pc: {
      html: true,
      path: "./src/entry/pc/index.js"
    },
  };
  const nodeEnv = env.env || 'development';
  const action = env.action || 'start';
  const isBuild = action === 'build';
  var plugins = [];
  var entryAndHtmlPlugin = getEntryAndHtmlPlugin(appList, isBuild);
  var entry = entryAndHtmlPlugin.entry;
  if (!useIE8) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  if (isBuild) {
    rmdirSync('./dist');
    if(useIE8) {
      plugins.push(new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          output: {
            comments: false,
            beautify: false
          },
          warnings: false
        }
      }));
    }
  } else {
    const openurl = env.openurl || '';
    if (openurl.length > 0) {
      plugins.push(new OpenBrowserPlugin({
        url: openurl
      }));
    }
  }
  plugins = plugins.concat(entryAndHtmlPlugin.htmlplugins);

  return {
    entry: entry,
    output: {
      filename: '[name].[chunkhash:8].js',
      chunkFilename: isBuild ? '[name].[chunkhash:8].min.js' : '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: isBuild ? './': '/'
    },
    devServer: {
      hot: !useIE8,
      inline: !useIE8
    },
    plugins: plugins,
    devtool: isBuild ? 'cheap-module-source-map': 'cheap-module-eval-source-map',
    module: {
      rules: [{
        test: /\.js$/,
        include: [path.resolve(__dirname, "src"),],
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              "es2015",
              "stage-3"
            ],
            "plugins": [
              "syntax-dynamic-import",
              "transform-class-properties",
              "transform-runtime"]
          }
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        loader: 'url-loader?limit=6144&name=imgs/[path][name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.css$/,
        use: ['style-loader', {
          loader: "css-loader",
        },
        {
          loader: "postcss-loader",
          options: {
            plugins: (loader) => [require('postcss-import')({
              root: loader.resourcePath
            }), require('autoprefixer')(), ]
          }
        }],
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true
          }
        }]
      },
      {
        test: require.resolve('jquery'),
        use: [{
           loader: 'expose-loader',
           options: 'jQuery'
        },{
           loader: 'expose-loader',
           options: '$'
        }]
      },
      {
        test: /\.js$/,
        enforce: "post",
        loader: "es3ify-loader"
      }]
    }
  };
};


var rmdirSync = (function() {
  function iterator(url, dirs) {
    var stat = fs.statSync(url);
    if (stat.isDirectory()) {
      dirs.unshift(url); //收集目录
      inner(url, dirs);
    } else if (stat.isFile()) {
      fs.unlinkSync(url); //直接删除文件
    }
  }
  function inner(path, dirs) {
    var arr = fs.readdirSync(path);
    for (var i = 0,
    el; el = arr[i++];) {
      iterator(path + "/" + el, dirs);
    }
  }
  return function(dir, cb) {
    cb = cb ||
    function() {};
    var dirs = [];

    try {
      iterator(dir, dirs);
      for (var i = 0,
      el; el = dirs[i++];) {
        fs.rmdirSync(el); //一次性删除所有收集到的目录
      }
      cb()
    } catch(e) { //如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
      e.code === "ENOENT" ? cb() : cb(e);
    }
  }
})();

function getEntryAndHtmlPlugin(siteMaps, isBuild) {
  var re = {
    entry: {},
    htmlplugins: []
  };

  for (var siteName in siteMaps) {
    var sitInfo = siteMaps[siteName];
    // "es5-shim", "es5-shim/es5-sham",
    re.entry[siteName] = ["babel-polyfill", sitInfo.path]; //js多入口字典对象
    if (sitInfo.html) {
      re.htmlplugins.push(new HtmlWebpackPlugin({
        // 正常的：filename: siteName+'.html', //打包出来的html名字
        filename: (siteName) + '.html',
        //打包出来的html名字
        template: './src/entry/' + siteName + '/index.html',
        //模版路径
        inject: 'body',
        chunks: [siteName],
        //js注入的名字
        hash: true
      }));
    }
  }
  return re;
}