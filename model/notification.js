var mongoose = require("mongoose");
var moment = require("moment");

var Notification = mongoose.Schema({
    time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    userId: String,
    time:String,
    tableName:String
});


module.exports = mongoose.model("notification", Notification);