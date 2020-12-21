var mongoose = require("mongoose");
var moment = require("moment");

var Tables = mongoose.Schema({
    //time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    name: String,
    category: String,
    time: {type:Array, default:[]},
    people:{type:Array, default:[]},
    //ategory:{type:String, default:"0"},
    userId:{type:Array,default:[]},
    dishesId:{type:Array,default:[]},
    notice:{type:Array,default:[]},
    check:{type:String, default:"0"},
    distinction:{type:String, default:0}
});


module.exports = mongoose.model("tables", Tables);