import express from "express";
import { CardList } from "../data/Cards.js";

const router = express.Router();

async function* cardGenerator(cards) {
  for (const card of cards) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    yield card;
  }
}

router.get("/stream", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const card of cardGenerator(CardList)) {
    res.write(JSON.stringify(card) + "\n");
  }

  res.end();
});

export default router;
