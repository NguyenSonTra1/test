var mongoose = require("mongoose");
var fs = require("fs")
var formidable = require("formidable")
var Dishes = require("../model/dishes")
var Users = require("../model/users")
var Comments = require("../model/comments")
var Feedbacks = require("../model/feedbacks")
var Leader = require("../model/leaders")
var Promotions = require("../model/promotions")

module.exports = function (app){
    //DISHES
    app.post("/upload_dishes",(req,res)=>{
        const form = new formidable.IncomingForm();
        form.uploadDir = "./images";
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, function (err, fields, files) {
            var file = files.avatar.path.split("\\")[1];
            const urlimage = `https://androidapp-reservation.herokuapp.com:8080/open_image?image_name=${file}`;
            console.log(urlimage)
        })
        const name = req.body.name;
        const image = req.body.image;
        const category = req.body.category;
        const label = req.body.label;
        const price = req.body.price;
        const featured = req.body. featured;
        const description = req.body. description;
        const newDishes = new Dishes();
        newDishes.name = name;
        newDishes.image = image;
        newDishes.category = category;
        newDishes.label = label;
        newDishes.price = price;
        newDishes.featured = featured;
        newDishes.description = description;
        newDishes.save()

    })
    app.get('/nst',(req,res)=>{
        res.json("ok")
    })
    app.get("/upload_dishes",(req,res)=>{
       res.render("upload")
    })
    app.get("/open_image", function (req, res, next) {
        let imageName = "images/" + req.query.image_name;
        fs.readFile(imageName, function (err, imageData) {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(imageData);
        })
    })
    app.get("/dishes",async(req,res)=>{
        const dishes = await Dishes.find({})
        //res.send("This is a page to collect data about dishes!");
        res.json(dishes)
    })

    // USER
    app.post("/register",async (req,res)=>{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        var user = await Users.find({"local.email":email})
        if(user==""){
            const newUser = new Users();
            newUser.local.name = name;
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.save();
            res.json({success:"1"})
        }else{
            res.json({success:"0"})
        }
       
        
    })
    app.get('/register',(req,res)=>{
        res.send("signup page!dasdasdas")
    })

    //COMMENT
    app.post("/comments",async (req,res)=>{
        const dishId = req.body.dishId;
        const rating = req.body.rating;
        const comment = req.body.comment;
        const author = req.body.author;
        var newComments = new Comments();
        newComments.dishId = dishId;
        newComments.rating = rating;
        newComments.comment = comment;
        newComments.author = author;
        newComments.save();
        res.send("ok")
       
        
    })
    app.get('/',(req,res)=>{
        res.send("ok, this is the main page!")
    })
}