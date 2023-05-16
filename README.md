# Northcoders News API

## Background

This API provides access to news articles and comments. It was built using PostgreSQL and Node.js with the Node-Postgres library.

## Usage

The API is currently hosted at https://nc-news-usvg.onrender.com/api

## Endpoints

The API supports the following endpoints:

- GET `/api/topics`: Returns all topics.
- GET `/api/users/:username`: Returns a specific user by their username.
- GET `/api/articles/:article_id`: Returns a specific article by its ID.
- PATCH `/api/articles/:article_id`: Updates the vote count of a specific article.
- GET `/api/articles/:article_id/comments`: Returns all comments for a specific article.
- POST `/api/articles/:article_id/comments`: Adds a new comment to a specific article.
- PATCH `/api/comments/:comment_id`: Updates the vote count of a specific comment.
- DELETE `/api/comments/:comment_id`: Deletes a specific comment.

For detailed information on each endpoint and their usage, refer to the `endpoints.json` file.
