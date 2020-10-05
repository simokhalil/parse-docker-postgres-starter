import express, { Application } from 'express';
// import express from 'express';
import * as http from 'http';

import apiRoutes from './api';

const parseServer = require('parse-server').ParseServer;
const parseDashboard = require('parse-dashboard');

const mountPath = process.env.PARSE_MOUNT || '/parse';
const port = process.env.PORT || 1337;
const databaseURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/dev';
const cloudPath = `${__dirname}/cloud/main.js`;
const appId = process.env.APP_ID || 'myAppId';
const masterKey = process.env.MASTER_KEY || '';
const serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';
const logLevel = process.env.LOG_LEVEL || 'info';
const allowInsecureHTTP = process.env.ALLOW_INSECURE_HTTP_DASHBOARD;
const appName = process.env.APP_NAME;
const dashboardUser = process.env.DASHBOARD_USER;
const dashboardPassword = process.env.DASHBOARD_PASSWORD;

const api = new parseServer({
  databaseURI,
  appId,
  masterKey,
  serverURL,
  logLevel,
  cloud: cloudPath,
});

const dashboard = new parseDashboard(
  {
    apps: [
      {
        serverURL,
        appId,
        masterKey,
        appName,
      },
    ],
    users: [
      {
        user: dashboardUser,
        pass: dashboardPassword,
        apps: [{ appId }],
      },
    ],
  },
  // options
  { allowInsecureHTTP },
);

const app: Application = express();

app.locals.title = 'Data API';
app.locals.version = '1.0';

app.use(mountPath, api);
app.use('/dashboard', dashboard);

app.use('/api', apiRoutes);

const httpServer = http.createServer(app);

httpServer.listen(port, () => {
  console.log('parse-server running on port ', port);
});
