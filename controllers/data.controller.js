const {
  fetchTopics,
  fetchArticles,
  fetchArticlesById,
  fetchComments,
  checkArticleExists,
  insertComment,
  updateArticle,
  removeComment,
} = require("../models/data.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlesById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const id = req.params.article_id;

  const commentPromises = [fetchComments(id), checkArticleExists(id)];

  Promise.all(commentPromises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const articleId = req.params.article_id;
  insertComment(newComment, articleId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const voteNumber = req.body.inc_votes;
  const articleId = req.params.article_id;
  updateArticle(voteNumber, articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeComment(commentId)
    .then((comment) => {
      res.status(204).send({ msg: "No content" });
    })
    .catch((err) => {
      next(err);
    });
};
