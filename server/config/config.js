//This file holds any configuration variables we may need 
//'config.js' is typically ignored by git to protect sensitive information, such as your database's username and password

var fs = require('fs'),
configPath = __dirname + '/password.json'
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));


module.exports = {
  port: process.env.PORT || "8080",
  storageConfig: parsed
};