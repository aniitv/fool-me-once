import express from "express";
const router = express.Router();

export class BiPriorityQueue {
  constructor() {
    //{ item, priority, timestamp }
    this.elements = [];
  }
  enqueue(item, priority) {
    const newNode = {
      item,
      priority,
      timestamp: Date.now(),
    };

    this.elements.push(newNode);
    this.elements.sort((a, b) => b.priority - a.priority);

    if (this.elements.length > 10) {
      this.elements.pop();
    }
  }
  dequeue() {
    return this.elements.shift();
  }
  isEmpty() {
    return this.elements.length === 0;
  }
  peek() {
    return this.elements[0];
  }
}

const savedQueue = new BiPriorityQueue();

router.post("/save", (req, res) => {
  const { images, priority } = req.body;
  savedQueue.enqueue({ images }, priority || 1);
  res.json({ message: "saved successfully" });
});

router.get("/all", (req, res) => {
  res.json(savedQueue.elements || []);
});

export default router;
