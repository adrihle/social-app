const Stats = require('./stats')
const Images = require('./images')
const Comments = require('./comments')

module.exports = async viewModel => {
    const res = await Promise.all([
        Images.popular(),
        Stats(),
        Comments.newest()
    ])
    viewModel.sidebar = {
        stats: res[1],
        popularImages: res[0],
        newestComments: res[2]
    }
    return viewModel
}