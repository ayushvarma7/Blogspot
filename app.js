

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require("mongoose");
//connecting to a mongo client
mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true, useUnifiedTopology:true});

const homeStartingContent = "So I have started this project with an aim to make a blogspot page for my users where they can write their opinions and publish them. Obviously not to incite other people. I aim to be a better programmer by the end of the year and I am in the middle of it to be honest. But I'll try to work hard and let's see how it goes out?";
const aboutContent = "Hi, this is me, Ayush Varma. A student who enjoys coding but certainly not more than playing football and eating. I am currently enjoying what I'm learning right now and hope to build some amazing things in the near future. Hope to see you guys on the other side!";
const contactContent = "You can contact me on various social media platforms naming a few: Instagram, Facebook.   ";

const app = express();

const postSchema=new mongoose.Schema({
  title: String,
  content:String,
});// creating a schema according to which post data will be made

const Post= mongoose.model("Post", postSchema); //creating a model

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){
  //whenever it is at home it should search for all the posts present in DB
  Post.find({}, function(error, responseDocuments){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: responseDocuments  //responseDocument contains the response of the post.find()
      });
  });
 
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post =new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if(!err)
    res.redirect("/");
  }); // saving the post data and redirecting when no errors

 

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
   
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
