var mongoose = require("mongoose");
var Dishes = require("../model/dishes")
var Users = require("../model/users")

module.exports = function (app){
    //DISHES
    app.post("/upload_dishes",(req,res)=>{
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
    app.get("/dishes",async(req,res)=>{
        const dishes = await Dishes.find({})
        //res.send("This is a page to collect data about dishes!");
        res.json(dishes)
    })

    // USER
    app.post("/signup",async (req,res)=>{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        var user = await Users.find({"local.email":email})
        if(user=="[]"){
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
    app.get('/signup',(req,res)=>{
        res.send("signup page!dasdasdas")
    })

    app.get('/',(req,res)=>{
        res.send("ok, this is the main page!")
    })
}