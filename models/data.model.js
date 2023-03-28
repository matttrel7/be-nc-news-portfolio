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

exports.fetchArticles = (id) => {
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
