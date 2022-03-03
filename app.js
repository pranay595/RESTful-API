const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB");

app.use(express.static(__dirname+"/public"));

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("articles",articleSchema);

app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,foundArticle)=>{
        if(err)
        throw(err)
        else{
            console.log(foundArticle);
            res.send(foundArticle);
        }
    })
})
.post((req,res)=>{
    const requestedTitle =  req.body.title;
    const requestedContent =req.body.content;
    const article = new Article({
        title: requestedTitle,
        content: requestedContent
     })
    article.save();
    res.send("Successfully Posted");
})
.delete((req,res)=>{
    Article.deleteMany({title:"jQuery"},(err)=>{
        if(err)
        throw(err)
        else{
            res.send("Deleted successfully!");
        }
    })
})

app.route("/articles/:title")
.get((req,res)=>{
    const artcleTitle = req.params.title;
    Article.findOne({title:artcleTitle},(err,result)=>{
        if(err)
        throw(err)
        else{
            res.send(result)
        }
    })
})
.put((req,res)=>{
    Article.replaceOne({title: req.params.title},
        {title:req.body.title, content:req.body.content},
        (err)=>{
            if(err)
            throw(err)
            else
            res.send("Successfully updated through put request!")
        })
}).patch((req,res)=>{
    Article.updateOne({title:req.params.title},
        {$set: req.body},
        (err)=>{
            if(err)
            throw(err)
            else{
                res.send("Updated Successfully through patch!");
            }
        })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.title},(err)=>{
        if(err)
        throw(err)
        else
        res.send("SUccessfully deleted!")
    })
});

app.listen(PORT, ()=>{
    console.log("Server is running on port: "+PORT);
});