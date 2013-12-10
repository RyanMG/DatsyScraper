var pg = require('pg');
var credentials = require('./dbconfig.json').db;

var connectionString = 'postgres://'+ credentials.username + ':' + credentials.password + '@' + credentials.localhost + '/' + credentials.name;

var client = new pg.Client(connectionString);

exports.connect = function(callback) {
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    } else {
      callback();
    }
  });
}

exports.insertNewData = function(queryString) {
  client.query(queryString, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    } else {
      console.log('successfully inserted row', result);
    }
  });
};

