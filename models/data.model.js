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
      return Promise.reject({ status: 400, msg: "Invalid request" });
    }
  });
};
