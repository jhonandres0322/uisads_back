require('dotenv').config();

const Server = require('./src/models/server_model');
const server = new Server();

server.listen();