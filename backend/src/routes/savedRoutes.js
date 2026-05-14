import express from "express";
import { asyncFilterPromise } from "./asyncArray.js";
import { withLogging, setLogLevel } from "../../utils/logger.js";

const router = express.Router();

setLogLevel("INFO");

export class BiPriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(item, priority) {
    const newNode = { item, priority };
    const index = this.elements.findIndex((el) => el.priority < priority);

    if (index === -1) {
      this.elements.push(newNode);
    } else {
      this.elements.splice(index, 0, newNode);
    }

    if (this.elements.length > 10) {
      this.elements.pop();
    }
  }
}

const savedQueue = new BiPriorityQueue();

savedQueue.enqueue = withLogging(savedQueue.enqueue.bind(savedQueue), "INFO");

router.post("/save", async (req, res) => {
  const { images, priority } = req.body;

  try {
    const validImages = await asyncFilterPromise(images || [], (img) =>
      Promise.resolve(typeof img === "string" && img.trim() !== ""),
    );

    const priorityLevel = priority || 1;
    savedQueue.enqueue({ images: validImages }, priorityLevel);
    res.json({ message: "saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", (req, res) => {
  res.json(savedQueue.elements);
});

export default router;
