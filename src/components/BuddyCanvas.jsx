import { useRef, useEffect } from "react";
import { MODELS, COLOR_PALETTES } from "../utils/models";

export default function BuddyCanvas({
  modelId = "classic",
  colorId = "orange",
  eyeStyle = "arrows",
  state = "IDLE",
  size = 120,
  isThinking = false,
}) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const model = MODELS[modelId] || MODELS.classic;
    const col =
      COLOR_PALETTES.find((c) => c.id === colorId) || COLOR_PALETTES[0];
    const resolvedState = isThinking ? "THINKING" : state;

    let running = true;

    function loop() {
      if (!running) return;
      tRef.current++;
      model.draw(ctx, size, col, resolvedState, eyeStyle, tRef.current);
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [modelId, colorId, eyeStyle, state, size, isThinking]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ imageRendering: "pixelated", display: "block" }}
    />
  );
}
