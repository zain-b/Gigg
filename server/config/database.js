var mongoose = require('mongoose');
var properties = require('./properties');

var mongoDB = properties.database;

module.exports = {
  connect: function() {
      mongoose.Promise = global.Promise;
      mongoose.connect(mongoDB, { useNewUrlParser: true }).then(
          () => { console.log("Successfully connected to DB.") },
          err => { console.error.bind(console, 'MongoDB connection error:' + err) }
      );
  }
};