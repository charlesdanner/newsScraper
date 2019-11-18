const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars")

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
    db.Article.find()
    .then(dbArticles => {
        res.render("articles", {article: dbArticles})
    })
})

app.get("/scrape", (req, res) => {
    axios.get("https://www.cbsnews.com/60-minutes/overtime/").then(response => {
        const $ = cheerio.load(response.data);

        $(".asset-wrapper").each((i, element) => {
            db.Article.create({
                title: $(element).children("a").children("h4").text(),
                summary: $(element).children("p").text(),
                link: "https://www.cbsnews.com/news/" + $(element).children("a").attr("href")
            }).then(dbArticle => {
                res.json({ scrape: "complete" });
            }).catch(err => console.log(err));
        });
    });
})



app.listen(PORT, () => console.log(`App running on port ${PORT}!`));

