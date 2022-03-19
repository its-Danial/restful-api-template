const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// const firstArticle = new Article({
//     title: "DOM",
//     content: "The Document Object Model is like an API for interacting with our HTML"
// })

// firstArticle.save();
/////////////////////////////Targeting All articles ///////////////////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all article!");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////////Targeting A specific articles ///////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No article found with the specified title");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Successfully updated one article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          console.log(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully deleted the article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3001, function () {
  console.log("Server started on port 3001");
});
