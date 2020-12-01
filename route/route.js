var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
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
            var file = files.image.path.split("\\")[1];
            const urlimage = `https://androidapp-reservation.herokuapp.com/open_image?image_name=${file}`;
            console.log(urlimage)
        const name = fields.name;
        const image = urlimage;
        const category = fields.category;
        const label = fields.label;
        const price = fields.price;
        const featured = fields. featured;
        const description = fields. description;
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

    // REGISTER
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

    //LOGIN
    app.post("/login",async (req,res)=>{
        var Email = req.body.email;
        var PassWord = req.body.password;
        var user = await Users.find({"local.email":Email})
        if(user==""){
            res.json({success:0})
        }
        else{
            var compare = bcrypt.compareSync(PassWord,user[0].local.password)
            if(compare==false){
                res.json({success:2})
            }
            if(compare==true){
                res.json({success:1,user:user})
            }
        }

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