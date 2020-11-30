var mongoose = require("mongoose");
var moment = require("moment");

var Leaders = mongoose.Schema({
    time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    name: String,
    image: String,
    designation: String,
    abbr: String,
    featured: String,
    description: String
});


module.exports = mongoose.model("leaders", Leaders);