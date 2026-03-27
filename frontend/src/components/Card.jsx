import { useEffect, useState } from "react";

function Card({ card, isReversed }) {
    const [interpretation, setInterpretation] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/interpret?cardName=$(card.name)}&isReversed=${isReversed}`)

            .then((response) => response.json())
            .then((data) => setInterpretation(data.interpretation))
            .catch(() => setInterpretation("Error fetching interpretation"));

    }, [card.name, isReversed]);

    return (
        <div>
            <h2>{card.name}</h2>
            <img src={card.image} className="card-image" />
            <p>{interpretation}</p>
        </div>
    );
}

export default Card;