import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import collection from "./config.js";
import { memoize } from "./memoize.js";
import aiRouter from "./routes/ai.js";
import notificationRouter from "./routes/notification.js";
import savedRoutes from "./routes/savedRoutes.js";
import cardsRouter from "./routes/cards.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const checkPassword = (password) => {
  return password.length < 8 ? "Weak" : "Strong";
};

const memoCheck = memoize(checkPassword, 10);

app.use("/api/ai", aiRouter);
app.use("/notifications", notificationRouter);
app.use("/api/saved", savedRoutes);
app.use("/api/cards", cardsRouter);

app.post("/signup", async (req, res) => {
  const { username: name, password } = req.body;

  if (!name || !password) {
    return res.status(400).send("Username and password are required");
  }

  const strength = memoCheck(password);

  try {
    const existingUser = await collection.findOne({ name });
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userdata = await collection.create({
      name,
      password: hashedPassword,
    });

    res
      .status(201)
      .send("You successfully created a new account, try to log in");
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

app.listen(5000, () => console.log("Server running on port 5000"));
