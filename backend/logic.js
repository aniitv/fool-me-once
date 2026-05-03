import { notificationS } from "./src/services/notificationS.js";

// Stars on background
export function* starGenerator() {
  while (true) {
    yield {
      id: Math.random().toString(36).substr(2),
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      size: 10 + Math.random() * 5,
    };
  }
}

export function* Shuffle(cards) {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    yield [...shuffled];
  }

  notificationS.add("Cards shuffled successfully", "success", 2);
}

export function* flipSequence(cards, timeout) {
  const startTime = Date.now();

  notificationS.add("Starting card reveal...", "info", 1);

  for (let i = 0; i < cards.length; i++) {
    const currentTime = Date.now();
    const end = currentTime - startTime;
    if (end > timeout) {
      notificationS.add("Reveal timeout reached", "error", 5);
      return;
    }
    yield cards[i];
  }

  notificationS.add("All cards revealed", "success", 3);
}

let savedReadings = [];

export const saveReadingSimple = (data) => {
  const newEntry = {
    ...data,
    id: Date.now(),
    timestamp: new Date(),
  };

  savedReadings.push(newEntry);

  notificationS.add("Tarot reading saved", "success", 3);
  return newEntry;
};

export const getAllReadingsSimple = () => {
  notificationS.add("Readings fetched", "info", 1);
  return savedReadings;
};
