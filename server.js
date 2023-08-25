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

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});


