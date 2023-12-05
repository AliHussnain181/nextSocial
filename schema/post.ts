import mongoose from "mongoose";



const postSchema = new mongoose.Schema({

    caption: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model("Post", postSchema)

export default Post