import express from 'express';
import bodyParser from 'body-parser';
const app = express()

const port = 3355;

// middleware
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

// Store all users post
const post = [];

app.get('/', (req, res) => {
  res.render("index.ejs", { allBlogPost: post })
});

// post route
app.post("/newblog", (req, res) => {
  const { title, content } = req.body;

  const postDate = new Date().toLocaleDateString();
  const postTime = new Date().toLocaleTimeString();

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const newPost = {
    id: Date.now(),
    heading: title,
    postContent: content,
    dateOfPost: postDate,
    timeOfPost: postTime
  };

  post.push(newPost);

  return res.status(201).json({ message: "Post created", allBlogPost: newPost });
});


// PUT route for editing posts
app.put("/updateblog/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const postIndex = post.findIndex(p => p.id === Number(id));
  
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  // Update the post
  post[postIndex] = {
    ...post[postIndex],
    heading: title,
    postContent: content,
    timeOfPost: new Date().toLocaleTimeString(), 
    dateOfPost: new Date().toLocaleDateString()
  };

  return res.json({ 
    success: true, 
    updatedPost: post[postIndex] 
  });
});

// Delete route for deleting post
app.delete("/deleteblog/:id", (req, res) => {
  const { id } = req.params;
  const postIndex = post.findIndex(p => p.id === Number(id));
  
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  post.splice(postIndex, 1);
  return res.json({ success: true, message: "Post deleted successfully." });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});