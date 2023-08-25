import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { error } from "console";

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

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});


