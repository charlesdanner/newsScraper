# Web Scraper - [60 Minutes News Scraper](https://sixtyminutesscraper.herokuapp.com/)

## Introduction
This web application utilizes an express server and various node modules to scrape the 60 minutes website and display different articles to the client. Clients can save articles and then post various notes to the comments they've saved. There is no log in function or user authentication. All clients can see all notes as well as delete notes made by other users.

## Authors

- Charles Danner - [GitHub Profile](https://github.com/charlesdanner)

## Technologies Used
- node.js
- Mongo DB
- Mongoose.js
- cheerio npm
- express npm
- express-handlebars npm
- BootStrap
- JQuery
- Ajax

## How it works!

When a user visits the home page, the Express server sends a get request to the 60 minutes website. When the response from 60 minutes comes back, the html is parsed using the node module Cheerio and the information is packaged into objects. Each article that is sent to the Express server has a corresponding object that stores the article's title, summary and link to the article. The objects are stored in an array and the Express server uses this information in conjunction with Express-Handlebars to render the webpage for our client. What the client sees is a list of articles and a slick web page.

Each article is saved into a Mongo database. This allows the server to keep track of which articles have comments and which the clients want to save for adding notes to. All of the different HTTP requests are being sent through Ajax, and Express is handling the requests. 
