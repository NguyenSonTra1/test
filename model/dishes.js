var mongoose = require("mongoose");
var moment = require("moment");

var Dishes = mongoose.Schema({
    time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    name: String,
    image:String,
    category: String, 
    label:String,
    price:String,
    featured:String,
    description:String
});


module.exports = mongoose.model("dishes", Dishes);