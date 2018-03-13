var mongoose = require('mongoose');

//define mongoose Shema
var thing = mongoose.Schema({
    ref: String,
    data: Object
}, {
    timestamps: true
});
// methods ======================

// checking if password is valid
/*
schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
*/
// Compile model from schema
//var ThingData = mongoose.model('ThingData', thing);
module.exports = mongoose.model('ThingData', thing);
