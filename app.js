require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const port = 5000;
const allRoutes = require("./routes/index");
const connectDB = require("./config/connectDB");
const { errorHandler } = require("./middlewares/errorHandler");
const cors = require("cors");
const { corsOptions } = require("./config/corsOptions");
const path = require("path");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

//connect to mongodb
connectDB();

app.use(cookieParser());

app.use(cors(corsOptions));

// parse json request data
app.use(express.json())

app.use(helmet());

app.use(xss());

app.use(mongoSanitize());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", allRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ status: "error", message: "404 Not Found" });
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
