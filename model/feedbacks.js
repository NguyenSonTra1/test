var mongoose = require("mongoose");
var moment = require("moment");

var Feedbacks = mongoose.Schema({
    time: { type: String, default: () => moment().format("hh:mm a, DD/MM/YYYY")},
    firstname: String,
    lastname: String,
    telnum: String,
    email: String,
    agree: String,
    contactType: String,
    message: String,
});


module.exports = mongoose.model("feedbacks", Feedbacks);