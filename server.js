require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const morgan = require("morgan");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

//cloudinary configuration..

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

//middlewares....
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.set("view engine", "ejs");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//routes.....goes here...

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/product", require("./routes/product"));

app.get("/", (req, res) => {
  res.render("signup");
});

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
