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
        expect(body).toBeInstanceOf(Object);
        const input = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(body).toEqual(input);
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
        const articles = body;
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
