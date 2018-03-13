// grab the things we need
var mongoose = require('mongoose');

module.exports = function(model) {

    require('./../models/mongo/' + model);

    //create a model
    return mongoose.model(firstToUpperCase(model), schema);
};



function firstToUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
