const express = require("express");
const mongoose = require("mongoose");
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

require('./routes/apiRoutes')(app)
require('./routes/htmlRoutes')(app)

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => console.log(`App running on port ${PORT}!`));