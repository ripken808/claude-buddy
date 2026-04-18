/**
 * BuddySprite.jsx
 * Exact Claude Code mascot shape.
 * Eyes are always black symbols. No mouth. Ever.
 */

import { STATES } from "../utils/stateEngine";

const BODY = "#D4724A";

const BODY_COLORS = {
  [STATES.WITHDRAWN]: "#8A4428",
  [STATES.HIBERNATING]: "#5A7090",
  [STATES.ENERGY_DRINK]: "#5A7830",
  [STATES.ANGRY_1]: "#CC3311",
  [STATES.ANGRY_2]: "#CC2200",
  [STATES.TANTRUM]: "#DD1100",
};

// Eyes always black — only the symbol changes
const EYE_SYMBOLS = {
  [STATES.IDLE]: { l: ">", r: "<", size: 22 },
  [STATES.FED]: { l: ">", r: "<", size: 22 },
  [STATES.HAPPY]: { l: "^", r: "^", size: 24 },
  [STATES.STUFFED]: { l: "~", r: "~", size: 22 },
  [STATES.SLEEPING]: { l: "-", r: "-", size: 28 },
  [STATES.HIBERNATING]: { l: "*", r: "*", size: 22 },
  [STATES.ENERGY_DRINK]: { l: "@", r: "@", size: 22 },
  [STATES.PECKISH]: { l: ">", r: "<", size: 22 },
  [STATES.HUNGRY]: { l: "ó", r: "ò", size: 22 },
  [STATES.BEGGING]: { l: ";", r: ";", size: 26 },
  [STATES.DESPERATE]: { l: "x", r: "x", size: 22 },
  [STATES.ANGRY_1]: { l: ">", r: "<", size: 26 },
  [STATES.ANGRY_2]: { l: ">>", r: "<<", size: 20 },
  [STATES.TANTRUM]: { l: ">>", r: "<<", size: 20 },
  [STATES.WITHDRAWN]: { l: ".", r: ".", size: 22 },
  [STATES.FERAL]: { l: "$", r: "$", size: 22 },
};

const EYE_COLOR = "#1A0800";

export default function BuddySprite({ state = STATES.IDLE }) {
  const bodyColor = BODY_COLORS[state] ?? BODY;
  const eyes = EYE_SYMBOLS[state] ?? EYE_SYMBOLS[STATES.IDLE];
  const flip = state === STATES.WITHDRAWN;

  const BW = 140;
  const BH = 90;
  const ARM_W = 20;
  const ARM_H = 20;
  const LEG_W = 20;
  const LEG_H = 30;
  const TOTAL_W = BW + ARM_W * 2;
  const TOTAL_H = BH + LEG_H;

  const eyeY = BH * 0.38;
  const leftEyeX = ARM_W + BW * 0.28;
  const rightEyeX = ARM_W + BW * 0.68;

  return (
    <svg
      width={TOTAL_W + 80}
      height={TOTAL_H + 20}
      viewBox={`-16 -8 ${TOTAL_W + 80} ${TOTAL_H + 20}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible", imageRendering: "pixelated" }}
    >
      <ellipse
        cx={TOTAL_W / 2}
        cy={TOTAL_H + 6}
        rx={BW / 2}
        ry={5}
        fill="rgba(0,0,0,0.35)"
      />

      <g transform={flip ? `translate(${TOTAL_W}, 0) scale(-1, 1)` : ""}>
        {/* Left arm */}
        <rect
          x={0}
          y={BH * 0.44}
          width={ARM_W}
          height={ARM_H}
          fill={bodyColor}
        />

        {/* Main body */}
        <rect x={ARM_W} y={0} width={BW} height={BH} fill={bodyColor} />

        {/* Right arm */}
        <rect
          x={ARM_W + BW}
          y={BH * 0.44}
          width={ARM_W}
          height={ARM_H}
          fill={bodyColor}
        />

        {/* Legs — two pairs */}
        <rect
          x={ARM_W + BW * 0.07}
          y={BH}
          width={LEG_W}
          height={LEG_H}
          fill={bodyColor}
        />
        <rect
          x={ARM_W + BW * 0.27}
          y={BH}
          width={LEG_W}
          height={LEG_H}
          fill={bodyColor}
        />
        <rect
          x={ARM_W + BW * 0.57}
          y={BH}
          width={LEG_W}
          height={LEG_H}
          fill={bodyColor}
        />
        <rect
          x={ARM_W + BW * 0.77}
          y={BH}
          width={LEG_W}
          height={LEG_H}
          fill={bodyColor}
        />

        {/* Eyes — always black */}
        <text
          x={leftEyeX}
          y={eyeY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={eyes.size}
          fill={EYE_COLOR}
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
          fontSize={eyes.size}
          fill={EYE_COLOR}
          fontFamily="monospace"
          fontWeight="900"
          style={{ userSelect: "none" }}
        >
          {eyes.r}
        </text>

        {/* Accessories */}

        {state === STATES.SLEEPING && (
          <g fill="#4488FF" fontFamily="monospace" fontWeight="bold">
            <text x={TOTAL_W - 4} y={20} fontSize="14">
              z
            </text>
            <text x={TOTAL_W + 4} y={6} fontSize="20">
              Z
            </text>
          </g>
        )}

        {state === STATES.ENERGY_DRINK && (
          <g stroke="#39FF14" strokeWidth="2" strokeLinecap="square">
            <line x1={-4} y1={BH * 0.3} x2={ARM_W - 2} y2={BH * 0.3} />
            <line x1={-8} y1={BH * 0.5} x2={ARM_W - 2} y2={BH * 0.5} />
            <line x1={-4} y1={BH * 0.7} x2={ARM_W - 2} y2={BH * 0.7} />
            <line
              x1={ARM_W + BW + 2}
              y1={BH * 0.3}
              x2={ARM_W + BW + 20}
              y2={BH * 0.3}
            />
            <line
              x1={ARM_W + BW + 2}
              y1={BH * 0.5}
              x2={ARM_W + BW + 24}
              y2={BH * 0.5}
            />
            <line
              x1={ARM_W + BW + 2}
              y1={BH * 0.7}
              x2={ARM_W + BW + 20}
              y2={BH * 0.7}
            />
          </g>
        )}

        {state === STATES.HUNGRY && (
          <g>
            <rect
              x={-76}
              y={BH * 0.25}
              width={72}
              height={22}
              fill="#0A0A0A"
              stroke={BODY}
              strokeWidth="1.5"
            />
            <text
              x={-72}
              y={BH * 0.25 + 15}
              fontSize="10"
              fill={BODY}
              fontFamily="monospace"
              fontWeight="bold"
            >
              FEED ME 🥺
            </text>
          </g>
        )}

        {[STATES.ANGRY_1, STATES.ANGRY_2, STATES.TANTRUM].includes(state) && (
          <g fontSize="18">
            <text x={-4} y={-2}>
              💢
            </text>
            <text x={ARM_W + BW + 2} y={-2}>
              💢
            </text>
          </g>
        )}

        {state === STATES.HIBERNATING && (
          <g fontSize="20" opacity={0.9}>
            <text x={-6} y={BH * 0.4} fill="#88CCFF">
              ❄
            </text>
            <text x={ARM_W + BW + 2} y={BH * 0.4} fill="#88CCFF">
              ❄
            </text>
          </g>
        )}

        {state === STATES.BEGGING && (
          <g fill="#6688CC" opacity={0.8}>
            <ellipse cx={ARM_W + BW * 0.28} cy={BH * 0.72} rx={4} ry={6} />
            <ellipse cx={ARM_W + BW * 0.68} cy={BH * 0.72} rx={4} ry={6} />
          </g>
        )}

        {state === STATES.FERAL && (
          <g
            fontFamily="monospace"
            fill="#FF00FF"
            fontSize="11"
            fontWeight="bold"
          >
            <text x={ARM_W + BW + 4} y={8}>
              !@#
            </text>
          </g>
        )}
      </g>
    </svg>
  );
}
