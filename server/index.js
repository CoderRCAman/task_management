require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const empRouter = require("./routes/empRouter");
const projectRouter = require("./routes/projectRouter");
const morgan = require("morgan");

const app = express();
app.use(express.static("avatars")); //✔
app.use(express.static("file-store")); //✔
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    optionsSuccessStatus: 200,
    origin: "http://localhost:3000",
  })
);
app.use(morgan("tiny"));

app.use("/user", userRouter);
app.use("/api", empRouter);
app.use("/api", projectRouter);

const URI =
  "mongodb+srv://himanshu:1234@cluster0.gjbk8zo.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
