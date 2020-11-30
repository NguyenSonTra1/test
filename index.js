const express  = require('express')
const app = express()
const mongoose = require('mongoose')
var db = require("./config/db.js")
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
var morgan = require("morgan");
var cookieParser = require("cookie-parser");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json())
bodyParser.urlencoded({ extended: false })
// app.set("view engine", "ejs");
// app.set("views", "./view");

mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("connect mongo!")
});

require("./route/route")(app)

app.listen(PORT,()=>{
    console.log("server running "+PORT)
})