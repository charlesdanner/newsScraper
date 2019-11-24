const db = require('../models');
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = app => {
    app.post("/api/save", (req, res) => {
        db.Article.update({ title: req.body.title }, { $set: { saved: true } }).then(res.json({ complete: true }))
            .catch(err => res.json(err))
    });
    
    app.get("/api/article/:title", (req, res) => {
        console.log(req.params.title)
        db.Article.findOne({ title: req.params.title })
            .then(dbArticle => {
                dbArticle.populate("comments")
                console.log(dbArticle)
                res.json(dbArticle.comments)
            })
    })
    
    app.post("/api/article/add-note", (req, res) => {
        console.log(req.body)
        db.Comment.create({
            body: req.body.note
        })
            .then(dbComment => {
                console.log(dbComment)
                return db.Article.findOneAndUpdate({ title: req.body.article }, { $push: { comments: dbComment.body } }, { new: true });
            })
            .then(dbArticle => {
                dbArticle.populate("comments")
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    })
    
    app.post("/api/article/remove-comment", (req, res) => {
        db.Article.findOne({title: req.body.title})
        .then(dbArticle => {
            dbArticle.comments.remove(req.body.comment)
            db.Article.updateOne({title: req.body.title}, {$set:{comments: dbArticle.comments}})
            .then((res.json({removed: true}))) 
        })
        
    })
    
    app.post("/api/delete", (req, res) => {
        console.log(req.body)
        db.Article.remove({
            title: req.body.title
        }).then(res.json({ deleted: true }))
            .catch(err => console.log(err))
    })
    
    app.get("/api/scrape", (req, res) => {
        const scrapedArticles = [];
    
        axios.get("https://www.cbsnews.com/60-minutes/overtime/").then(response => {
            const $ = cheerio.load(response.data);
            $(".asset-wrapper").each((i, element) => {
                scrapedArticles.push(
                    {
                        title: $(element).children("a").children("h4").text(),
                        summary: $(element).children("p").text(),
                        link: "https://www.cbsnews.com" + $(element).children("a").attr("href")
                    })
            });
            res.json({ articles: scrapedArticles })
            db.Article.insertMany(scrapedArticles)
            .catch(err => err)
        })
    })


}