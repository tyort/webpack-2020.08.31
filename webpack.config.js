const path = require(`path`)
const HTMLWebpackPlugin = require(`html-webpack-plugin`)
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development' // получаем boolean
const isProd = !isDev

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: `development`,
  entry: {
    main: `./index.js`,
    analytics: './analytics.js'
  },
  output: {
    filename: `[name].[contenthash].js`,
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
  optimization: { // в dist создаются файлы vendor помогает не загружать два раза, например, библиотеку jquery, если она подключена в двух файлах
    splitChunks: {
      chunks: `all`
    }
  },
  devServer: {
    port: 4200,
    hot: isDev // позволяет обновлять отдельные модули страницы, без её полной перезагрузки только в случае isDev === true
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({ // копирование статических файлов
      patterns: [
          {
              from: path.resolve(__dirname, 'src/favicon.ico'),
              to: path.resolve(__dirname, 'dist')
          }
      ]
    }),
    new MiniCssExtractPlugin({ // складывает стили css в отдельный файл
      filename: `[name].[contenthash].css`
    })
  ],
  module: { // добавляем лоадеры, чтобы webpack работал с другими файлами, как с модулями js
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev, // изменяем сущности без перезагрузки страницы только в случае isDev === true
              reloadAll: true
            },
          },
          `css-loader`
        ]
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
      }
    ]
  }
}
