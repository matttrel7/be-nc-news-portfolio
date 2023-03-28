const express = require("express");
const app = express();
app.use(express.json());

const {
  getTopics,
  getArticlesById,
  getArticles,
} = require("./controllers/data.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./error-handling");

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Working okay" });
});
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
