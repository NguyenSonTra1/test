var mongoose = require("mongoose");
var Dishes = require("../model/dishes")

module.exports = function (app){
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
        res.json({dishes:dishes})
    })
    app.get('/',(req,res)=>{
        res.send("ok, this is the main page!")
    })
}