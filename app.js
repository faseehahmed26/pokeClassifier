const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();

// Connect to MongoDB

// User Middleware
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
console.log(__dirname);
console.log(path.join(__dirname, "/models/model_js/model.json"));

app.use(
  "/api/classify",
  express.static(path.join(__dirname, "/models/model_js/model.json"))
);

app.use("/api/", express.static(path.join(__dirname, "models/model_js")));

module.exports = app;
