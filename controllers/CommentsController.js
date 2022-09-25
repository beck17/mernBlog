import Comment from '../models/Comment.js'
import Post from '../models/Post.js'

export const createComment = async (req,res) => {
    try{
        const { comment } = req.body
        const postId = req.params.id

        if (!comment) {
            return res.status(400).json({message: "Комментарий не может быть пустым"})
        }

        const newComment = new Comment({
            postId,
            comment,
            author: req.userId,
        })
        await newComment.save()

        try{
            await Post.findByIdAndUpdate(postId, {
                $push: {
                    comments: newComment._id
                }
            })
        }catch (e) {
            console.log(e)
            res.json({
                message: "Не удалось создать новый комментарий"
            })
        }
        res.json(newComment)
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}

export const getLastComments = async (req,res) => {
    try {
        const comments = await Comment.find().populate('author').sort({$natural:-1}).limit(5).exec()
        console.log(comments)

        const lastComments = comments.map(obj => obj).flat().slice(-5)

        res.json(lastComments)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}

export const commentsOnPost = async (req,res) => {
    try{
        const postId = req.params.id

        const comments = await Comment.find({postId: postId}).populate('author').exec()

        res.json(comments)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить комментарии к посту'
        })
    }
}