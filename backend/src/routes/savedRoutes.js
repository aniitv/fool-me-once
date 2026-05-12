import express from "express";
import { EventEmitter } from "events";

const router = express.Router();
const tracker = new EventEmitter();

tracker.on("log", ({ level, message, details }) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  if (details) console.dir(details);
});

const validateAsync = (item) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 200));
};

async function* dataStreamGenerator(elements) {
  for (const el of elements) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    yield { ...el, processedAt: new Date().toISOString() };
  }
}

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

router.post("/save", async (req, res) => {
  const { images, priority } = req.body;

  try {
    const results = await Promise.all(
      (images || []).map((img) => validateAsync(img)),
    );
    const validatedImages = (images || []).filter((_, i) => results[i]);

    const priorityLevel = priority || 1;
    savedQueue.enqueue({ images: validatedImages }, priorityLevel);

    tracker.emit("log", {
      level: "info",
      message: "Card successfully saved to queue",
      details: { priority: priorityLevel, itemsCount: validatedImages.length },
    });

    res.json({ message: "saved successfully" });
  } catch (err) {
    tracker.emit("log", {
      level: "error",
      message: `Save failed: ${err.message}`,
    });
    res.status(500).json({ error: err.message });
  }
});

router.get("/stream-data", async (req, res) => {
  const stream = dataStreamGenerator(savedQueue.elements);
  const processedData = [];

  for await (const item of stream) {
    processedData.push(item);
  }

  res.json({ status: "success", data: processedData });
});

router.get("/all", (req, res) => {
  res.json(savedQueue.elements);
});

export default router;
