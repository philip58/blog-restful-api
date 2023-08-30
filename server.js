import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

const apiUrl = "http://localhost:4000"

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Get home page 
app.get("/", async (req,res)=> {
    try{
        const result = await axios.get(`${apiUrl}/posts`);
        res.render("index.ejs", {blogPosts: result.data, 
        header: "Home Page"});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//get the entry page to create a new blog post
app.get("/postEntry", (req,res)=> {
    res.render("postEntry.ejs", {header: "Create New Post", button: "Submit New Post"});
});

//post a new blog post and redirect to the home page where it is displayed
app.post("/post", async (req,res)=>{
    try{
        const result = await axios.post(`${apiUrl}/posts`,req.body);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//delete a specific post and redirect to home page 
app.get("/delete/:id", async (req,res)=>{
    try{
        const result = await axios.delete(`${apiUrl}/delete/${req.params.id}`);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//render the entry page with the existing post's data for editting
app.get("/post/:id", async (req,res)=>{
    try{
        const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
        console.log(result.data);
        res.render("postEntry.ejs",{
            header: "Edit Existing Post",
            post: result.data,
            button: "Submit Edit(s)"
        });
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//render a single post on the page with its respective comments from the comments array
app.get("/post/comment/:id", async (req,res)=>{
    try{
        const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
        console.log(result.data);
        res.render("post.ejs",{
            header: "View and Comment",
            viewPost: result.data
        });
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//render the entry page to add a new comment under a post
app.get("/comment/:id", async (req,res)=>{
    try{
        const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
        console.log(result.data);
        res.render("postEntry.ejs",{
            header: "Comment On Post",
            viewPost: result.data,
            button: "Submit Comment"
        });
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//patch/edit an existing post with the data in the request and change what was entered
app.post("/patch/:id", async (req,res)=>{
    try{
        const result = await axios.patch(`${apiUrl}/patch/${req.params.id}`,req.body);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});

//post a new comment under a blog post 
app.post("/comment/:id", async (req,res)=>{
    try{
        const result = await axios.post(`${apiUrl}/comment/${req.params.id}`,req.body);
        console.log(result.data);
        res.redirect(`/post/comment/${req.params.id}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//delete a comment from a post 
app.get("/delete/comment/:id/:commentId", async (req,res)=>{
    try{
        const result = await axios.delete(`${apiUrl}/delete/comment/${req.params.id}/${req.params.commentId}`);
        console.log(result.data);
        res.redirect(`/post/comment/${req.params.id}`);
    } catch (error) {
        res.status(500).send(error.message);
    };
});

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});


