import express from "express";
const router = express.Router();

let savedReadings = [];

router.post("/save", (req, res) => {
  const { images } = req.body;

  const newReading = {
    item: { images },
    id: Date.now(),
  };

  savedReadings.push(newReading);
  res.json({ message: "saved successfully" });
});

router.get("/all", (req, res) => {
  res.json(savedReadings);
});

export default router;
