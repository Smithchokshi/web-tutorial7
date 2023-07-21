const express = require('express');
const cors = require('cors');
const http = require('http');
const { dbConnection } = require('./config/config');
const userRoute = require('./Routes/userRoute');

const app = express();
const server = http.createServer(app);
require('dotenv').config();

dbConnection();

app.use(express.json());
app.use(cors());

app.use('/', userRoute);

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log('Server is running', PORT);
});
