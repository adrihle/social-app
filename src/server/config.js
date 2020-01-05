const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const errorHandler = require('errorhandler')
const exphbs = require('express-handlebars')

const routes = require('../routes')

module.exports = app => {
    //settings
    app.set('port', process.env.PORT || 3000)

    //engine template setting
    app.set('views', path.join(__dirname, '../views'))

    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        partialsDir: path.join(app.get('views'), 'partials'),
        layoutsDir: path.join(app.get('views'), 'layouts'),
        extname: '.hbs',
        helpers: require('./helpers')
    }))

    app.set('view engine', '.hbs')
    
    //middlewares
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
    app.use(cors())
    
    //.single('image) hace referencia al name='image' del input, para almacenar el archivo subido a '../public/upload/temp' 
    app.use(multer({dest: path.join(__dirname, '../public/upload/temp')}).single('image'))

    //routes
    routes(app)

    //static files
    app.use('/public', express.static(path.join(__dirname, '../public')))

    //error handling
    if ('development' === app.get('env')) return app.use(errorHandler())

    return app
}