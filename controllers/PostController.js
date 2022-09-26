import Post from '../models/Post.js'

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').sort({$natural:-1}).exec()

        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getAllPopulate = async (req,res) => {
    try{
        const posts = await Post.find().populate('user').sort({viewsCount: -1}).exec()

        res.json(posts)
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getPostsOnTag = async (req,res) => {
    try{
        const tag = req.params.tag

        const posts = await Post.find({tags: tag}).populate('user').sort({$natural:-1}).exec()

        res.json(posts)
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndUpdate({
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json(doc)
            }
        ).populate('user')
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(", "),
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save()

        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndRemove({
            _id: postId
        }, (err, doc) => {

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

            res.json({
                success: true
            })
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id

        await Post.updateOne({
                _id: postId
            },
            {
                title: req.body.title,
                user: req.body.userId,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
            })

        res.json({
            success: true
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().sort({$natural:-1}).limit(5).exec()

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить тэги'
        })
    }
}

