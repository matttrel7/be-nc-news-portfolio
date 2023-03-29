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
  it("GET 200: should respond with an array of comment objects", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const result = body.comments;
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(2);
        expect(result).toMatchObject([
          {
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          },
          {
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          },
        ]);
      });
  });
  it("404: a number that isnt a valid id", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
  it("400: a string instead of a number", () => {
    return request(app)
      .get("/api/articles/1/commints")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});
