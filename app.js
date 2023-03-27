const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/data.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
} = require("./controllers/error-handling.controller");

app.get("/api/topics", getTopics);

app.use(handlePSQL400s);
app.use(handleCustomErrors);

module.exports = app;