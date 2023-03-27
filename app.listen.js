const app = require("./app");

app.listen(1878, (err) => {
  if (err) console.log(err);
  else console.log("The server is listening on port 1878...");
});
