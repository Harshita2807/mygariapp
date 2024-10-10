// const dotenv = require("dotenv");
// dotenv.config();
// const express = require('express');
// const app = express();
// const server = require("http").createServer(app);
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
const connectDB = require('./src/app/config/connectDB');
connectDB();



// server.listen(process.env.PORT || 8080, () => console.log("Server is listening on port 8080..."));
