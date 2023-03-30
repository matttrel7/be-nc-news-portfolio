exports.handlePSQL400s = (err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article or author not found" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing contents" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle500Statuses = (err, req, res, next) => {
  // console.log(err);
  res.status(500).send({ msg: "Sorry, we have made a server error" });
};
