import * as express from 'express';
import fetch from 'node-fetch';

/**
 * Contains all API routes for the application.
 */
const router = express.Router();

const appId = process.env.APP_ID || 'myAppId';
const masterKey = process.env.MASTER_KEY || '';
const serverURL = process.env.SERVER_URL || 'http://localhost:1337/parse';

/**
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    api: req.app.locals.title,
    version: req.app.locals.version,
    environment: process.env.ENVIRONMENT,
  });
});

/**
 * Endpoint that calls a cloud code with mastrkey and returns the response
 * it's a public gateway since cloud code requires authentication
 */
router.post('/test', (req, res) => {
  // call cloud function passing in master key
  // add X-Parse-Master-Key as http header
  fetch(`${serverURL}/functions/test`, {
    method: 'post',
    body: '{}',
    headers: {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': appId,
      'X-Parse-Master-Key': masterKey,
    },
  })
  .then(response => response.json())
  .then((response) => {
    res.json(response);
  });
});

export default router;
