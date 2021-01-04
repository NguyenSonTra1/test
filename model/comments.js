var mongoose = require("mongoose");
var moment = require("moment");

var Comments = mongoose.Schema({
    time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    dishId:String,
    rating:String,
    comment: String,
    userName: String
});


module.exports = mongoose.model("comments", Comments);