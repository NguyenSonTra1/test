var mongoose = require("mongoose");
var moment = require("moment");

var DishesReserve = mongoose.Schema({
    //time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    userId:String,
    dishes:{type:Array,default:[]},
    check:{type:String,default:0}
});


module.exports = mongoose.model("dishesreserve", DishesReserve);