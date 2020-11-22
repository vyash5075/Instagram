const express = require("express");
const app = express(); //invoke
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const auth = require("./routes/auth");
const post = require("./routes/post");
const user = require("./routes/user");
const bodyParser = require("body-parser");
app.use(cors());
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connection.on("connected", () => {
  console.log("coonected to mongo");
});
mongoose.connection.on("error", () => {
  console.log("connected to mongo");
});
app.use("/", auth);
app.use("/post", post);
app.use("/user", user);

app.listen(4000, () => {
  console.log("server is running");
});
