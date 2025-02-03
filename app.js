require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const categoriesRouter = require("./routes/category");
const userRouter = require("./routes/user");

const expressSession = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// Connect to MongoDB
connectDB();

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

require("./config/google_oauth_config.js");

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/categories", categoriesRouter);
app.use("/users", userRouter);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
