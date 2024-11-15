const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    category: {
        type: String,
        enum: ["Agriculture", "Business", "Art", "Education", "Entertainement", "Uncategorized", "Wethear", "Investement"]
    },
    description: {
        type: String, 
        required: true
    },
    thumbnail: {
        type: String, 
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId, //bind creator property with user's document id
        ref: "User"
    }
}, {timestamps: true})

const postModel = model("posts", postSchema);
module.exports = postModel