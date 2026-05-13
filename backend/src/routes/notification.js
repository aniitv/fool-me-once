import express from "express";
import { notificationS } from "../services/notificationS.js";

const router = express.Router();

router.get("/subscribe", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onNotification = (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };

  notificationS.emitter.on("new_notification", onNotification);

  req.on("close", () => {
    notificationS.emitter.off("new_notification", onNotification);
  });
});

router.get("/", (req, res) => {
  res.json(notificationS.getAll());
});

router.get("/:type", (req, res) => {
  const { type } = req.params;
  const result = notificationS.getByType(type);

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(404).json({ error: "No notifications found" });
  }
});

router.post("/", (req, res) => {
  const { message, type, priority } = req.body;
  const notification = notificationS.add(message, type, priority);

  if (!notification) {
    return res.status(400).json({ error: "Message is required" });
  }

  res.json(notification);
});

router.delete("/", (req, res) => {
  const removed = notificationS.remove();
  res.json(removed);
});

router.delete("/:type", (req, res) => {
  const removed = notificationS.removeByType(req.params.type);

  if (!removed) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(removed);
});

export default router;
