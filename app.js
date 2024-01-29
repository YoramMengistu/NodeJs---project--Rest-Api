const { path } = require("@hapi/joi/lib/errors");
const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const PATH = require("path");
mongoose
  .connect(process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_LOCAL)
  .then(
    () => console.log("Connected to MongoDb...."),
    console.log("MONGO_URI_ATLAS:", process.env.MONGO_URI_ATLAS),
    console.log("PORT_ATLAS:", process.env.PORT_ATLAS)
  )
  .catch(() => console.log("could not connect to MongoDb..."));

const app = express();
const http = require("http").Server(app);

app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(PATH.join(__dirname, "public")));
app.use((req, res) => {
  res.status(400).send("404 Not Found");
});

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cards", require("./routes/cards"));
let PORT = process.env.PORT_LOCAL || process.env.PORT_ATLAS || 3000;
http.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
