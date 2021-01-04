var mongoose = require("mongoose");
var moment = require("moment");

var Favorite = mongoose.Schema({
    userId:String,
    dishesId:{type:Array,default:[]},
});


module.exports = mongoose.model("favorites", Favorite);