import Like from "../models/Like.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.userId

        const isLike = await Like.findOne({
            postId,
            author: userId
        })

        if (!isLike) {
            const doc = new Like({
                postId,
                author: userId
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
                    message: "Не удалось добавить лайк в пост"
                })
            }

            try {
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        likedPost: like._id
                    }
                })
            } catch (e) {
                console.log(e)
                res.json({
                    message: "Не удалось добавить лайк в пользователя"
                })
            }
            const allLikes = await Like.find({postId})
            res.json(allLikes)
        } else {


            const like = await Like.findOne({
                postId,
                author: userId
            })

            try {
                await Post.findByIdAndUpdate(postId, {
                    $pull: {
                        likes: like._id
                    }
                })
            } catch (e) {
                console.log(e)
                res.json({
                    message: "Не удалось убрать лайк с поста"
                })
            }

            try {
                await User.findByIdAndUpdate(userId, {
                    $pull: {
                        likedPost: like._id
                    }
                })
            } catch (e) {
                console.log(e)
                res.json({
                    message: "Не удалось убрать лайк с пользователя"
                })
            }

            Like.findOneAndRemove({
                postId,
                author: userId
            }, async (err, doc) => {

                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось удалить лайк '
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Лайк не найден'
                    })
                }

                const allLikes = await Like.find({postId})
                res.json(allLikes)
            })
        }


    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось поставить или убрать лайк '
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