import express from "express";
import { memoizedAi } from "../services/memoizedAI.js";

const router = express.Router();

router.post("/interpret", async (req, res) => {
  try {
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: "No cards provided" });
    }

    const results = await memoizedAi(cards);

    res.json({
      source: "gemini-proxy-batch",
      interpretations: results,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
