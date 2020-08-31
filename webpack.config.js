const path = require(`path`)
const HTMLWebpackPlugin = require(`html-webpack-plugin`)
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const isDev = process.env.NODE_ENV === 'development' // получаем boolean
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [ // минимизируем css в режиме production
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev, // изменяем сущности без перезагрузки страницы только в случае isDev === true
        reloadAll: true
      },
    },
    'css-loader' // лоадеры читаются справа-налево (снизу-вверх)
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env' // просто расширяет возможности babel
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties' // расширяет возможности babel даже используя proposal синтаксис
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions()
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ]

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: `development`,
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, `dist`)
  },
  resolve: {
    // понимает расширения файлов, даже если их не прописать
    extensions: ['.js'],
    // оптимизирует запись путей к файлам
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(), // в dist создаются файлы vendor помогает не загружать два раза, например, библиотеку jquery, если она подключена в двух файлах
  devServer: {
    port: 4200,
    hot: isDev // позволяет обновлять отдельные модули страницы, без её полной перезагрузки только в случае isDev === true
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: { // добавляем лоадеры, чтобы webpack работал с другими файлами, как с модулями js
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders(`less-loader`)
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders(`sass-loader`)
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/, // работаем с typescript
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescript')
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }
}
