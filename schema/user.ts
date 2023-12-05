import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "password is loger than 6"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    friendRequests: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
        },
    ],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },

}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User