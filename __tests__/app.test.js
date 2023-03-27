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
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(3);
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
