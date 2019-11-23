const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String, 
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            type: Schema.Types.String,
            ref:"Comment"
        }
    ]
})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article