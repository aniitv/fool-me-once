import express, { text } from "express";
import { memoizedAi } from "../services/memoizedAI";

const router = express.Router();

router.post("/interpret", async (req, res) => {
  try {
    const { cards } = req.body;
    const prep = await Promise.all(
      cards.map(async (card) => ({
        name: card.name,
        reversed: card.reversed,
      })),
    );

    const data = await memoizedAi(prep);

    const result = await Promise.all(
      data.interpretations.map(async (item) => ({
        card: item.card,
        text: item.text,
      })),
    );

    res.json({
      source: data.source || "AI",
      interpretations: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to interpret cards" });
  }
});

export default router;
