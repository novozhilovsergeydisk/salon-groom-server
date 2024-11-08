'use strict';

const server = require('./server/http-server');
const HOST_NAME = process.env.APP_HOST_NAME;
const PORT = process.env.APP_PORT;

server.start(PORT, HOST_NAME);

