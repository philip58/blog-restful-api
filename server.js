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
        res.render("index.ejs", {blogPosts: result.data});
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/postEntry", (req,res)=> {
    res.render("postEntry.ejs", {header: "Create New Post", button: "Submit New Post"});
});

app.post("/post", async (req,res)=>{
    try{
        const result = await axios.post(`${apiUrl}/posts`,req.body);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});

app.get("/delete/:id", async (req,res)=>{
    try{
        const result = await axios.delete(`${apiUrl}/delete/${req.params.id}`);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});

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

app.get("/post/comment/:id", async (req,res)=>{
    try{
        const result = await axios.get(`${apiUrl}/posts/${req.params.id}`);
        console.log(result.data);
        res.render("post.ejs",{
            viewPost: result.data
        });
    } catch (error) {
        res.status(500).send(error.message)
    };
});

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

app.post("/patch/:id", async (req,res)=>{
    try{
        const result = await axios.patch(`${apiUrl}/patch/${req.params.id}`,req.body);
        console.log(result.data);
        res.redirect("/");
    } catch (error) {
        res.status(500).send(error.message)
    };
});


app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});


