import { useEffect, useState } from "react";
import { starGenerator } from "../lib/starGenerator";
import "../styles/stars.css";

export default function Background() {
    const [star, setStar] = useState([]);
   
  useEffect (() => {
    const generator = starGenerator();
    const interval = setInterval(() => {
        const { value } = generator.next();
        setStar(prev => [...prev, value]);
    }, 100)
    return () => clearInterval(interval);
  }, [])

  return (
      <div className="star-container">
          {star.map((star) => (
            <span
              key={star.id}
              className="star"
              style={{
                left: `${star.left}%`,
                fontSize: `${star.size}px`,
                animationDuration: `${star.duration}s`,
              }}
            >
              ✦
            </span>
          ))}
        </div>
  )
}

