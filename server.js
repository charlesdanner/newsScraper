const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars")
const logger = require("morgan")

const db = require("./models")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/", (req, res) => {
    axios.get("https://www.cbsnews.com/60-minutes/overtime/").then(response => {
        const $ = cheerio.load(response.data);
        const returnArticle = []

        $(".asset-wrapper").each((i, element) => {
            db.Article.find({ title: $(element).children("a").children("h4").text() })
                .then(result => {
                    if (result.length === 0) {
                        const renderedArticle = {
                            title: $(element).children("a").children("h4").text(),
                            summary: $(element).children("p").text(),
                            link: "https://www.cbsnews.com" + $(element).children("a").attr("href")
                        }
                        returnArticle.push(renderedArticle)
                    }
                })
        });
        res.render("articles", { article: returnArticle })
    });
})

app.post("/api/save", (req, res) => {
    db.Article.create({
        title: req.body.title,
        link: req.body.link,
        summary: req.body.summary
    }).then(res.json({ complete: true }))
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
            return db.Article.findOneAndUpdate({ title: req.body.article }, {$push: { comments: dbComment.body }}, { new: true });
        })
        .then(dbArticle => {
            dbArticle.populate("comments")
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
})

app.post("/api/delete", (req, res) => {
    console.log(req.body)
    db.Article.remove({
        title: req.body.title
    }).then(res.json({ deleted: true }))
        .catch(err => console.log(err))
})

app.get("/scrape", (req, res) => {

})

app.get("/saved", (req, res) => {
    db.Article.find().then(dbArticle => {
        res.render("saved", { article: dbArticle })
    })
})

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));