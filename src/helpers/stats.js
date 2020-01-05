const { image, comment } = require('../models')

const imageCounter = async () => {
    return await image.countDocuments()
}

const commentsCounter = async () => {
    return await comment.countDocuments()
}

const imageTotalViewCounter = async () => {
    const res = await image.aggregate([{
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
    }])
    if (res.length !== 0){
        return res[0].viewsTotal
    }else{
        return 0
    }
}

const likesTotalCounter = async () => {
    const res = await image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes'}
        }
    }])
    if (res.length !== 0){
        return res[0].likesTotal
    }else {
        return 0
    }
}

module.exports = async () => {
    const res = await Promise.all([imageCounter(), commentsCounter(), imageTotalViewCounter(), likesTotalCounter()])

    return {
        images: res[0],
        comments: res[1],
        views: res[2],
        likes: res[3]
    }
}