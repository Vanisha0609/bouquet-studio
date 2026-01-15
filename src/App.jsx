import { useState, useRef } from "react";
import ElementsPanel from "./components/ElementsPanel";
import CanvasStage from "./components/CanvasStage";
import LetterPanel from "./components/LetterPanel";
import VaseSelector from "./components/VaseSelector";
import "./App.css";
export default function App() {
  const [elements, setElements] = useState([]);
  const [vase, setVase] = useState(null);
  const stageRef = useRef(null);

  const addElement = (src) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setElements(prev => [
        ...prev,
        {
          id: Date.now(),
          image: img,
          x: 300,
          y: 200,
          scale: 0.4
        }
      ]);
    };
  };

  const addLetter = (text, font) => {
    setElements(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "text",
        text,
        font,
        x: 100,
        y: 80
      }
    ]);
  };

  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = "digital-bouquet.png";
    link.href = uri;
    link.click();
  };

  const resetCanvas = () => {
    setElements([]);
    setVase(null);
  };

  return (
    <>
      <header>
        <div>
          <h1>💖 Digital Bouquet Studio</h1>
          <p>Create your Valentine’s masterpiece</p>
        </div>
        <div className="actions">
          <button onClick={resetCanvas}>Reset</button>
          <button onClick={exportPNG}>Export PNG</button>
        </div>
      </header>

      <div className="app">
        <ElementsPanel addElement={addElement} />
        <CanvasStage
          elements={elements}
          vase={vase}
          stageRef={stageRef}
        />
        <div className="panel right">
          <LetterPanel addLetter={addLetter} />
          <VaseSelector setVase={setVase} />
        </div>
      </div>
    </>
  );
}
