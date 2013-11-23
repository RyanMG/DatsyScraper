var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pg = require('pg');

var app = express();

var options = {
  host: 'bayareabikeshare.com',
  path: '/stations/json',
  method: 'GET',
  contentType: 'application/json'
};

var conString = 'postgres://localhost:5432/test';

var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var scrape = setInterval(function() {
  var jsonReq = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      writeNewData(data);
    });
  });
  
  jsonReq.on('error', function (e) {
    console.log(e.message);
  });

  jsonReq.end();

}, 5000);


app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var writeNewData = function(data) {
  var cleanData = clean(data);
  for (var i = 0; i < cleanData.stations.length; i++) {
    var row = cleanData.stations[i];
    var query = "INSERT INTO stations (executiontime, stationid, stationname, availabledocks, totaldocks, latitude, longitude, statusvalue, statuskey, availablebikes, staddress1, staddress2, city, postalcode, location, altitude, teststation, lastcommunicationtime, landmark) VALUES ('" + cleanData.executionTime + "', " + row.id + ", '" + row.stationName + "', " + row.availableDocks + ", " + row.totalDocks + ", " + row.latitude + ", " + row.longitude + ", '" + row.statusValue + "', " + row.statusKey + ", " + row.availableBikes + ", '" + row.stAddress1 + "', '" + row.stAddress2 + "', '" + row.city + "', " + row.postalCode + ", '" + row.location + "', " + row.altitude + ", " + row.testStation + ", " + row.lastCommunicationTime + ", '" + row.landMark + "');";
//    console.log(query);
    insertNewData(query);
  }
};

var insertNewData = function(queryString) {
  client.query(queryString, function(err, result) {
    if(err) {
      return console.error('error running query', err);
    } else {
      console.log(result);
    }
  });
};

var clean = function(data) {
  var result = {
    executionTime: "",
    stations: []
  };
  result.executionTime = data.split('[')[0].split('"')[3];
  var rows = data.split('[')[1].slice(1).split('}]}')[0].split('},{');
  for (var i = 0; i < rows.length; i++) {
    result.stations[i] = {};
    row = rows[i].split(',');
    for (var j = 0; j < row.length; j++) {
      thisRow = row[j].split(':');
      thisRow[0] = thisRow[0].slice(1, thisRow[0].length-1);
      if (thisRow[1] == 'null' || thisRow[1] == 'false' || thisRow[1] == 'true') {
        switch (thisRow[1]) {
          case 'null':
            thisRow[1] = null;
            break;
          case 'false':
            thisRow[1] = false;
            break;
          case 'true':
            thisRow[1] = true;
            break;
        }
      } else {
        if (thisRow[1][0] !== '"') {
          thisRow[1] = parseFloat(thisRow[1]);
        } else {
          thisRow[1] = thisRow[1].slice(1, thisRow[1].length-1);
        }
      }
      if (thisRow[1] === '' ) thisRow[1] = null;
      result.stations[i][thisRow[0]] = thisRow[1];
    }
  }
  console.log("Total stations: ", result.stations.length);
  return result;
};

