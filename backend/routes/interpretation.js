import express from "express";
import { memoizedInterpretCard } from "../services/interpretationS.js";

const router = express.Router();

router.get("/interpretation", (req, res) => {
  try {
    const { cardName, isReversed } = req.query;
    const interpretation = memoizedInterpretCard(
      cardName,
      isReversed === "true",
    );
    res.json({ interpretation });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
