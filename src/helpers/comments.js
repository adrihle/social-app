const { image, comment } = require('../models')

module.exports = {

    async newest(){
        const comments = await comment.find()
            .limit(5)
            .sort({timestamp: -1})

        for (const c of comments){
            const i = await image.findOne({_id: c.image_id})
            c.image = i
        }

        return comments
    }
}