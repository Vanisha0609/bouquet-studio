import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";

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
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [letterText, setLetterText] = useState("");
  const [font, setFont] = useState(FONTS[0]);
  const [fontOpen, setFontOpen] = useState(false);

  const canvasRef = useRef(null);

  /* Drag from library */
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
        x: e.clientX - rect.left - 50,
        y: e.clientY - rect.top - 50,
        rotation: 0,
        scale: 1,
        zIndex: prev.length + 1,
      },
    ]);
  };

  /* Drag existing elements */
  const handleMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const el = elements.find((el) => el.id === id);

    setActiveId(id);
    setDraggingId(id);
    setOffset({
      x: e.clientX - rect.left - el.x,
      y: e.clientY - rect.top - el.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    const rect = canvasRef.current.getBoundingClientRect();

    setElements((els) =>
      els.map((el) =>
        el.id === draggingId
          ? {
              ...el,
              x: e.clientX - rect.left - offset.x,
              y: e.clientY - rect.top - offset.y,
            }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  /* Controls */
  const rotate = (id, amt) =>
    setElements((els) =>
      els.map((el) =>
        el.id === id ? { ...el, rotation: el.rotation + amt } : el
      )
    );

  const scaleItem = (id, amt) =>
    setElements((els) =>
      els.map((el) =>
        el.id === id
          ? { ...el, scale: Math.max(0.3, el.scale + amt) }
          : el
      )
    );

  const bringForward = (id) =>
    setElements((els) =>
      els.map((el) =>
        el.id === id ? { ...el, zIndex: el.zIndex + 1 } : el
      )
    );

  const sendBackward = (id) =>
    setElements((els) =>
      els.map((el) =>
        el.id === id ? { ...el, zIndex: Math.max(1, el.zIndex - 1) } : el
      )
    );

  const deleteItem = (id) =>
    setElements((els) => els.filter((el) => el.id !== id));

  /* Reset */
  const resetCanvas = () => {
    setElements([]);
    setLetterText("");
    setSelectedVase(vases[0]);
    setActiveId(null);
  };

  /* Export PNG */
  const exportPNG = async () => {
    const canvas = await html2canvas(canvasRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "digital-bouquet.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="app">
      {/* LEFT PANEL */}
      <aside className="left-panel">
        <h2>Library</h2>

        <h3>Vases</h3>
        <div className="item-grid">
          {vases.map((v) => (
            <img
              key={v}
              src={v}
              className={selectedVase === v ? "active" : ""}
              onClick={() => setSelectedVase(v)}
            />
          ))}
        </div>

        <h3>Flowers</h3>
        <div className="item-grid">
          {flowers.map((f) => (
            <img
              key={f}
              src={f}
              draggable
              onDragStart={(e) => handleDragStart(e, f)}
            />
          ))}
        </div>

        <h3>Leaves</h3>
        <div className="item-grid">
          {leaves.map((l) => (
            <img
              key={l}
              src={l}
              draggable
              onDragStart={(e) => handleDragStart(e, l)}
            />
          ))}
        </div>

        <h3>Decor</h3>
        <div className="item-grid">
          {decor.map((d) => (
            <img
              key={d}
              src={d}
              draggable
              onDragStart={(e) => handleDragStart(e, d)}
            />
          ))}
        </div>
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
          onMouseDown={() => setActiveId(null)}
        >
          {elements.map((el) => (
            <div
              key={el.id}
              className={`canvas-item-wrapper ${
                activeId === el.id ? "active" : ""
              }`}
              style={{
                left: el.x,
                top: el.y,
                zIndex: el.zIndex,
                transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
              }}
              onMouseDown={(e) => handleMouseDown(e, el.id)}
            >
              <img src={el.src} draggable={false} />

              {activeId === el.id && (
                <div
                  className="item-controls"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button onClick={() => rotate(el.id, -15)}>⟲</button>
                  <button onClick={() => rotate(el.id, 15)}>⟳</button>
                  <button onClick={() => scaleItem(el.id, 0.1)}>＋</button>
                  <button onClick={() => scaleItem(el.id, -0.1)}>－</button>
                  <button onClick={() => bringForward(el.id)}>⬆</button>
                  <button onClick={() => sendBackward(el.id)}>⬇</button>
                  <button onClick={() => deleteItem(el.id)}>✕</button>
                </div>
              )}
            </div>
          ))}

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
            {font} ▾
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
