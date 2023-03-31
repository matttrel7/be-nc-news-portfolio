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

exports.fetchComments = (id, order_by) => {
  let selectCommentsQueryStr = `SELECT * FROM comments`;
  const queryParams = [];

  if (id) {
    selectCommentsQueryStr += ` WHERE article_id = $1`;
    queryParams.push(id);
  }

  if (order_by) {
    selectCommentsQueryStr += ` ORDER BY created_at ${order_by}`;
  } else {
    selectCommentsQueryStr += ` ORDER BY created_at DESC`;
  }
  return db.query(selectCommentsQueryStr, queryParams).then((result) => {
    const article = result.rows;
    return article;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.insertComment = (newComment, articleId) => {
  const { body, author } = newComment;
  const psqlQuery = `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`;

  return db.query(psqlQuery, [body, articleId, author]).then((result) => {
    return result.rows[0];
  });
};

exports.updateArticle = (votes, articleId) => {
  const psqlQuery = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(psqlQuery, [votes, articleId]).then((result) => {
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
  });
};


exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    if (result.rowCount > 0) {
      const users = result.rows;
      return users;
    } else {
      return Promise.reject({ status: 404, msg: "Invalid request" });

exports.removeComment = (commentId) => {
  const psqlQuery = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;

  return db.query(psqlQuery, [commentId]).then((result) => {
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return Promise.reject({ status: 404, msg: "Comment not found" });

    }
  });
};
