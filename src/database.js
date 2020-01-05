const mongoose = require('mongoose')

const { database } = require('./keys')

mongoose.connect(database.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('connected to db'))
    .catch(err => console.error(err))