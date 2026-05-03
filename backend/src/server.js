import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import collection from "./config.js";
import mongoose from "mongoose";
import { memoize } from "./memoize.js";
import aiRouter from "../src/routes/ai.js";
import notificationRouter from "../src/routes/notification.js";
import savedRoutes from "../src/routes/savedRoutes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json(), express.urlencoded({ extended: false }));

const checkPassword = (password) => {
  console.log("calculating...");
  return password.length < 8 ? "Weak" : "Strong";
};

const memoCheck = memoize(checkPassword, 10);

app.use("/api/ai", aiRouter);
app.use("/notification", notificationRouter);

app.post("/signup", async (req, res) => {
  const { username: name, password } = req.body;
  const strength = memoCheck(req.body.password);
  console.log("Password strength:", strength);
  try {
    if (await collection.findOne({ name })) {
      return res.send(
        "User already exists. Please choose a different username.",
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userdata = await collection.create({
      name,
      password: hashedPassword,
    });

    console.log("Created:", userdata);
    res.send("You succesfully created a new account, try to log in");
  } catch (e) {
    res.status(500).send("Signup error");
  }
});

app.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await collection.findOne({ name: username });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.send("success");
    }

    res.send(user ? "Wrong password" : "User name cannot be found");
  } catch (e) {
    res.status(500).send("Signin error");
  }
});
app.use("/api/saved", savedRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
