const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const {
  getTopics,
  getArticlesById,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  getUsers,
  deleteComment,
} = require("./controllers/data.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./error-handling");

app.get("/api", (req, res) => {
  res.status(200).send({
    msg: "Working okay",
    end_points: [
      "/api/topics",
      "/api/articles",
      "/api/articles/:article_id",
      "/api/articles/:article_id/comments",
      "/api/users",
    ],
  });
});
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);
app.get("/api/users", getUsers);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
