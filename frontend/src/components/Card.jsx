function Card({ card, interpretation }) {
  return (
    <div className="card-container">
      <div className="card-body">
        <img src={card.image} className="card-image" />
      </div>

      <h3 className="card-title">{card.name}</h3>

      <p>{interpretation}</p>
    </div>
  );
}

export default Card;
