const express = require("express");
const { connect } = require("./config/db");
const { config } = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect();

app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.send("Server OK");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on", process.env.PORT);
});
