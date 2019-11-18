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

app.get("/scrape", (req, res) => {
    axios.get("https://www.cbsnews.com/60-minutes/overtime/").then(response => {
        const $ = cheerio.load(response.data);

        $(".asset-wrapper").each((i, element) => {
            result = {};
            result.title = $(element).children("a").children("h4").text();
            console.log(`Title ${i}: ${result.title}`)
            result.summary = $(element).children("p").text();
            result.link = $(element).children("a").attr("href");
            console.log(result)

            // db.Article.create(result).then(dbArticle => {
            //     console.log(dbArticle)
            // })
            // .catch(err => console.log(err));
        })
    })

    res.json({scrape: "complete"});
})



app.listen(PORT, () => console.log(`App running on port ${PORT}!`));

