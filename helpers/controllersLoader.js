console.log('loading controllers...');
var fs = require('fs');
var path = require('path');
var dir = path.join(__dirname, '..', 'controllers');
fs.readdirSync(dir).forEach(function(name) {
    var file = path.join(dir, name);
    if (name.substr(-3) == '.js') {
        this["" + name.slice(0, -3)] = require(file);
    }

});
