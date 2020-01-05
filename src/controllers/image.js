const path = require('path')
const { randomName } = require('../helpers/libs')
const { image, comment } = require('../models')
const sidebar = require('../helpers/sidebar')
const fs = require('fs-extra')

const ctrl = {}

ctrl.index = async (req, res) => {
    let viewModel = { image: {}, comment: [] }
    const img = await image.findOne({ filename: { $regex: req.params.image_id } })
    if (img) {
        img.views = img.views + 1
        viewModel.image = img
        await img.save()
        const comments = await comment.find({ image_id: img._id })
        viewModel.comments = comments
        await sidebar(viewModel)
        res.render('image', viewModel)
    }else {
        res.redirect('/')
    }

}

ctrl.create = async (req, res) => {
    const imgUrl = randomName()
    const ext = path.extname(req.file.originalname).toLowerCase()
    const tempPath = req.file.path
    const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`)

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
        await fs.rename(tempPath, targetPath)
        const newImage = new image({
            title: req.body.title,
            description: req.body.description,
            filename: imgUrl + ext,
        })
        const imageSaved = await newImage.save()
        res.redirect('/images/' + imgUrl)
    } else {
        await fs.unlink(tempPath)
        res.status(500).json({ error: 'Only images are allowed' })
    }

}

ctrl.like = async (req, res) => {
    const img = await image.findOne({ filename: req.params.image_id})
    if (img){
        img.likes = img.likes + 1
        await img.save()
        res.json({likes: img.likes})
    }else {
        res.status(500).json({error: 'Internal error'})
    }
}

ctrl.comment = async (req, res) => {
    const img = await image.findOne({ filename: { $regex: req.params.image_id } })
    if (img) {
        const newComment = new comment(req.body)
        newComment.image_id = img._id
        console.log(newComment)
        await newComment.save()
        res.redirect('/images/' + img.uniqueId)
    }else {
        res.redirect('/')
    }
}

ctrl.remove = async (req, res) => {
    const img = await image.findOne({ filename: {$regex: req.params.image_id} })
    if (img){
        await fs.unlink(path.resolve('./src/public/upload/' + img.filename))
        await comment.deleteOne({image_id: img._id})
        await img.remove()
        res.json(true)
        console.log('borrado')
    } else{
        res.json({response: 'bad request.'})
    }
    
}

module.exports = ctrl