import express from "express";
const router = express.Router();

const asyncFilter = async (array, predicate, signal) => {
  const results = await Promise.all(
    array.map((item) => predicate(item, signal)),
  );
  return array.filter((_, index) => results[index]);
};

const validateAsync = (item, signal) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => resolve(true), 200);
    signal?.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error("Aborted"));
    });
  });
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
    const newNode = { item, priority, timestamp: Date.now() };
    this.elements.push(newNode);
    this.elements.sort((a, b) => b.priority - a.priority);
    if (this.elements.length > 10) this.elements.pop();
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

router.post("/save", async (req, res) => {
  const { images, priority } = req.body;
  const controller = new AbortController();
  try {
    const validatedImages = await asyncFilter(
      images || [],
      (img, signal) => validateAsync(img, signal),
      controller.signal,
    );
    savedQueue.enqueue({ images: validatedImages }, priority || 1);
    res.json({ message: "saved successfully" });
  } catch (err) {
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
  res.json(savedQueue.elements || []);
});

export default router;
