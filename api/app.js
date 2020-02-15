const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
require("dotenv").config();

//connect redis dbs .
let client = redis.createClient();
client.on("connect", () => {
  console.log("connected redis server");
});

app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.static(`${__dirname}public`));

app.get("/", (req, res) => {
  let list = "";
  client.lrange("tasks", 0, 1, (err, reply) => {
    res.render("index", {
      title: list,
      task: reply
    });
  });
});

app.listen(process.env.port || 3000, () => {
  console.log("app running on port", process.env.port || 3000);
});
