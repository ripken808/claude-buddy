import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getSpeechLine } from "../utils/expressions";

export default function SpeechBubble({ state, triggerKey, isThinking }) {
  const [text, setText] = useState(null);

  useEffect(() => {
    if (isThinking) {
      setText(null);
      return;
    }
    const line = getSpeechLine(state);
    setText(line);
    const t = setTimeout(() => setText(null), 3200);
    return () => clearTimeout(t);
  }, [triggerKey, state, isThinking]);

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          key={triggerKey + text}
          initial={{ opacity: 0, y: 6, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          style={{
            position: "absolute",
            top: "-48px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0D0D0D",
            color: "#E8611A",
            border: "1px solid #E8611A55",
            borderRadius: "2px",
            padding: "5px 10px",
            fontSize: "11px",
            fontWeight: "700",
            fontFamily: '"Courier New", monospace',
            whiteSpace: "nowrap",
            letterSpacing: "1px",
            boxShadow: "0 0 12px rgba(232,97,26,0.3)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {">"} {text}
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "8px",
              height: "4px",
              background: "#0D0D0D",
              borderLeft: "1px solid #E8611A55",
              borderRight: "1px solid #E8611A55",
              borderBottom: "1px solid #E8611A55",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
