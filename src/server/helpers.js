const moment = require('moment')
const helpers = {}


helpers.timeago = tiemstamp => {
    return moment(tiemstamp).startOf('minute').fromNow()
}

module.exports = helpers