const db = require("../db/connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("../db/seeds/utils");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    if (result.rows.length > 0) {
      const topics = result.rows;
      return topics;
    } else {
      return Promise.reject({ status: 404, msg: "Invalid request" });
    }
  });
};

exports.fetchArticlesById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid ID" });
      }
      const article = result.rows[0];
      return article;
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id)AS INT) AS comment_count
      FROM comments
      RIGHT JOIN articles
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
      ORDER BY created_at DESC;`
    )
    .then((result) => {
      if (result.rows.length > 0) {
        const articles = result.rows;
        return articles;
      }
    });
};

exports.fetchComments = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid ID" });
      }
      const article = result.rows;
      return article;
    });
};
