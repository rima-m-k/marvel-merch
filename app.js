const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8080;

const dbconnect = require("./config/dbconfig");
dbconnect.dbconnect();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

//view engine setup
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));
app.use(
  session({
    secret: "its a secret",
    resave: false,
    saveUninitialized: true,
    maxAge: 60000
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.all("*",(req,res)=> {
  res.render('user/404page')
});

//listen
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.listen(PORT, () => {
  console.log("listening on port ");
});

module.exports = app;
