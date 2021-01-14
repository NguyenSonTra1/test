var mongoose = require("mongoose");
var cron = require('node-cron');
var bcrypt = require("bcrypt-nodejs");
var fs = require("fs")
var formidable = require("formidable")
var Dishes = require("../model/dishes")
var Users = require("../model/users")
var Comments = require("../model/comments")
var Feedbacks = require("../model/feedbacks")
var Leader = require("../model/leaders")
var Promotions = require("../model/promotions")
var Tables = require("../model/tables");
var Cart = require("../model/dishesReserve")
var Notification = require("../model/notification")
var Favorite = require("../model/favorite")
const { format } = require("path");
const { findOneAndDelete, findOneAndUpdate, findByIdAndUpdate } = require("../model/tables");
const tables = require("../model/tables");
const { json } = require("body-parser");

module.exports = function (app) {
    //ADD DISHES
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
            res.json("ok")
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
    //DELETE DISHES
    app.post('/delete_dishes/:dishesId', async (req, res) => {
        var dishesId = req.params.dishesId;
        var find = await Dishes.find({ _id: dishesId })
        console.log(find)
        if (find == "") {
            res.json("err")
        } else {
            var dishesDelete = await Dishes.deleteOne({ _id: dishesId })
            res.json("ok")
        }


    })
    //UPDATE DISHES
    app.post("/update_dishes/:dishesId", (req, res) => {
        var dishesId = req.params.dishesId
        const form = new formidable.IncomingForm();
        form.uploadDir = "./images";
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024;
        form.multiples = true;
        form.parse(req, async function (err, fields, files) {
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
            const dishesUpdate = await Dishes.updateOne({ _id: dishesId }, { name: name, image: image, category: category, label: label, price: price, featured: featured, description: description })
            res.json("ok")
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
        var recomMain = [];
        var recomAppetizer = [];
        var recomDessert = [];
        var recomSide = [];
        switch (mains) {
            case 0: var recMain = await Dishes.find({ category: "mains" })
                for (var i = 0; i < recMain.length; i++) {
                    var a = recomMain.push(recMain[i]._id.toString())
                }; break;
            case 1: break;
        }
        switch (appetizer) {
            case 0: var recAppetizer = await Dishes.find({ category: "appetizer" })
                for (var i = 0; i < recAppetizer.length; i++) {
                    var b = recomAppetizer.push(recAppetizer[i]._id.toString());
                }; break;
            case 1: break;
        }
        switch (dessert) {
            case 0: var recDessert = await Dishes.find({ category: "dessert" })
                for (var i = 0; i < recDessert.length; i++) {
                    var c = recomDessert.push(recDessert[i]._id.toString());
                }; break;
            case 1: break;
        }
        switch (side) {
            case 0: var recSide = await Dishes.find({ category: "side" })
                for (var i = 0; i < recSide.length; i++) {
                    var d = recomSide.push(recSide[i]._id.toString());
                }; break;
            case 1: break;
        }

        res.json({ recomMain, recomDessert, recomAppetizer, recomSide })
    })
    //RECCOMMENT2 THEO LOAI
    app.post('/reccomment2/:dishId',async (req,res)=>{
        var dishId = req.params.dishId;
        var dish = await Dishes.find({_id:dishId})
        var cate = dish[0].category
        var dish2 = await Dishes.find({category:cate,_id:{ $ne: dishId  }})
        res.json(dish2)
    })
    //RECCOMMENT3 THEO LICH SU
    app.post('/reccomment3/:userid', async (req,res)=>{
        var userId = req.params.userid
        var dish = await Cart.find({userId:userId,check:1})
        var dishId = [];
        var uniqueArray = []
        for(var i = 0; i<dish.length;i++){
            for(var j=0;j<dish[i].dishesId.length;j++){
                var dis = dish[i].dishesId[j]
                dishId.push(dis)
                 uniqueArray = dishId.filter((item, index, array) => {
                    return array.indexOf(item) === index
                  })
            }
            
        }

        
        res.json(uniqueArray)
    })


    //ADD TABLES
    app.post('/add_tables', (req, res) => {
        var name = req.body.name;
        var category = req.body.category;
        var distinction = req.body.distinction;
        var newTables = new Tables();
        newTables.name = name;
        newTables.category = category;
        newTables.distinction = distinction
        newTables.save();
        res.json("ok")
    })
    //DELETE TABLES
    app.post('/delete_tables/:tableId', async (req, res) => {
        var tableId = req.params.tableId;
        var table = await Tables.find({ _id: tableId })
        if (table == "") {
            res.json("err")
        } else {
            var del = await Tables.findOneAndDelete({ _id: tableId })
            res.json("ok")
        }
    })
    //UPDATE TABLES
    app.post('/update_tables/:tableId', async (req, res) => {
        var tableId = req.params.tableId;
        var name = req.body.name;
        var category = req.body.category;
        var distinction = req.body.distinction;
        var table = await Tables.find({ _id: tableId })
        if (table == "") {
            res.json("err")
        } else {
            if (table[0].time.length > 0) {
                res.json("err")
            } else {
                var update = await Tables.findByIdAndUpdate({ _id: tableId }, { name: name, category: category, distinction: distinction })
                res.json("ok")
            }

        }

    })

    //GET TABLE
    app.get('/tables', async (req, res) => {
        var tables = await Tables.find({})
        //var r = JSON.stringify(tables)
        res.json(tables);
    })

    //RESERVATION TABLES
    app.post('/reservation_tables/:userId/:check', async (req, res) => {
        var t = 0;//check then send to client
        var check2 = [];
        var distinction = req.body.distinction;
        var userId = req.params.userId;
        var dish = req.params.check;
        var notice = req.body.notice;
        var date = req.body.date;
        var time = req.body.time;
        var people = req.body.people;
        var numPeople = people;
        var convertTime = time.split(":")
        var converDate = date.split("-")
        var Hour = convertTime[0];
        var Min = convertTime[1];
        var Year = converDate[0];
        var Month = converDate[1];
        var Day = converDate[2];
        var convert = Hour + "-" + Min + "-" + date;
        //console.log(convert)
        if (people > 0 && people <= 2) people = 2;
        if (people > 2 && people <= 4) people = 4;
        if (people > 4 && people <= 6) people = 6;
        if (people > 6 && people <= 8) people = 8;
        if (people > 8 && people <= 10) people = 10;
        //check cart
        var dishesId = [0]
        if (dish == 1) {
            var cart = await Cart.find({ userId: userId, check: "0" })
            dishesId = cart[0].dishesId;
            //var cart2 = await Cart.updateOne({ userId: userId, check: "0" }, { check: "1" })
        }
        //
        var tableAvailable = await Tables.find({ category: people, distinction: distinction })
        for (var i = 0; i < tableAvailable.length; i++) {
            var check = [];

            if (tableAvailable[i].time == "") {
                //console.log("ok")
                var updateTables = await Tables.updateOne({ name: tableAvailable[i].name }, { $push: { time: [convert], people: [numPeople], userId: [userId], dishesId: [dishesId], notice: [notice] }, check: "1" });
                var cart2 = await Cart.updateOne({ userId: userId, check: "0" }, { check: "1" })
                var newNotification = new Notification();
                newNotification.tableName = tableAvailable[i].name;
                newNotification.time = convert;
                newNotification.userId = userId;
                newNotification.save();
                t = 1;
                break;


            }
            else {
                for (var j = 0; j < tableAvailable[i].time.length; j++) {
                    var che = 0;
                    //console.log(tableAvailable[i].time[j])
                    var transTime = tableAvailable[i].time[j].split("-")
                    //console.log(transTime)
                    var hour = transTime[0];
                    var min = transTime[1];
                    var year = transTime[2];
                    var month = transTime[3];
                    var day = transTime[4];

                    if (Year == year && Month == month && Day == day) {
                        // console.log("yyyy")
                        if (min == 00) {
                            //console.log("00")
                            if (Hour == hour && Min == 30) {
                                // console.log("01")
                                che = 0;

                            } else
                                if (Hour == hour && Min == min) {
                                    //console.log("02")
                                    che = 0;

                                } else
                                    if (Hour == hour - 1 && Min == 30) {
                                        //console.log("03")
                                        che = 0;

                                    }
                                    else {
                                        //console.log("04")
                                        che = 1;

                                    }
                        }
                        if (min == 30) {
                            //console.log("30")
                            if (Hour == hour && Min == 0) {
                                che = 0;

                            } else if (Hour == hour && Min == min) {
                                //console.log("02")
                                che = 0;

                            } else if (Hour + 1 == hour && Min == 0) {
                                //console.log("03")
                                che = 0

                            } else {
                                //console.log("04")
                                che = 1;

                            }
                        }
                    } else {
                        //console.log("auto")
                        che = 1;
                    }

                    check.push(che)
                }
                //console.log(check)
                //che chay theo j
                //check chay theo i
                for (var x = 0; x < check.length; x++) {
                    if (check[x] == 0) {
                        check = [0];
                        break;
                    }
                    if (x + 1 == check.length) {
                        check = [1];
                    }
                }
                check2.push(check);
            }
            //var updateTables = await Tables.updateOne({ name: tableAvailable[i].name }, {$push:{  time: [convert], people: [numPeople]}});
        }



        for (var y = 0; y < check2.length; y++) {

            for (var z = 0; z < check.length; z++) {
                if (check2[y] == 0) {
                    console.log("err")
                }
                if (check2[y] == 1) {
                    console.log("update")
                    var updateTables = await Tables.updateOne({ name: tableAvailable[y].name }, { $push: { time: [convert], people: [numPeople], userId: [userId], dishesId: [dishesId], notice: [notice] }, check: "1" });
                    var cart2 = await Cart.updateOne({ userId: userId, check: "0" }, { check: "1" })
                    var newNotification = new Notification();
                    newNotification.tableName = tableAvailable[y].name;
                    newNotification.time = convert;
                    newNotification.userId = userId;
                    newNotification.save();
                    t = 1;
                    break;
                }

            }
            if (t == 1) {
                break;
            }
        }
        console.log(check2)
        //check then send to client
        if (t == 1) {
            res.json("ok")
        } else {
            res.json("err")
        }
        //res.json("ok")

    })

    //DELETE RESERVATION TABLES
    app.post('/delete_reservation_tables/:tableId/:time/:userid', async (req, res) => {
        var check = 0;
        const tableId = req.params.tableId;
        const time = req.params.time;
        const userid = req.params.userid;
        const one = time[0];
        const two = time[1];
        const three = time[2];
        const four = time[3];
        const five = time[4];
        const six = time[5];
        const seven = time[6];
        const eight = time[7];
        const nine = time[8];
        const ten = time[9];
        const eleven = time[10];
        const twelve = time[11];
        const Time = one + two + "-" + three + four + "-" + five + six + seven + eight + "-" + nine + ten + "-" + eleven + twelve;
        const find = await Tables.find({ _id: tableId })
        for (var i = 0; i < find[0].time.length; i++) {
            if (find[0].time[i] == Time) {
                console.log("ok")
                check = 1;
                var Update = await Tables.updateOne({ _id: tableId }, { $pull: { time: find[0].time[i] } });
                var notice = find[0].notice;
                var userId = find[0].userId;
                var dishesId = find[0].dishesId;
                var people = find[0].people;
                notice.splice(i, 1)
                userId.splice(i, 1)
                dishesId.splice(i, 1);
                people.splice(i, 1)
                var Update = await Tables.updateOne({ _id: tableId }, { $set: { notice: [] } }, { multi: true })
                var Update = await Tables.updateOne({ _id: tableId }, { $set: { userId: [] } }, { multi: true })
                var Update = await Tables.updateOne({ _id: tableId }, { $set: { dishesId: [] } }, { multi: true })
                var Update = await Tables.updateOne({ _id: tableId }, { $set: { people: [] } }, { multi: true })

                for (var t = 0; t < notice.length; t++) {
                    var Update3 = await Tables.updateOne({ _id: tableId }, { $push: { notice: notice[t] } })
                    var Update4 = await Tables.updateOne({ _id: tableId }, { $push: { userId: userId[t] } })
                    var Update5 = await Tables.updateOne({ _id: tableId }, { $push: { dishesId: dishesId[t] } })
                    var Update6 = await Tables.updateOne({ _id: tableId }, { $push: { people: people[t] } })

                }
                if (find[0].time == "") {
                    var Update2 = await Tables.updateOne({ name: find[0]._id }, { check: "0" })
                    //console.log("ok2")
                }

            }
        }
        if (check == 0) {
            res.json("err");
        } else {
            res.json("ok");
        }

    })

    //UPDATE RESERVATION TABLE
    app.post('/update_reservation_tables/:tableIdFrom/:tableIdTo/:time', async (req, res) => {
        var tableIdFrom = req.params.tableIdFrom;
        var tableIdTo = req.params.tableIdTo;
        var time = req.params.time;
        var check = 0;
        var check2 = [];
        //convert time to find
        var Hour = time[0] + time[1];
        var Min = time[2] + time[3];
        var Year = time[4] + time[5] + time[6] + time[7];
        var Month = time[8] + time[9];
        var Day = time[10] + time[11];
        var Time = Hour + "-" + Min + "-" + Year + "-" + Month + "-" + Day
        //compare people
        var tableFrom = await Tables.find({ _id: tableIdFrom })
        var tableTo = await Tables.find({ _id: tableIdTo })
        if (tableFrom[0].category == tableTo[0].category) {
            check = 1;
            //check tableTo time
            for (var i = 0; i < tableTo[0].time.length; i++) {
                var che = 0;
                //translate time
                var transTime = tableTo[0].time[i].split("-")
                var hour = transTime[0];
                var min = transTime[1];
                var year = transTime[2];
                var month = transTime[3];
                var day = transTime[4];
                //console.log(hour, min, year, month, day)
                if (Year == year && Month == month && Day == day) {
                    // console.log("yyyy")
                    if (min == 00) {
                        //console.log("00")
                        if (Hour == hour && Min == 30) {
                            // console.log("01")
                            che = 0;

                        } else
                            if (Hour == hour && Min == min) {
                                //console.log("02")
                                che = 0;

                            } else
                                if (Hour == hour - 1 && Min == 30) {
                                    //console.log("03")
                                    che = 0;

                                }
                                else {
                                    //console.log("04")
                                    che = 1;

                                }
                    }
                    if (min == 30) {
                        //console.log("30")
                        if (Hour == hour && Min == 0) {
                            che = 0;

                        } else if (Hour == hour && Min == min) {
                            //console.log("02")
                            che = 0;

                        } else if (Hour + 1 == hour && Min == 0) {
                            //console.log("03")
                            che = 0

                        } else {
                            //console.log("04")
                            che = 1;

                        }
                    }
                } else {
                    //console.log("auto")
                    che = 1;
                }
                check2.push(che)
            }
            for (var x = 0; x < check2.length; x++) {
                if (check2[x] == 0) {
                    check2 = [0];
                    break;
                }
                if (x + 1 == check2.length) {
                    check2 = [1];
                }
            }
        }

        console.log(check2)

        if (check2[0] == 1) {
            var Time_ = Time;
            var Notice = "";
            var UserId = "";
            var DishId = "";
            var People = "";
            for (var i = 0; i < tableFrom[0].time.length; i++) {
                if (tableFrom[0].time[i] == Time) {
                    Notice = tableFrom[0].notice[i]
                    UserId = tableFrom[0].userId[i]
                    DishId = tableFrom[0].dishesId[i]
                    People = tableFrom[0].people[i];

                    var Update = await Tables.updateOne({ _id: tableIdFrom }, { $pull: { time: Time } });
                    var notice = tableFrom[0].notice;
                    var userId = tableFrom[0].userId;
                    var dishesId = tableFrom[0].dishesId;
                    var people = tableFrom[0].people;

                    notice.splice(i, 1)
                    userId.splice(i, 1)
                    dishesId.splice(i, 1);
                    people.splice(i, 1)

                    var Update = await Tables.updateOne({ _id: tableIdFrom }, { $set: { notice: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ _id: tableIdFrom }, { $set: { userId: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ _id: tableIdFrom }, { $set: { dishesId: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ _id: tableIdFrom }, { $set: { people: [] } }, { multi: true })

                    for (var t = 0; t < notice.length; t++) {
                        var Update3 = await Tables.updateOne({ _id: tableIdFrom }, { $push: { notice: notice[t] } })
                        var Update4 = await Tables.updateOne({ _id: tableIdFrom }, { $push: { userId: userId[t] } })
                        var Update5 = await Tables.updateOne({ _id: tableIdFrom }, { $push: { dishesId: dishesId[t] } })
                        var Update6 = await Tables.updateOne({ _id: tableIdFrom }, { $push: { people: people[t] } })

                    }
                }
            }
            var updateTables = await Tables.updateOne({ _id: tableIdTo }, { $push: { time: [Time_], people: [People], userId: [UserId], dishesId: [0], notice: [Notice] }, check: "1" });

        }
        else {
            check = 0;
        }

        if (check == 0) {
            res.json("err")
        } else {
            res.json("ok")
        }
    })

    //GET USER
    app.get('/users', async (req, res) => {
        var User = await Users.find({})
        res.json(User)
    })

    //ADD DISHES RESERVATION
    app.post('/add_cart/:userid', async (req, res) => {
        var dishesId = req.body.dishesId;
        var userId = req.params.userid;
        var User = await Cart.find({ userId: userId, check: 0 })
        if (User == "") {
            var newCart = new Cart();
            newCart.userId = userId;
            newCart.dishesId = dishesId;
            newCart.save();
            res.json("ok")
        } else {
            var update = await Cart.findOneAndUpdate({ userId: userId, check: 0 }, { $push: { dishesId: [dishesId] } })
            res.json("ok")
        }

    })
    
    //DELETE DISHES RESERVATION
    app.post('/delete_cart/:userid', async (req, res) => {
        var dishesId = req.body.dishesId;
        var userId = req.params.userid;
        var user = await Cart.find({ userId: userId, check: 0 })
        var dishesCopy = user[0].dishesId;
        for (var i = 0; i < user[0].dishesId.length; i++) {
            if (user[0].dishesId[i] == dishesId) {
                dishesCopy.splice(i, 1)
                console.log(dishesCopy)
                var Update = await Cart.updateOne({ userId: userId, check: 0 }, { $set: { dishesId: [] } }, { multi: true })
                var Update3 = await Cart.updateOne({ userId: userId, check: 0 }, { dishesId: dishesCopy })
                break;
            }

        }
        res.json("ok")
    })
    //GET DISHES RESERVATION
    app.get('/cart/:userid', async (req,res)=>{
        var userId = req.params.userid
        var dish = await Cart.find({userId:userId,check:0})
        var dishId = [];
        var uniqueArray = []
        for(var i = 0; i<dish.length;i++){
            for(var j=0;j<dish[i].dishesId.length;j++){
                var dis = dish[i].dishesId[j]
                dishId.push(dis)
                 uniqueArray = dishId.filter((item, index, array) => {
                    return array.indexOf(item) === index
                  })
            }
            
        }

        
        res.json(uniqueArray)
    })
    //GET NOTIFICATION
    app.get('/notification', async (req,res)=>{
        var notification = await Notification.find({});
        res.json(notification)
    })

    //COMMENT AND RATE
    app.post("/comments/:userid", async (req, res) => {
        const dishId = req.body.dishId;
        const rating = req.body.rating;
        const comment = req.body.comment;
        const userId = req.params.userid;
        var user = await Users.find({_id: userId})
        var userName = user[0].local.name;
        var newComments = new Comments();
        newComments.dishId = dishId;
        newComments.rating = rating;
        newComments.comment = comment;
        newComments.userName = userName;
        newComments.save();
        res.send("ok")


    })
    //DELETE COMMENT
    app.post('/delete_comments/:commentid', async (req,res)=>{
        var commentId = req.params.commentid;
        var comment = await Comments.deleteOne({_id:commentId})
        res.json("ok")
    })
    //GET COMMENTS
    app.get('/comments',async (req,res)=>{
        var comment = await Comments.find({});
        res.json(comment)
    })

    //ADD FAVORITE
    app.post('/add_favorite/:userid', async (req, res) => {
        var dishesId = req.body.dishesId;
        var userId = req.params.userid;
        var User = await Favorite.find({ userId: userId})
        if (User == "") {
            var newFavorite = new Favorite();
            newFavorite.userId = userId;
            newFavorite.dishesId = dishesId;
            newFavorite.save();
            res.json("ok")
        } else {
            var update = await Favorite.findOneAndUpdate({ userId: userId}, { $push: { dishesId: [dishesId] } })
            res.json("ok")
        }

    })
    //DELETE FAVORITE
    app.post('/delete_favorite/:userid', async (req, res) => {
        var dishesId = req.body.dishesId;
        var userId = req.params.userid;
        var user = await Favorite.find({ userId: userId})
        var dishesCopy = user[0].dishesId;
        for (var i = 0; i < user[0].dishesId.length; i++) {
            if (user[0].dishesId[i] == dishesId) {
                dishesCopy.splice(i, 1)
                console.log(dishesCopy)
                var Update = await Favorite.updateOne({ userId: userId }, { $set: { dishesId: [] } }, { multi: true })
                var Update3 = await Favorite.updateOne({ userId: userId }, { dishesId: dishesCopy })
                break;
            }

        }
        res.json("ok")
    })
    //GET FAVORITE
    app.get('/favorites', async (req,res)=>{
        var favorite = await Favorite.find({})
        res.json(favorite)
    })

    app.get('/', (req, res) => {
        res.send("ok, this is the main page!")
    })
}
//1234