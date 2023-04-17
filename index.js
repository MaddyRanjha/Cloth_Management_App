require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fileupload= require('express-fileupload');
const connection = require("./Database/db");
const userRegister = require("./Routes/Users");
const authRoutes = require("./Routes/Login");
const clothRoutes = require("./Routes/Cloth");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

//file uploading
app.use(fileupload());

// routes
app.use("/api/users", userRegister);
app.use("/api/auth", authRoutes);
app.use("/api/manageCloth", clothRoutes);



const port =8000;
app.listen(port, console.log(`Listening on port ${port}...`));
