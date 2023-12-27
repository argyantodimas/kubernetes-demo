const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200).send("Hello Kubernetes v1.1");
});

app.listen(port, () => {
  console.log(`app running on port ${3000}`);
});
