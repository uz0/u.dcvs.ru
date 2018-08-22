'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = require('./src/app');

const server = express();
const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(app);

server.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});
