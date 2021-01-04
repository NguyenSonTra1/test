const express = require('express')
const app = express()
const mongoose = require('mongoose')
var db = require("./config/db.js")
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var cron = require('node-cron');
var Tables = require("./model/tables");
const { find } = require('./model/tables');

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept")
    next();
})
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json())
bodyParser.urlencoded({ extended: false })
app.set("view engine", "ejs");
app.set("views", "./view");

mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connect mongo!")
});

require("./route/route")(app)
cron.schedule('* * * * * *', async () => {
    var temp = 0; // luu bien j
    var today = new Date();
    var dayCurrent = String(today.getDate()).padStart(2, '0');
    var monthCurrent = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yearCurrent = today.getFullYear();
    var hourCurrent = String(today.getHours());
    var minCurrent = String(today.getMinutes());
    //console.log(hourCurrent + ":" + minCurrent + " " + dayCurrent + "/" + monthCurrent + "/" + yearCurrent)

    var tables = await Tables.find({ check: 1 })
    //console.log(tables)
    for (var i = 0; i < tables.length; i++) {
        var check = 0
        if (check == 0) {
            for (var j = 0; j < tables[i].time.length; j++) {

                var transTime = tables[i].time[j].split("-")
                var hour = transTime[0];
                var min = transTime[1];
                var year = transTime[2];
                var month = transTime[3];
                var day = transTime[4];
                var minValid = parseInt(min) + 1 // time to auto delete
                //console.log(tables[i].time[j])
                if (yearCurrent == year && monthCurrent == month && dayCurrent == day && hourCurrent == hour && minCurrent == minValid) {
                    var Update = await Tables.updateOne({ name: tables[i].name }, { $pull: { time: tables[i].time[j]}});

                    var find = await Tables.findOne({ name: tables[i].name });
                    var notice = find.notice;
                    var userId = find.userId;
                    var dishesId = find.dishesId;
                    var people = find.people;
                    notice.splice(j, 1)
                    userId.splice(j,1)
                    dishesId.splice(j,1);
                    people.splice(j,1)
                    var Update = await Tables.updateOne({ name: tables[i].name }, { $set: { notice: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ name: tables[i].name }, { $set: { userId: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ name: tables[i].name }, { $set: { dishesId: [] } }, { multi: true })
                    var Update = await Tables.updateOne({ name: tables[i].name }, { $set: { people: [] } }, { multi: true })

                    for(var t= 0;t<notice.length;t++){
                        var Update3 = await Tables.updateOne({ name: tables[i].name }, { $push: { notice: notice[t] } })
                        var Update4 = await Tables.updateOne({ name: tables[i].name }, { $push: { userId: userId[t] } })
                        var Update5 = await Tables.updateOne({ name: tables[i].name }, { $push: { dishesId: dishesId[t] } })
                        var Update6 = await Tables.updateOne({ name: tables[i].name }, { $push: { people: people[t] } })
                        
                    }

                    

                    //console.log("ok")
                    check = 1;
                }
            }
        }

    }
    for (var x = 0; x < tables.length; x++) {
        if (tables[x].time == "") {
            var Update2 = await Tables.updateOne({ name: tables[x].name }, { check: "0" })
            //console.log("ok2")
        }
    }
});


app.listen(PORT, () => {
    console.log("server running " + PORT)
})