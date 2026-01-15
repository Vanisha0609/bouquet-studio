export default function VaseSelector({ setVase }) {
  const loadVase = (src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => setVase(img);
  };

  return (
    <>
      <h3>Choose a Vase</h3>
      <div className="vases">
        <img src="/src/assets/vases/classic.png" onClick={() => loadVase("/src/assets/vases/classic.png")} />
        <img src="/src/assets/vases/round.png" onClick={() => loadVase("/src/assets/vases/round.png")} />
        <img src="/src/assets/vases/heart.png" onClick={() => loadVase("/src/assets/vases/heart.png")} />
      </div>
    </>
  );
}
