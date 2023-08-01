#!/usr/bin/env node
//express.js api server
var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
var app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
//declare the main lists so they can be accesssed between functions
let masterServerList = [];
let masterDBList = [];
let token = "6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t";
//const token = localStorage.getItem('jwt');
//input function (post requests to /servers)
app.post('/servers', function(req, res){
  var reqData = (req.body);   //store the request body
  if(req.headers.auth == token){
    res.send("data received");
      reqData.Servers.forEach(function(server){
        //check if the VM is already in the list
      if (masterServerList.some(existingServer => existingServer.VMName === server.VMName)){
          console.log(server.VMName + " already exists in masterServerList");
          //check if the last check in time is newer
        var curServer = masterServerList.find(existingServer => existingServer.VMName === server.VMName);
          if (server.LastCheckInTime > curServer.LastCheckInTime){
            console.log(server.VMName + " has a newer check in time. Updating its attributes.");
            //update masterServerList with newer attributes
            curServer.LastCheckInTime = server.LastCheckInTime;
            curServer.IP = server.IP;
            curServer.HyperVisor = server.HyperVisor;
            curServer.Hostname = server.Hostname;
            curServer.Status = server.Status;
          }
      } else {
        masterServerList.push(server);
      }
    });
   } else {
    response.send("not authenticated");
  }
  console.log(masterServerList);
  console.log("the masterServerList has " + masterServerList.length + " servers.");
});

//output function (get requests to /servers)
app.get('/servers', (req, res) => {
  if(req.headers.auth == token){
  console.log(req.get("User-Agent"));
  res.json(masterServerList);
  }else{
    res.send("not authenticated");
  }
});
//input function (post requests to /databases)
app.post('/databases', function(req, res){
  var reqData = (req.body); // store the request body
  if(req.headers.auth == token){
    res.send("data received");
    masterDBList = [];
    reqData.forEach(function(db){
      // check if the database is already in the list
      if (masterDBList.some(existingDB => existingDB.database_id === db.database_id)){
        // find the matching database in masterDBList
        var matchDB = masterDBList.find(existingDB => existingDB.database_id === db.database_id);
        console.log(db.name + " is already in the masterDBList");
        matchDB.paths.push(db.path);
        console.log(matchDB.paths);
        // combine the sizes
        matchDB.size += db.size;
      } else {
        // Pushes everything if does not exist
        masterDBList.push({
          database_id: db.database_id,
          name: db.name,
          paths: [db.path],
          size: db.size
        });
      }
    });
  } else {
    response.send("not authenticated");
  }
  console.log(masterDBList.length);
});

app.get('/databases', function(req, res){
  if(req.headers.auth == token){
    res.json(masterDBList);
  }else{
    res.send("not authenticated");
  }
});

app.post('/auth', (req, res) => {

  var code = 547893467;

  if(code == 547893467 ){
    code = 'lnzJe2rnW3fssC2aGuOhkBWmukFGezDlk9yZaLtE0kdC5PZXp20EwVLU9UWibIiSFgNJfvZi8DO7pTghhHHTHkWdbyCvngkmXiY5ZXbsjl0XxnPGlwkVkgVo7kCgbknRN991FMdjeY6SeSf6ImylDy0DXIyfkKYclpvmWrCr2aiYaT0w6pVZAvxj1IDHKnuSMmUOQ4jHdE5qMKpvfepe5o2VDYDixXGMAYGpvNc7TdKyUUK7y3n0qiJ2AE8IGD5RdYKd2W0cpuOHwAeBZ44j1E75joAXoGl8UCaMGzLiZtMgcVvDlbCmLKfZnJEDc5tVTj0waoqYxTzzbXwCSo8QZLH2Aevt2rj';
  }

  res.json({ code });
})

app.post('/login', (req, res) => {
  // Validate user credentials

  const username = req.body;
  const password = req.body;
  //var secretKey = '9ea6c2ac601acfa563531718e9abd79d2ee1f93c67416f972e347899c3d329b52c73d80e8309b1781baecefd19bab64eb3357c232f6781b4e08ab5a042eb3e16'; 
  // Perform necessary checks, such as querying the database

  // If credentials are valid, generate a JWT
  const token = jwt.sign({ username, password }, '9ea6c2ac601acfa563531718e9abd79d2ee1f93c67416f972e347899c3d329b52c73d80e8309b1781baecefd19bab64eb3357c232f6781b4e08ab5a042eb3e16', { expiresIn: '1h' });

  // Return the JWT as a response
  res.json({ token });

});

setInterval(deleteServers, 1000 * 60 * 60, masterServerList);

//runs through hyperVisorList and deleted any item with LastCheckInTime older than reference time
function deleteServers(array){
  console.log('function deleteServers runs');
  //gets current time, sets reference time to 24 hours before current time
  var curTime = new Date();
  var referenceTime = new Date();

  //referenceTime.setHours(curTime.getHours()-28);
  referenceTime.setHours(curTime.getHours()-4);
  referenceTime.setMinutes(curTime.getMinutes()-10);
  referenceTime = referenceTime.toISOString().split('.')[0];
  console.log('Reference time: ' + referenceTime);
  //same idea, less time difference for testing


  var toDelete = [];
  //iterates through hyperVisorList and deleted any item with LastCheckInTime older than reference time
  array.forEach((item, index) => {
    console.log(item.VMName + ': ' + item.LastCheckInTime)
    if(item.LastCheckInTime < referenceTime){
        toDelete.push(index)
        console.log('Outdated, deleting: ' + item.VMName);
    } else if(item.LastCheckInTime > referenceTime){
        console.log('Current, keeping: ' + item.VMName);
    }else{
      console.log('this is broken');
    }
  });
  toDelete.reverse();
  toDelete.forEach((val, _) => {
    masterServerList.pop(val);
  });
}

let notificationMessage = "";
let notificationTime = "";

app.post('/messages', function(req, res){
  // console.log(request.body);
  if(req.headers.auth){
  notificationMessage = req.body.message;
  notificationTime = req.body.timestamp;
  res.status(200).send("Success");
  }else{
    res.send("not authenticated");
  }
});

app.get('/messages', function(req, res){
  if(req.headers.auth == token){
    res.status(200).send(JSON.stringify({message: notificationMessage, timestamp: notificationTime }));
  }else{
    res.send("not authenticated");
  }
});

app.listen(3000);
