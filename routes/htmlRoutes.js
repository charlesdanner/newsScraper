var db = require("../models");

module.exports = app => {
    app.get("/", (req, res) => {
        db.Article.find({ saved: false }).sort({ _id: -1 })
            .then(dbArticle => {
                res.render("articles", { article: dbArticle })
            })
    })

    app.get("/saved", (req, res) => {
        db.Article.find({ saved: true }).then(dbArticle => {
            res.render("saved", { article: dbArticle })
        })
    })
}