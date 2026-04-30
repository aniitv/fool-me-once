import express from "express";
import { memoizedAi } from "../services/memoizedAI.js";

const router = express.Router();

router.post("/interpret", async (req, res) => {
  try {
    const { cards } = req.body;

    console.log("Cards received:", cards);

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: "No cards provided" });
    }

    const results = await Promise.all(
      cards.map((card) => memoizedAi(card, {})),
    );

    res.json({
      source: "gemini-proxy",
      interpretations: results,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
