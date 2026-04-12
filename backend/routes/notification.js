import express from "express";
import { notificationS } from "../services/notificationS.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(notificationS.getAll());
});

router.get("/:type", (req, res) => {
  const { type } = req.params;
  const result = notificationS.get(type);
  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No notifications found" });
  }
});

router.post("/", (req, res) => {
  const { message, type, priority } = req.body;
  const notification = notificationS.add(message, type, priority);

  res.json(notification);
});

router.delete("/:type", (req, res) => {
  const remove = notificationS.remove(req.params.type);

  res.json(remove);
});

export default router;
