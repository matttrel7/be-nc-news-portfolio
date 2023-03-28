exports.handlePSQL400s = (err, req, res, next) => {
  // console.log(err.code, err.status, err.msg);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};
