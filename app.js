//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum"
let posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//connect mongoose and add db
mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err) {
  if (err) {
    console.log("error in connecting to mongoose", err);
  } else {
    console.log("successfully connected to mongoose");
  }
});

//create mongo schema and model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


//render home page with content
app.get("/", function(req, res) {
  //find all posts and render them
  Post.find({}, function(err, posts) {
    res.render("home", {
      homeStart: homeStartingContent,
      posts: posts
    });
  });
});

//about page
app.get("/about", function(req, res) {
  res.render("about", {
    aboutStart: aboutContent
  })
});

//contact page
app.get("/contact", function(req, res) {

  res.render("contact", {
    contactStart: contactContent,
  })
});

//compose pge
app.get("/compose", function(req, res) {
  res.render("compose")

});
//handle post request, create document
app.post("/compose", function(req, res) {
  let post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

//save document, acknowledge errors or added document
  post.save((err, result) => console.log("RESULT: ", result, "\nERROR:", err));
  res.redirect("/")
})

//use express params to show post with matching id, as per post.id from hyperlink on home.ejs
app.get("/posts/:postId", function(req, res) {
  let requestedPostId = req.params.postId;
//render the post with matching requested ID
  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {

        title: post.title,

        content: post.content
      })
    };
  });
})

app.get("/post", function(req, res) {
  res.render("post")
})

app.post("/", function(req, res) {

  let post = {
    title: req.body.postTitle,
    text: req.body.postBody,
  };

  posts.push(post);
  res.redirect("/")
})


app.listen(3000 || 27017, function() {
  console.log("Server started");
});
