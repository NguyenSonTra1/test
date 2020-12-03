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

module.exports = function (app) {
    //DISHES
    app.post("/upload_dishes", (req, res) => {
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
            const featured = fields.featured;
            const description = fields.description;
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
    app.get("/open_image", function (req, res, next) {
        let imageName = "images/" + req.query.image_name;
        fs.readFile(imageName, function (err, imageData) {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(imageData);
        })
    })
    app.get("/dishes", async (req, res) => {
        const dishes = await Dishes.find({})
        //res.send("This is a page to collect data about dishes!");
        res.json(dishes)
    })

    // REGISTER
    app.post("/register", async (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        var user = await Users.find({ "local.email": email })
        if (user == "") {
            const newUser = new Users();
            newUser.local.name = name;
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            newUser.save();
            res.json({ success: "1" })
        } else {
            res.json({ success: "0" })
        }
    })
    app.get('/register', (req, res) => {
        res.send("signup page!dasdasdas")
    })

    //LOGIN
    app.post("/login", async (req, res) => {
        var Email = req.body.email;
        var PassWord = req.body.password;
        var user = await Users.find({ "local.email": Email })
        if (user == "") {
            res.json({ success: 0 })
        }
        else {
            var compare = bcrypt.compareSync(PassWord, user[0].local.password)
            if (compare == false) {
                res.json({ success: 2 })
            }
            if (compare == true) {
                res.json({ success: 1, user: user })
            }
        }

    })

    //RECCOMMENT
    app.post('/recomment', async (req, res) => {
        var number = req.query.q
        console.log(number)
        var mains = 0;
        var appetizer = 0;
        var dessert = 0;
        var side = 0;
        switch (number) {
            case "1":
                var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }; break;
            case "2":
                console.log("ok")
                var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                } break;
            case "3":
                var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }
                var dish3 = req.body.dish3;
                if (dish3 !== "") {
                    var c = await Dishes.find({ _id: dish3 })
                    if (c !== "") {
                        switch (c[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }; break;
            case "4":
                var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }
                var dish3 = req.body.dish3;
                if (dish3 !== "") {
                    var c = await Dishes.find({ _id: dish3 })
                    if (c !== "") {
                        switch (c[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish4 = req.body.dish4;
                if (dish4 !== "") {
                    var d = await Dishes.find({ _id: dish4 })
                    if (d !== "") {
                        switch (d[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }; break;
            case "5": var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }
                var dish3 = req.body.dish3;
                if (dish3 !== "") {
                    var c = await Dishes.find({ _id: dish3 })
                    if (c !== "") {
                        switch (c[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish4 = req.body.dish4;
                if (dish4 !== "") {
                    var d = await Dishes.find({ _id: dish4 })
                    if (d !== "") {
                        switch (d[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish5 = req.body.dish5;
                if (dish5 !== "") {
                    var e = await Dishes.find({ _id: dish5 })
                    if (e !== "") {
                        switch (e[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }; break;
            case "6": var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }
                var dish3 = req.body.dish3;
                if (dish3 !== "") {
                    var c = await Dishes.find({ _id: dish3 })
                    if (c !== "") {
                        switch (c[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish4 = req.body.dish4;
                if (dish4 !== "") {
                    var d = await Dishes.find({ _id: dish4 })
                    if (d !== "") {
                        switch (d[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish5 = req.body.dish5;
                if (dish5 !== "") {
                    var e = await Dishes.find({ _id: dish5 })
                    if (e !== "") {
                        switch (e[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish6 = req.body.dish6;
                if (dish6 !== "") {
                    var f = await Dishes.find({ _id: dish6 })
                    if (f !== "") {
                        switch (f[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
            case "7": var dish1 = req.body.dish1;
                if (dish1 !== "") {
                    var a = await Dishes.find({ _id: dish1 })
                    switch (a[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                };

                var dish2 = req.body.dish2;
                if (dish2 !== "") {
                    var b = await Dishes.find({ _id: dish2 })
                    switch (b[0].category) {
                        case "mains": mains = 1; break;
                        case "appetizer": appetizer = 1; break;
                        case "dessert": dessert = 1; break;
                        case "side": side = 1; break
                    }
                }
                var dish3 = req.body.dish3;
                if (dish3 !== "") {
                    var c = await Dishes.find({ _id: dish3 })
                    if (c !== "") {
                        switch (c[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish4 = req.body.dish4;
                if (dish4 !== "") {
                    var d = await Dishes.find({ _id: dish4 })
                    if (d !== "") {
                        switch (d[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish5 = req.body.dish5;
                if (dish5 !== "") {
                    var e = await Dishes.find({ _id: dish5 })
                    if (e !== "") {
                        switch (e[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish6 = req.body.dish6;
                if (dish6 !== "") {
                    var f = await Dishes.find({ _id: dish6 })
                    if (f !== "") {
                        switch (f[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }
                var dish7 = req.body.dish7;
                if (dish7 !== "") {
                    var g = await Dishes.find({ _id: dish7 })
                    if (g !== "") {
                        switch (g[0].category) {
                            case "mains": mains = 1; break;
                            case "appetizer": appetizer = 1; break;
                            case "dessert": dessert = 1; break;
                            case "side": side = 1; break
                        }
                    }
                }; break;
        }
        // var sent="";
        // switch(mains){
        //     case 0 :sent = sent+"mains";break;
        //     case 1 : break;
        // }
        // switch(appetizer){
        //     case 0: sent = sent+" appetizer";break;
        //     case 1 : break;
        // }
        // switch(dessert){
        //     case 0: sent = sent+" dessert";break;
        //     case 1 : break;
        // }
        // switch(side){
        //     case 0 : sent = sent+" side";break;
        //     case 1 : break;
        // }
        res.json({mains,appetizer,dessert,side})
    })

    //COMMENT
    app.post("/comments", async (req, res) => {
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
    app.get('/', (req, res) => {
        res.send("ok, this is the main page!")
    })
}