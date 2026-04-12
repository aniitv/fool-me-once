import { useEffect, useState } from "react";

function Card({ card, isReversed }) {
    const [interpretation, setInterpretation] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/interpretation?cardName=${card.name}&isReversed=${isReversed}`)

            .then((response) => response.json())
            .then((data) => setInterpretation(data.interpretation))
            .catch(() => setInterpretation("Error fetching interpretation"));

    }, [card.name, isReversed]);

    return (
        <div className="card-container">
        <div className="card-body">
            <img src={card.image} className="card-image" />
        </div>

        <h3 className="card-title">{card.name}</h3>
    </div>
    );
}

export default Card;
