//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
  "Welcome to Daily Journal — your personal space to write, share, and explore stories. Whether it’s a life experience, a creative idea, or a moment of inspiration, start capturing your thoughts today. Just give your post a title, write what’s on your mind, and share it with the world. Every voice matters, and every story counts.";
const aboutContent =
  "Daily Journal is more than just a blogging site — it's a community built on words, ideas, and creativity. We believe that everyone has a story to tell, a thought worth sharing, and a voice that matters. Whether you're journaling your day, writing essays, or sharing inspiration, this is your space to do it all. Simple. Free. Powerful.";
const contactContent =
  "Got a question, suggestion, or just want to say hello? We'd love to hear from you! Reach out anytime — we're here to help and happy to connect.";
const blogCompose =
  "This is your canvas — start with a title, then let your thoughts flow. Whether it’s a story, an idea, or a personal experience, your post begins here. Create with confidence and share what matters most to you.";
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://admin-blog-suraj:Test123@cluster0.6v2be78.mongodb.net/postDB"
);

const postSchema = new mongoose.Schema({
  name: String,
  content: String,
});
const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  name: "Home",
  content: homeStartingContent,
});
const defaultPosts = [post1];

// Post.insertMany(defaultPosts).then((foundPosts) => {
//   console.log(`Items inserted into DB, ${foundPosts} `);
// });

app.get("/", (req, res) => {
  Post.find({}).then((foundPosts) => {
    if (foundPosts.length === 0) {
      Post.insertMany(defaultPosts).then(() => {
        console.log(`Items inserted into DB!`);
        res.redirect("/");
      });
    } else {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: foundPosts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.post("/compose", (req, res) => {
  const post = new Post({
    name: req.body.postTitle,
    content: req.body.postBody,
  });

  post
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Failed to save post.");
    });
});
app.get("/post/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }).then((post) => {
    res.render("post", { postTitle: post.name, postBody: post.content });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server started on port: ${port}`);
});
