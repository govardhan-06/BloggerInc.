import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app=express();
const port=3000;
const __dirname=dirname(fileURLToPath(import.meta.url));

app.use("/public",express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
 
var post_content=[];  //entire blog content by user
var ops_message=false; //variable for the message box based on this, success or failure message are printed

//Loading the Signup Page
app.get("/",(req,res)=>{
    res.render(__dirname+"/signup.ejs");
});
//Home Page
app.post("/home",(req,res)=>{
    res.render(__dirname+"/index.ejs");
});

//Menu option
app.post("/options",(req,res)=>{
    res.render(__dirname+"/post_"+req.body.button+".ejs",{p_content:post_content});
});

//Post Creation
app.post("/post_create",(req,res)=>{
    post_content.push(req.body);
    ops_message=true;
    res.render(__dirname+"/message.ejs",{ops:ops_message});
});

//Edit Post
//Fetching the post details and passing it to the edit_view
var alter_index=0;
app.post("/edit",(req,res)=>{
    for(var i=0;i<post_content.length;i++){
        if(req.body["index"]===post_content[i]["content"]){ 
            alter_index=i;   
            res.render(__dirname+"/post_edit_view.ejs",{t:post_content[i]["title"],c:post_content[i]["content"]});
            break;
    }
    }
    
})

//making the changes reflect the main post_content variable
app.post("/edit_post",(req,res)=>{
    post_content[alter_index]=req.body;
    console.log(req.body);
    ops_message=true;
    res.render(__dirname+"/message.ejs",{ops:ops_message});
})

//Delete Post
app.post("/delete",(req,res)=>{
    var c=0;
    for(var i=0;i<post_content.length;i++){
        if(req.body["title"]===post_content[i]["content"]){  //checking for matching content between request body and post_content varaiable
            post_content.splice(i,1);
            c=1;
            break;
        }
    }
    ops_message=(c===1)?true:false;
    res.render(__dirname+"/message.ejs",{ops:ops_message});
});

//Port listening
app.listen(port,()=>{
    console.log(`Server started running on port ${port}`);
});