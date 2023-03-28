const express = require("express");
const app = express();
app.use(express.json());

const { getTopics, getArticlesById } = require("./controllers/data.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./error-handling");

app.get("/api/topics", getTopics);
app.get("/api/articles/:articles_id", getArticlesById);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
