require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//middlewares....
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(fileUpload());

const PORT = process.env.PORT || 8000;

//db connection....and starting the server....
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
