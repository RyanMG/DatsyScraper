var db = require('./db.js');
var http = require('http');

exports.BABS = function() {
  setInterval(function() {
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
  }, 65000);
};

var options = {
  host: 'bayareabikeshare.com',
  path: '/stations/json',
  method: 'GET',
  contentType: 'application/json'
};

var writeNewData = function(data) {
  data = JSON.parse(data);
  for (var i = 0; i < data.stationBeanList.length; i++) {
    var row = data.stationBeanList[i];
    console.log(row);
    row.executionTime = data.executionTime;
    var query = "INSERT INTO stationstatuses ("
      + "executiontime," 
      + "stationid,"
      + "stationname,"
      + "availabledocks," 
      + "totaldocks,"
      + "latitude,"
      + "longitude," 
      + "statusvalue," 
      + "statuskey,"
      + "availablebikes," 
      + "staddress1,"
      + "staddress2,"
      + "city,"
      + "postalcode," 
      + "location,"
      + "altitude,"
      + "teststation," 
      + "lastcommunicationtime,"
      + "landmark"
      + ") VALUES (" +
      "'" + row.executionTime + "'," + 
      row.id + "," + 
      "'" + row.stationName + "'," + 
      row.availableDocks + "," + 
      row.totalDocks + "," + 
      row.latitude + "," + 
      row.longitude + "," + 
      "'" + row.statusValue + "'," + 
      row.statusKey + "," + 
      row.availableBikes + "," + 
      "'" + row.stAddress1 + "'," + 
      "'" + row.stAddress2 + "'," + 
      "'" + row.city + "'," + 
      "'" + row.postalCode + "'," +
      "'" + row.location + "'," + 
      "'" + row.altitude + "'," + 
      row.testStation + "," + 
      row.lastCommunicationTime + "," + 
      "'" + row.landMark + "'" +
      ");";
    db.insertNewData(query);
  }
};
