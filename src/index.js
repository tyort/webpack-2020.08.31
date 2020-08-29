// импортируем все в $
import * as $ from 'jquery'
import Post from '@models/Post'
// import json from './assets/json.json'
// хранение и транспортировка данных
// import xml from './assets/data.xml'
// может быть отрыт программой Microsoft Excel
// import csv from './assets/data.csv'
import WebpackLogo from '@/assets/webpack-logo.png'
import './styles/styles.css'


const post = new Post('Webpack Post Title', WebpackLogo)

$(`pre`).addClass(`code`).html(post.toString())

// console.log('JSON:', json)
// console.log('XML:', xml)
// console.log('CSV:', csv)



