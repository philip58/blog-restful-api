import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 4000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connect database
mongoose.connect("mongodb://127.0.0.1:27017/blogDB");

//Creat mongoose schema
const postSchema = {
    id: Number,
    title: String,
    content: String,
    author: String,
    date: String
}

//Create mongoose model
const Post = mongoose.model("Post",postSchema);

//Send all posts to server, if empty put in placeholder post
app.get("/posts", (req,res)=> {
    Post.find().then((blogPosts)=>{
        if(blogPosts.length===0){
            const blogPost1 = new Post ({
                id: 1,
                title: "Blog Post 1",
                content: "This is the first blog post.",
                author: "Post 1 Author",
                date: new Date().toLocaleDateString()
            });
            blogPost1.save();
        }
        res.json(blogPosts);
    }).catch((err)=>{
        console.log(err);
    });
});


app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
