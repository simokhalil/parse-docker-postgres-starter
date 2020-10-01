var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');

const mountPath = process.env.PARSE_MOUNT || '/parse';
const port = process.env.PORT || 1337;
const databaseURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';
const cloudPath = __dirname + '/cloud/main.js';
const appId = process.env.APP_ID || 'myAppId';
const masterKey = process.env.MASTER_KEY || '';
const serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
const logLevel = process.env.LOG_LEVEL || 'info';
const allowInsecureHTTP = process.env.ALLOW_INSECURE_HTTP_DASHBOARD;
const appName = process.env.APP_NAME;
const dashboard_user = process.env.DASHBOARD_USER;
const dashboard_password = process.env.DASHBOARD_PASSWORD;

var api = new ParseServer({
  databaseURI: databaseURI,
  cloud: cloudPath,
  appId: appId,
  masterKey: masterKey,
  serverURL: serverURL,
  logLevel: logLevel,
})

var dashboard = new ParseDashboard(
  {
    apps: [
      {
        serverURL: serverURL,
        appId: appId,
        masterKey: masterKey,
        appName: appName,
      },
    ],
    users: [
      {
        user: dashboard_user,
        pass: dashboard_password,
        apps: [{ appId: appId }],
      },
    ],
  },
  //options
  { allowInsecureHTTP: allowInsecureHTTP }
)

var app = express();
app.use(mountPath, api);
app.use('/dashboard', dashboard);

var httpServer = require('http').createServer(app)
httpServer.listen(port, function() {
  console.log('parse-server running on port ' + port + '.')
});

