import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const FONTS = [
  "Dancing Script",
  "Pacifico",
  "Caveat",
  "Shadows Into Light",
  "Indie Flower",
];

export default function App() {
  /* Assets (public folder) */
  const vases = [
    "/assets/vases/vase1.png",
    "/assets/vases/vase2.png",
  ];

  const flowers = [
    "/assets/flowers/rose.png",
    "/assets/flowers/tulip.png",
    "/assets/flowers/daisy.png",
  ];

  const leaves = [
    "/assets/leaves/leaf1.png",
    "/assets/leaves/leaf2.png",
  ];

  const decor = [
    "/assets/decor/heart.png",
    "/assets/decor/ribbon.png",
    "/assets/decor/star.png",
  ];

  /* State */
  const [selectedVase, setSelectedVase] = useState(vases[0]);
  const [elements, setElements] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [letterText, setLetterText] = useState("");
  const [font, setFont] = useState("Dancing Script");

const [fontOpen, setFontOpen] = useState(false);


  const canvasRef = useRef(null);

  /* Drag from panel */
  const handleDragStart = (e, src) => {
    e.dataTransfer.setData("imageSrc", src);
  };

  /* Drop onto canvas */
  const handleDrop = (e) => {
    e.preventDefault();
    const src = e.dataTransfer.getData("imageSrc");
    const rect = canvasRef.current.getBoundingClientRect();

    setElements((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        src,
        x: e.clientX - rect.left - 40,
        y: e.clientY - rect.top - 40,
      },
    ]);
  };

  /* Move existing items */
  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const el = elements.find((el) => el.id === id);

    setActiveId(id);
    setOffset({
      x: e.clientX - rect.left - el.x,
      y: e.clientY - rect.top - el.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!activeId) return;
    const rect = canvasRef.current.getBoundingClientRect();

    setElements((prev) =>
      prev.map((el) =>
        el.id === activeId
          ? {
              ...el,
              x: e.clientX - rect.left - offset.x,
              y: e.clientY - rect.top - offset.y,
            }
          : el
      )
    );
  };

  const handleMouseUp = () => setActiveId(null);

  /* Reset Canvas */
  const resetCanvas = () => {
    setElements([]);
    setLetterText("");
    setSelectedVase(vases[0]);
  };

  /* Export PNG */
  const exportPNG = async () => {
    if (!canvasRef.current) return;

    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "digital-bouquet.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="app">
      {/* LEFT PANEL */}
      <aside className="left-panel">
        <h2>Library</h2>

        <section>
          <h3>Vases</h3>
          <div className="item-grid">
            {vases.map((v, i) => (
              <img
                key={i}
                src={v}
                className={selectedVase === v ? "active" : ""}
                onClick={() => setSelectedVase(v)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3>Flowers</h3>
          <div className="item-grid">
            {flowers.map((f, i) => (
              <img
                key={i}
                src={f}
                draggable
                onDragStart={(e) => handleDragStart(e, f)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3>Leaves</h3>
          <div className="item-grid">
            {leaves.map((l, i) => (
              <img
                key={i}
                src={l}
                draggable
                onDragStart={(e) => handleDragStart(e, l)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3>Decor</h3>
          <div className="item-grid">
            {decor.map((d, i) => (
              <img
                key={i}
                src={d}
                draggable
                onDragStart={(e) => handleDragStart(e, d)}
              />
            ))}
          </div>
        </section>
      </aside>

      {/* CANVAS */}
      <main className="canvas-area">
        <div
          className="canvas"
          ref={canvasRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {elements.map((el) => (
            <img
              key={el.id}
              src={el.src}
              className="canvas-item"
              style={{ left: el.x, top: el.y }}
              onMouseDown={(e) => handleMouseDown(e, el.id)}
              draggable={false}
            />
          ))}

          {/* Letter on canvas */}
          <div className="canvas-letter" style={{ fontFamily: font }}>
            {letterText}
          </div>




          <img src={selectedVase} className="vase-fixed" />
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">
        <h2>Letter</h2>

        <div className="font-dropdown">
        <div
          className="font-selected"
          style={{ fontFamily: font }}
          onClick={() => setFontOpen(!fontOpen)}
        >
          {font}
          <span>▾</span>
        </div>

        {fontOpen && (
          <div className="font-options">
            {FONTS.map((f) => (
              <div
                key={f}
                className="font-option"
                style={{ fontFamily: f }}
                onClick={() => {
                  setFont(f);
                  setFontOpen(false);
                }}
              >
                {f}
              </div>
            ))}
          </div>
        )}
      </div>




        <textarea
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
          placeholder="Write your letter..."
          style={{ fontFamily: font }}
        />


        <div className="button-group">
          <button onClick={resetCanvas}>Reset</button>
          <button onClick={exportPNG}>Save as PNG</button>
        </div>
      </aside>
    </div>
  );
}
