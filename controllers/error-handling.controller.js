exports.handlePSQL400s = (err, req, res, next) => {
  console.log(err.code);
  if (err.code === "22P02") {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
