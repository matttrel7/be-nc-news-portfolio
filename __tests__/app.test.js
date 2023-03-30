const request = require("supertest");
const app = require("../app");
const db = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

// afterAll(() => {
//   return db.end();
// });

describe("/api/topics", () => {
  it("GET 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        const input = [
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ];
        expect(topics).toEqual(input);
      });
  });
});

describe("/api/topics - Errors", () => {
  it('404: reponds with "Not Found" if topics is misspelt', () => {
    return request(app)
      .get("/api/topiks")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});
//The created_at value was different, I just manually changed it.. feel like there is another way to do it
describe("/api/articles/:article_id", () => {
  it("GET 200: should respond with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const result = body.article;
        expect(result).toBeInstanceOf(Object);
        expect(result).toMatchObject({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});

describe("/api/articles/:article_id - Errors", () => {
  it("404: a number that isnt a valid id", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  it("400: a string instead of a number", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("/api/articles", () => {
  it("GET 200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it('404: reponds with "Not Found" if articles is misspelt', () => {
    return request(app)
      .get("/api/articul")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("GET 200: should respond with an array of comment objects ordered by created_at (desc)", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const result = body.comments;
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result).toBeSortedBy("created_at", { descending: true });
        result.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 9,
          });
        });
      });
  });
  it("404: a valid id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  it("404: comments spelt incorrectly", () => {
    return request(app)
      .get("/api/articles/1/commints")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
  it("400: a string instead of a number", () => {
    return request(app)
      .get("/api/articles/largeredwinepls/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("200: a valid article_id but it has no comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  it("POST: 201 responds with the new posted comment", () => {
    const newComment = {
      body: "Long live cats",
      author: "rogersop",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          comment: {
            comment_id: expect.any(Number),
            body: "Long live cats",
            article_id: 5,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String),
          },
        });
      });
  });
  it("POST 400: trying to add a comment to an article_id that doesnt exist", () => {
    const newComment = {
      body: "Long live cats",
      author: "rogersop",
    };
    return request(app)
      .post("/api/articles/25/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article or author not found");
      });
  });
  it("POST 400: misspell comments", () => {
    const newComment = {
      body: "Long live cats",
      author: "rogersop",
    };
    return request(app)
      .post("/api/articles/5/commints")
      .send(newComment)
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
  it("POST 400: trying to add a comment with nothing in it", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing contents");
      });
  });
  it("POST 400: trying to add a comment with missing author (username)", () => {
    const newComment = {
      body: "Long live cats",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing contents");
      });
  });
  it("POST 400: trying to add a comment with missing body", () => {
    const newComment = {
      author: "rogersop",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing contents");
      });
  });
  it("POST 400: trying to add a comment with incorrect author", () => {
    const newComment = {
      body: "Long live cats",
      author: "matt",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article or author not found");
      });
  });
  it("POST 201: responds with the new posted comment and ignores hobbies", () => {
    const newComment = {
      body: "Long live cats",
      author: "rogersop",
      hobbies: "football",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          comment: {
            comment_id: expect.any(Number),
            body: "Long live cats",
            article_id: 5,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String),
          },
        });
      });
  });
});

describe("/api/articles/:article_id", () => {
  it("PATCH: 201 repsonds with the updated article (votes incremented)", () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          article: {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            author: "rogersop",
            votes: 1,
            topic: "cats",
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          },
        });
      });
  });
  it("PATCH: 201 repsonds with the updated article (votes decremented)", () => {
    const newVote = {
      inc_votes: -50,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          article: {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            author: "rogersop",
            votes: -50,
            topic: "cats",
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          },
        });
      });
  });
  it("PATCH: 201 repsonds with the updated article (votes incremented)", () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          article: {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            author: "rogersop",
            votes: 1,
            topic: "cats",
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          },
        });
      });
  });
  it("PATCH 404: trying to add votes to an article_id that doesnt exist", () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/25")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  it("PATCH 404: misspell articles", () => {
    const newVote = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articuls/5")
      .send(newVote)
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
  it("PATCH 400: trying to update with an empty object", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing contents");
      });
  });
  it.only("PATCH 404: not a number at the end of the url", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/hello")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("PATCH 400: trying to update with an object with the wrong property", () => {
    const newVote = { author: 1 };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing contents");
      });
  });
  it("PATCH 201: trying to update with an object with multiple propertys - updates and ignores author property", () => {
    const newVote = { author: 1, inc_votes: 1 };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          article: {
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            author: "rogersop",
            votes: 1,
            topic: "cats",
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          },
        });
      });
  });
});
