import { Stage, Layer, Image, Text, Transformer } from "react-konva";
import { useRef, useEffect } from "react";

export default function CanvasStage({ elements, vase, stageRef }) {
  const trRef = useRef();

  useEffect(() => {
    if (trRef.current && trRef.current.nodes().length > 0) {
      trRef.current.getLayer().batchDraw();
    }
  }, [elements]);

  return (
    <main className="canvas-area">
      <Stage
        width={720}
        height={520}
        ref={stageRef}
        style={{ background: "#fffdfb", borderRadius: 18 }}
      >
        <Layer>

          {/* Vase */}
          {vase && (
            <Image
              image={vase}
              x={360 - vase.width * 0.35}
              y={520 - vase.height * 0.35}
              scaleX={0.35}
              scaleY={0.35}
              draggable={false}
            />
          )}

          {/* Elements */}
          {elements.map(el =>
            el.type === "text" ? (
              <Text
                key={el.id}
                text={el.text}
                x={el.x}
                y={el.y}
                fontFamily={el.font}
                fontSize={22}
                draggable
              />
            ) : (
              <Image
                key={el.id}
                image={el.image}
                x={el.x}
                y={el.y}
                scaleX={el.scale}
                scaleY={el.scale}
                draggable
              />
            )
          )}

          <Transformer ref={trRef} />
        </Layer>
      </Stage>
    </main>
  );
}
