import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"

const app = express();
const port = 4000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

//Connect database
mongoose.connect(`${process.env.MONGO_URI}`);

//create mongoose comment schema
const commentSchema = {
    title: String,
    content: String,
    author: String,
    date: String,
    postId: String
};

//Creat mongoose post schema
const postSchema = {
    title: String,
    content: String,
    author: String,
    date: String,
    comments: [commentSchema]
};

//Create mongoose post model
const Post = mongoose.model("Post",postSchema);

//Create mongoose comment model
const Comment = mongoose.model("Comment",commentSchema);

//Send all posts from database to server, if empty put in placeholder post
app.get("/posts", (req,res)=> {
    Post.find().then((blogPosts)=>{
        if(blogPosts.length===0){
            const blogPost1 = new Post ({
                title: "Blog Post 1",
                content: "This is the first blog post.",
                author: "Post 1 Author",
                date: new Date().toLocaleDateString(),
                comments: []
            });
            blogPost1.save();
        }
        res.json(blogPosts);
    }).catch((err)=>{
        console.log(err);
    });
});

//get a specific post from database 
app.get("/posts/:id", (req,res)=> {
    Post.findById({_id: req.params.id}).then((blogPost)=>{
        res.json(blogPost);
    }).catch((err)=>{
        console.log(err);
    });
});

//post a new blog post to database
app.post("/posts", (req,res)=> {
    const newPost = new Post ({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toLocaleDateString()
    });

    newPost.save().then(()=>{
        console.log("New post posted");
        res.json(newPost);
    }).catch((err)=>{
        console.log(err);
    });
    
});

//delete a post from database
app.delete("/delete/:id", (req,res)=> {
    Post.deleteOne({_id: req.params.id}).then(()=>{
        console.log("Post deleted.");
    }).catch((err)=>{
        console.log(err);
    });
    res.json({message: `Post of id: ${req.params.id} has been deleted.`});
});

//edit a post and keep existing data intact if not modified
app.patch("/patch/:id", (req,res)=>{
    Post.findByIdAndUpdate({_id: req.params.id}).then((updatedPost)=>{
        if(req.body.title){
            updatedPost.title = req.body.title;
        } 
        if(req.body.content){
            updatedPost.content = req.body.content;
        } 
        if (req.body.author){
            updatedPost.author = req.body.author;
        } 
        updatedPost.save().then(()=>{
            console.log("Post updated.");
            res.json(updatedPost);
        }).catch((err)=>{
            console.log(err);
        });
    }).catch((err)=>{
        console.log(err);
    });
});

//post a new comment to the database under a post which hold the comment in an array 
app.post("/comment/:id", (req,res)=>{
    const newComment = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date().toLocaleDateString()
    };

    Post.findById({_id: req.params.id}).then((foundPost)=>{
        newComment.postId = foundPost._id;
        foundPost.comments.push(newComment);
        foundPost.save();
        res.json(newComment);
    }).catch((err)=>{
        console.log(err);
    });

});

//delete a comment from the post's array and from the database
app.delete("/delete/comment/:id/:commentId", (req,res)=> {
    Post.updateOne({_id: req.params.id},{$pull: {comments: {_id: req.params.commentId}}}).then(()=>{
        res.json({message: `Comment of id: ${req.params.commentId} has been deleted.`});
    }).catch((err)=>{
        console.log(err);
    });
});

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
