const express = require("express");

require("dotenv").config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", (req, res) => {
  return res.json({ msg: "this is the home page." });
});

app.listen(process.env.PORT, async () => {
  console.log(`Server Started at port: ${process.env.PORT}`);
});
