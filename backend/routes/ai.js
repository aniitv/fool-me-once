import express, { text } from "express";
import { Promise } from "../utils/Promise.js";
import { memoizedAi } from "../services/memoizedAI.js";

const router = express.Router();

router.post("/interpret", async (req, res) => {
  try {
    const { cards } = req.body;
    const results = await Promise(cards, (card, { signal }) =>
      memoizedAi(card, { signal }),
    );

    res.json({
      source: "gemini",
      cards,
      interpretations: results,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to interpret cards" });
  }
});

export default router;
