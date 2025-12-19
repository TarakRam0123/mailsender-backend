const express = require("express");
const { connect } = require("./config/db");
const { config } = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const googleRoutes = require("./routes/googleRoutes");
const mailRouter = require("./routes/mailRoutes");

const app = express();

config();
app.use(cors({ origin: process.env.FRONT_END, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/", googleRoutes);
app.use("/mail", mailRouter);

connect();

app.get("/test", (req, res) => {
  res.send("Server OK");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
