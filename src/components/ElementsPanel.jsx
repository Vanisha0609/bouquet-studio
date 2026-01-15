const assets = {
  flowers: ["rose.png", "tulip.png", "daisy.png", "sunflower.png"],
  leaves: ["leaf1.png", "leaf2.png"],
  decor: ["heart.png", "bow.png", "sparkle.png"]
};

export default function ElementsPanel({ addElement }) {
  const setCategory = (type) => {
    const container = document.getElementById("elements");
    container.innerHTML = "";

    assets[type].forEach(file => {
      const img = document.createElement("img");
      img.src = `/src/assets/${type}/${file}`;
      img.onclick = () => addElement(img.src);
      container.appendChild(img);
    });
  };

  return (
    <aside className="panel left">
      <h3>Elements</h3>

      <div className="tabs">
        <button onClick={() => setCategory("flowers")}>Flowers</button>
        <button onClick={() => setCategory("leaves")}>Leaves</button>
        <button onClick={() => setCategory("decor")}>Decor</button>
      </div>

      <div id="elements" className="elements"></div>
    </aside>
  );
}

