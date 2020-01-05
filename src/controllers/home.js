const { image } = require('../models')

const sidebar = require('../helpers/sidebar')

const ctrl = {}

ctrl.index = async (req, res) => {
    const images = await image.find().limit(3).sort({timestamp: 1})
    let viewModel = {images: []}
    viewModel.images = images
    viewModel = await sidebar(viewModel)
    console.log(viewModel.sidebar.newestComments)
    res.render('index', viewModel)
}

module.exports = ctrl