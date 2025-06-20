//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
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
const posts = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts,
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
  let post = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody,
  };
  posts.push(post);
  res.redirect("/");
});
app.get("/post/:topic", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.topic);
  posts.forEach(function (post) {
    const storedTitle = _.lowerCase(post.postTitle);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        postTitle: post.postTitle,
        postBody: post.postBody,
      });
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
