import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id

        const doc = new Like({
            postId,
            author: req.userId
        })

        const like = await doc.save()

        try {
            await Post.findByIdAndUpdate(postId, {
                $push: {
                    likes: like._id
                }
            })
        } catch (e) {
            console.log(e)
            res.json({
                message: "Не удалось поставить лайк"
            })
        }

        res.json(like)

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось поставить лайк'
        })
    }
}

export const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id

        const like = await Like.findOne({postId: postId})

        try {
            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: like._id
                }
            })
        } catch (e) {
            console.log(e)
            res.json({
                message: "Не удалось поставить дизлайк"
            })
        }

        Like.findOneAndRemove({
            postId
        }, async (err, doc) => {

            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }

            const likes = await Like.find()

            res.json(likes)
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось поставить дизлайк'
        })
    }
}

export const getLikesOnPost = async (req, res) => {
    try {
        const postId = req.params.id

        const like = await Like.find({postId})

        res.json(like)
    } catch (e) {
        console.log(e)
        res.json({
            message: "Не удалось получить лайки на пост"
        })
    }
}