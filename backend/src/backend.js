#!/usr/bin/env node
//express.js api server
var express = require('express');
var cors = require('cors');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const { reverse } = require('dns');
var app = express();
app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
//declare the main lists so they can be accesssed between functions
let masterServerList = [];
let masterDBList = [];
let masterSizesList = {};
let internalDBList = [];
let token = "6rqfduihfwsesuhgfweiouyw3rtfs897byw4tgoiuwy4sro9uw34t0u94t";
let pricePerGB = 0.075;
getAzDBPrice();
//const token = localStorage.getItem('jwt');
//input function (post requests to /servers)
app.post('/servers', function (req, res) {
  var reqData = (req.body);   //store the request body
  if (req.headers.auth == token) {
    let sizesList = [];
    res.status(200).send("Success");
    var cost = 0;
    reqData.Servers.forEach(function (server) {
      //check if the VM is already in the list
      if (masterServerList.some(existingServer => existingServer.VMName === server.VMName)) {
        console.log(server.VMName + " already exists in masterServerList");
        //check if the last check in time is newer
        var curServer = masterServerList.find(existingServer => existingServer.VMName === server.VMName);
        if (server.LastCheckInTime > curServer.LastCheckInTime) {
          console.log(server.VMName + " has a newer check in time. Updating its attributes.");
          //update masterServerList with newer attributes
          curServer.LastCheckInTime = server.LastCheckInTime;
          curServer.IP = server.IP;
          curServer.HyperVisor = server.HyperVisor;
          curServer.Hostname = server.Hostname;
          curServer.Status = server.Status;
          curServer.Size = server.Size;
          curServer.Cost = 0;
        }
      } else {
        masterServerList.push(server);
      }
      if (!sizesList.includes(server.Size))
        sizesList.push(server.Size);
    });
    sizesList.forEach(function (size) {
      JSON.stringify(size);
      const url = "https://prices.azure.com/api/retail/prices?$filter=serviceFamily eq 'Compute' and location eq 'US East' and armSkuName eq '" + size + "' and pricetype eq 'Consumption'";
      fetch(url)
        .then(response => {
          // Check if the response status is OK (200)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the response JSON
          return response.json();
        })
        .then(data => {
          // Handle the data
          let body = data;
          let correctItem = body.Items.filter(i => !i.meterName.toLowerCase().includes("spot") && !i.meterName.toLowerCase().includes("low") && i.productName.toLowerCase().includes("windows"))[0];
          var serverPriceHourly = correctItem.retailPrice;
          var cost = serverPriceHourly * 24 * 30;
          masterSizesList[size] = Math.ceil(cost * 100) / 100;
        })
        .then(() => {
          for (let i = 0; i < masterServerList.length; i++) {
            masterServerList[i]["Cost"] = masterSizesList[masterServerList[i].Size]
          }
        })
        .catch(error => {
          // Handle errors
          console.error('Fetch error:', error);
        });
    });
  } else {
    res.status(401).send("401 Unauthorized");
  }
  //console.log(masterServerList);
  //console.log("the masterServerList has " + masterServerList.length + " servers.");
});

//output function (get requests to /servers)
app.get('/servers', (req, res) => {
  if (req.headers.auth == token) {
    console.log(req.get("User-Agent"));
    res.json(masterServerList);
  } else {
    res.status(401).send("401 Unauthorized");
  }
});
//input function (post requests to /databases)
app.post('/databases', function (req, res) {
  var reqData = (req.body); // store the request body
  if (req.headers.auth == token) {
    masterDBList = [];
    reqData.forEach(function (db) {
      // check if the database is already in the list
      if (masterDBList.some(existingDB => existingDB.database_id === db.database_id)) {
        // find the matching database in masterDBList
        var matchDB = masterDBList.find(existingDB => existingDB.database_id === db.database_id);
        console.log(db.name + " is already in the masterDBList");
        matchDB.paths.push(db.path);
        console.log(matchDB.paths);
        // combine the sizes
        matchDB.size += db.size;
        //masterDBList.push({ cost: (Math.ceil((db.size*pricePerGB)*100)/100) });
        matchDB.cost = (Math.ceil((db.size*pricePerGB)*100)/100);
      } else {
        // Pushes everything if does not exist
        masterDBList.push({
          database_id: db.database_id,
          name: db.name,
          paths: [db.path],
          size: db.size,
          cost: (Math.ceil((db.size*pricePerGB)*100)/100)
        });
      }
    });
    res.status(200).send("Success");
  } else {
    res.status(401).send("401 Unauthorized");
  }
  console.log(masterDBList.length);
});

app.get('/databases', function (req, res) {
  if (req.headers.auth == token) {
    res.json(masterDBList);
  } else {
    res.status(401).send("401 Unauthorized");
  }
});

app.post('/auth', (req, res) => {

  var code = 547893467;

  if (code == 547893467) {
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
function deleteServers(array) {
  console.log('function deleteServers runs');
  //gets current time, sets reference time to 24 hours before current time
  var curTime = new Date();
  var referenceTime = new Date();

  referenceTime.setHours(curTime.getHours() - 28);
  referenceTime = referenceTime.toISOString().split('.')[0];
  console.log('Reference time: ' + referenceTime);
  var toDelete = [];
  //iterates through hyperVisorList and deleted any item with LastCheckInTime older than reference time
  array.forEach((item, index) => {
    console.log(item.VMName + ': ' + item.LastCheckInTime)
    if (item.LastCheckInTime < referenceTime) {
      toDelete.push(index)
      console.log('Outdated, deleting: ' + item.VMName);
    } else if (item.LastCheckInTime > referenceTime) {
      console.log('Current, keeping: ' + item.VMName);
    } else {
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

app.post('/messages', function (req, res) {
  // console.log(request.body);
  if (req.headers.auth) {
    notificationMessage = req.body.message;
    notificationTime = req.body.timestamp;
    res.status(200).send("Success");
  } else {
    res.status(401).send("401 Unauthorized");
  }
});

app.get('/messages', function (req, res) {
  if (req.headers.auth == token) {
    res.status(200).send(JSON.stringify({ message: notificationMessage, timestamp: notificationTime }));
  } else {
    res.status(401).send("401 Unauthorized");
  }
});

let user_data = {
  departments: {},
  totalUsers: 0,
  serviceAccounts: 0,
  title: {},
  manager: {}
};



app.post('/users', (req, res) => {
  user_data = {
    departments: {},
    totalUsers: 0,
    serviceAccounts: 0,
    title: {},
    manager: {}

  };
  var reqData = req.body.users;
  if (req.headers.auth == token) {
    if (reqData == undefined || reqData == null) {
      res.status(400).send("400 Bad Request");
      return;
    }
    reqData.forEach(function (user) {
      if (user.enabled && user.ServiceAccount) {
        user_data.serviceAccounts++;

      }
      if (!user.enabled || user.ServiceAccount) return;
      if (user.department == null) {
        return;
      }
      if (user_data.departments[user.department] == undefined) {
        user_data.departments[user.department] = 0;
      }
      user_data.departments[user.department]++;
      user_data.totalUsers++;
      if (user_data.title[user.title] == undefined) {
        user_data.title[user.title] = 0;
      }
      user_data.title[user.title]++;
      if (user_data.manager[user.manager] == undefined) {
        user_data.manager[user.manager] = 0;
      }
      if (user.manager == null) {
        return;
      }
      user_data.manager[user.manager]++;
    });
    res.status(200).send("Success");
  } else {
    res.status(401).send("401 Unauthorized");
  }

});



app.get('/users', (req, res) => {
  if (req.headers.auth == token) {
    res.status(200).json(user_data);
  } else {
    res.status(401).send("401 Unauthorized");
  }
});

app.post('/internalDB', function (req, res) {
  var reqData = (req.body); // store the request body
  if (req.headers.auth == token) {
    res.status(200).send("Success");
    internalDBList = [];
    reqData.forEach(function (db) {
      // check if the database is already in the list
      if (internalDBList.some(existingDB => existingDB.database_id === db.database_id)) {
        // find the matching database in masterDBList
        var matchDB = internalDBList.find(existingDB => existingDB.database_id === db.database_id);
        console.log(db.name + " is already in the internalDBList");
        matchDB.paths.push(db.path);
        console.log(matchDB.paths);
        // combine the sizes
        matchDB.size += db.size;
      } else {
        // Pushes everything if does not exist
        internalDBList.push({
          database_id: db.database_id,
          name: db.name,
          paths: [db.path],
          size: db.size
        });
      }
    });
  } else {
    res.status(401).send("401 Unauthorized");
  }
  console.log(internalDBList.length);
});

app.get('/internalDB', function (req, res) {
  if (req.headers.auth == token) {
    res.json(internalDBList);
  } else {
    res.status(401).send("401 Unauthorized");
  }
});

async function getAzDBPrice() {
  const url = "https://prices.azure.com/api/retail/prices?$filter=productName eq 'Standard SSD Managed Disks' and location eq 'US East' and meterName eq 'E60 Disks'";
  const response = await fetch(url)
  const body = await response.json();
  pricePerGB = body.Items[0].retailPrice / 8192;
}

app.listen(3000);
