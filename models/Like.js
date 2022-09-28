import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    }, {timestamps: true}
)

export default mongoose.model('Like', LikeSchema)