var mongoose = require('mongoose');
var properties = require('./properties');

var mongoDB = properties.database;

module.exports = {
  connect: async function(err) {
	  mongoose.Promise = global.Promise;
	  
	try {
	  await mongoose.connect(mongoDB, { useNewUrlParser: true });
	  console.log('\nSuccessfully connected to DB at ' + mongoDB + '\n');
	} catch (error) {
	  err(error);
	}

  }
};