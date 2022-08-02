require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log(`server runs on port: ${PORT}😄`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
