\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;

SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id)AS INT) AS comment_count
      FROM comments
      RIGHT JOIN articles
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
      ORDER BY created_at DESC;