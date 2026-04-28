import { STATES } from "../utils/stateEngine";

const BODY = "#D4724A";
const DARK = "#A84818";
const LIGHT = "#EE9060";

const BODY_COLORS = {
  [STATES.WITHDRAWN]: { body: "#7A3818", dark: "#4A1808", light: "#9A5828" },
  [STATES.HIBERNATING]: { body: "#4A6888", dark: "#2A3858", light: "#6A88A8" },
  [STATES.ENERGY_DRINK]: { body: "#4A7828", dark: "#2A4808", light: "#6A9848" },
  [STATES.ANGRY_1]: { body: "#CC3311", dark: "#8A1100", light: "#EE5531" },
  [STATES.ANGRY_2]: { body: "#BB2200", dark: "#7A0800", light: "#DD4420" },
  [STATES.TANTRUM]: { body: "#DD1100", dark: "#880000", light: "#FF3320" },
};

const EYE_SYMBOLS = {
  [STATES.IDLE]: { l: ">", r: "<", c: "#1A0800" },
  [STATES.FED]: { l: ">", r: "<", c: "#1A0800" },
  [STATES.HAPPY]: { l: "^", r: "^", c: "#1A0800" },
  [STATES.STUFFED]: { l: "~", r: "~", c: "#1A0800" },
  [STATES.SLEEPING]: { l: "-", r: "-", c: "#4488FF" },
  [STATES.HIBERNATING]: { l: "*", r: "*", c: "#88CCFF" },
  [STATES.ENERGY_DRINK]: { l: "@", r: "@", c: "#39FF14" },
  [STATES.PECKISH]: { l: ">", r: "<", c: "#1A0800" },
  [STATES.HUNGRY]: { l: "o", r: "o", c: "#1A0800" },
  [STATES.BEGGING]: { l: ";", r: ";", c: "#1A0800" },
  [STATES.DESPERATE]: { l: "x", r: "x", c: "#AA44AA" },
  [STATES.ANGRY_1]: { l: ">", r: "<", c: "#FF2200" },
  [STATES.ANGRY_2]: { l: ">>", r: "<<", c: "#FF0000" },
  [STATES.TANTRUM]: { l: ">>", r: "<<", c: "#FF0000" },
  [STATES.WITHDRAWN]: { l: ".", r: ".", c: "#442200" },
  [STATES.FERAL]: { l: "$", r: "$", c: "#FF00FF" },
  __THINKING__: { l: "?", r: "?", c: "#1A0800" },
  __EATING__: { l: "^", r: "^", c: "#1A0800" },
};

export default function BuddySprite({
  state = STATES.IDLE,
  isThinking = false,
  isEating = false,
}) {
  const resolvedKey = isEating
    ? "__EATING__"
    : isThinking
      ? "__THINKING__"
      : state;
  const col = BODY_COLORS[state] ?? { body: BODY, dark: DARK, light: LIGHT };
  const eyes = EYE_SYMBOLS[resolvedKey] ?? EYE_SYMBOLS[STATES.IDLE];
  const flip = state === STATES.WITHDRAWN && !isThinking && !isEating;

  const BW = 88;
  const BH = 56;
  const AW = 14;
  const AH = 14;
  const LW = 12;
  const LH = 16;
  const TW = BW + AW * 2;
  const TH = BH + LH;

  const leftEyeX = AW + BW * 0.28;
  const rightEyeX = AW + BW * 0.72;
  const eyeY = BH * 0.36;

  // Mouth open when eating
  const mouthY = BH * 0.62;
  const mouthCX = AW + BW * 0.5;

  return (
    <svg
      width={TW + 16}
      height={TH + 16}
      viewBox={`-8 -6 ${TW + 16} ${TH + 16}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible", imageRendering: "pixelated" }}
    >
      <ellipse
        cx={TW / 2}
        cy={TH + 7}
        rx={BW / 2}
        ry={4}
        fill="rgba(0,0,0,0.28)"
      />

      <g transform={flip ? `translate(${TW},0) scale(-1,1)` : ""}>
        {/* Left arm */}
        <rect x={0} y={BH * 0.44} width={AW} height={AH} fill={col.body} />
        <rect
          x={0}
          y={BH * 0.44}
          width={AW}
          height={2}
          fill={col.light}
          opacity="0.5"
        />

        {/* Body */}
        <rect x={AW} y={0} width={BW} height={BH} fill={col.body} />
        <rect
          x={AW}
          y={0}
          width={BW}
          height={4}
          fill={col.light}
          opacity="0.55"
        />
        <rect
          x={AW}
          y={0}
          width={6}
          height={BH}
          fill={col.light}
          opacity="0.1"
        />
        <rect
          x={AW}
          y={BH - 5}
          width={BW}
          height={5}
          fill={col.dark}
          opacity="0.5"
        />

        {/* Right arm */}
        <rect
          x={AW + BW}
          y={BH * 0.44}
          width={AW}
          height={AH}
          fill={col.body}
        />
        <rect
          x={AW + BW}
          y={BH * 0.44}
          width={AW}
          height={2}
          fill={col.light}
          opacity="0.5"
        />

        {/* Legs */}
        {[BW * 0.08, BW * 0.28, BW * 0.58, BW * 0.78].map((lx, i) => (
          <g key={i}>
            <rect x={AW + lx} y={BH} width={LW} height={LH} fill={col.body} />
            <rect
              x={AW + lx}
              y={BH}
              width={LW}
              height={2}
              fill={col.light}
              opacity="0.4"
            />
            <rect
              x={AW + lx}
              y={BH + LH - 3}
              width={LW}
              height={3}
              fill={col.dark}
              opacity="0.4"
            />
          </g>
        ))}

        {/* Eyes */}
        <text
          x={leftEyeX}
          y={eyeY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fill={eyes.c}
          fontFamily="monospace"
          fontWeight="900"
          style={{ userSelect: "none" }}
        >
          {eyes.l}
        </text>
        <text
          x={rightEyeX}
          y={eyeY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fill={eyes.c}
          fontFamily="monospace"
          fontWeight="900"
          style={{ userSelect: "none" }}
        >
          {eyes.r}
        </text>

        {/* Mouth — open wide when eating, small smile when happy/fed, nothing otherwise */}
        {isEating && (
          <g>
            {/* Open mouth */}
            <ellipse cx={mouthCX} cy={mouthY} rx={14} ry={9} fill="#1A0800" />
            {/* Tongue */}
            <ellipse
              cx={mouthCX}
              cy={mouthY + 5}
              rx={8}
              ry={5}
              fill="#CC4444"
            />
            {/* Teeth top */}
            <rect
              x={mouthCX - 10}
              y={mouthY - 9}
              width={7}
              height={5}
              fill="#FFFFFF"
              rx="1"
            />
            <rect
              x={mouthCX + 3}
              y={mouthY - 9}
              width={7}
              height={5}
              fill="#FFFFFF"
              rx="1"
            />
          </g>
        )}

        {(state === STATES.HAPPY || state === STATES.FED) && !isEating && (
          /* Small smile arc */
          <path
            d={`M ${mouthCX - 10} ${mouthY - 2} Q ${mouthCX} ${mouthY + 6} ${mouthCX + 10} ${mouthY - 2}`}
            stroke="#1A0800"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {state === STATES.STUFFED && !isEating && (
          /* Wavy stuffed mouth */
          <path
            d={`M ${mouthCX - 10} ${mouthY} Q ${mouthCX - 5} ${mouthY - 4} ${mouthCX} ${mouthY} Q ${mouthCX + 5} ${mouthY + 4} ${mouthCX + 10} ${mouthY}`}
            stroke="#1A0800"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Accessories */}
        {state === STATES.SLEEPING && (
          <g fill="#4488FF" fontFamily="monospace" fontWeight="bold">
            <text x={AW + BW + 4} y={14} fontSize="9">
              z
            </text>
            <text x={AW + BW + 11} y={4} fontSize="13">
              Z
            </text>
          </g>
        )}

        {state === STATES.ENERGY_DRINK && (
          <g
            stroke="#39FF14"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          >
            <line x1={-12} y1={BH * 0.3} x2={-2} y2={BH * 0.3} />
            <line x1={-15} y1={BH * 0.5} x2={-2} y2={BH * 0.5} />
            <line x1={-12} y1={BH * 0.7} x2={-2} y2={BH * 0.7} />
            <line x1={TW + 2} y1={BH * 0.3} x2={TW + 14} y2={BH * 0.3} />
            <line x1={TW + 2} y1={BH * 0.5} x2={TW + 17} y2={BH * 0.5} />
            <line x1={TW + 2} y1={BH * 0.7} x2={TW + 14} y2={BH * 0.7} />
          </g>
        )}

        {state === STATES.HUNGRY && (
          <g>
            <rect
              x={-56}
              y={BH * 0.25}
              width={52}
              height={18}
              fill="#0A0A0A"
              stroke={BODY}
              strokeWidth="1.2"
              rx="2"
            />
            <text
              x={-53}
              y={BH * 0.25 + 12}
              fontSize="8"
              fill={BODY}
              fontFamily="monospace"
              fontWeight="bold"
            >
              FEED ME 🥺
            </text>
          </g>
        )}

        {[STATES.ANGRY_1, STATES.ANGRY_2, STATES.TANTRUM].includes(state) && (
          <g fontSize="12">
            <text x={-4} y={-2}>
              💢
            </text>
            <text x={TW - 2} y={-2}>
              💢
            </text>
          </g>
        )}

        {state === STATES.HIBERNATING && (
          <g fontSize="13" opacity="0.9">
            <text x={-14} y={BH * 0.45} fill="#88CCFF">
              ❄
            </text>
            <text x={TW + 2} y={BH * 0.45} fill="#88CCFF">
              ❄
            </text>
          </g>
        )}

        {state === STATES.BEGGING && (
          <g fill="#4488FF" opacity="0.85">
            <ellipse cx={AW + BW * 0.26} cy={BH * 0.75} rx={2.5} ry={4} />
            <ellipse cx={AW + BW * 0.74} cy={BH * 0.75} rx={2.5} ry={4} />
          </g>
        )}
      </g>
    </svg>
  );
}
