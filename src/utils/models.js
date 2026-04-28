export const MODELS = {
  classic: {
    id: "classic",
    name: "Classic",
    desc: "The original Claude Code mascot",
    draw: drawClassic,
  },
  chonk: {
    id: "chonk",
    name: "Chonk",
    desc: "Round adorable chibi bot",
    draw: drawChonk,
  },
  slim: {
    id: "slim",
    name: "Slim",
    desc: "Tall sleek robot companion",
    draw: drawSlim,
  },
  round: {
    id: "round",
    name: "Round",
    desc: "Maximum cute circle bot",
    draw: drawRound,
  },
  ghost: {
    id: "ghost",
    name: "Ghost",
    desc: "Spooky floating companion",
    draw: drawGhost,
  },
  cat: {
    id: "cat",
    name: "Bot-Cat",
    desc: "Robot with cat ears and a tail",
    draw: drawCat,
  },
};

export const COLOR_PALETTES = [
  {
    id: "orange",
    name: "Orange",
    body: "#D4724A",
    dark: "#A84818",
    light: "#EE9060",
    accent: "#FF6B35",
  },
  {
    id: "rose",
    name: "Rose",
    body: "#C45078",
    dark: "#8A2848",
    light: "#E878A0",
    accent: "#FF4488",
  },
  {
    id: "mint",
    name: "Mint",
    body: "#3A9E7A",
    dark: "#1A6E4A",
    light: "#5AC89A",
    accent: "#00D4AA",
  },
  {
    id: "sky",
    name: "Sky",
    body: "#4A7EC4",
    dark: "#2A4E94",
    light: "#6A9EE4",
    accent: "#4488FF",
  },
  {
    id: "lavender",
    name: "Lavender",
    body: "#8A6AC8",
    dark: "#5A3A98",
    light: "#AA8AE8",
    accent: "#9966FF",
  },
  {
    id: "slate",
    name: "Slate",
    body: "#708090",
    dark: "#405060",
    light: "#90A0B0",
    accent: "#88AACC",
  },
  {
    id: "gold",
    name: "Gold",
    body: "#C8963C",
    dark: "#886010",
    light: "#E8B85C",
    accent: "#FFB800",
  },
  {
    id: "crimson",
    name: "Crimson",
    body: "#C43830",
    dark: "#8A1808",
    light: "#E45850",
    accent: "#FF3333",
  },
];

export const EYE_STYLES = [
  { id: "arrows", label: "> <" },
  { id: "happy", label: "^ ^" },
  { id: "dash", label: "- -" },
  { id: "dots", label: "o o" },
  { id: "pixel", label: "■ ■" },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function getEyeSymbols(state, eyeStyle) {
  switch (state) {
    case "SLEEPING":
    case "HIBERNATING":
      return ["-", "-"];
    case "HAPPY":
      return ["^", "^"];
    case "STUFFED":
      return ["~", "~"];
    case "ENERGY_DRINK":
      return ["@", "@"];
    case "BEGGING":
      return [";", ";"];
    case "DESPERATE":
      return ["x", "x"];
    case "ANGRY_1":
      return [">", "<"];
    case "ANGRY_2":
    case "TANTRUM":
      return [">>", "<<"];
    case "WITHDRAWN":
      return [".", "."];
    case "FERAL":
      return ["$", "$"];
    case "HUNGRY":
      return ["ó", "ò"];
    case "THINKING":
      return ["?", "?"];
    default:
      const map = {
        arrows: [">", "<"],
        happy: ["^", "^"],
        dash: ["-", "-"],
        dots: ["o", "o"],
        pixel: ["■", "■"],
      };
      return map[eyeStyle] || [">", "<"];
  }
}

function getEyeColor(state) {
  switch (state) {
    case "SLEEPING":
    case "HIBERNATING":
      return "#4488FF";
    case "ENERGY_DRINK":
      return "#39FF14";
    case "ANGRY_1":
    case "ANGRY_2":
    case "TANTRUM":
      return "#FF2200";
    case "FERAL":
      return "#FF00FF";
    case "DESPERATE":
      return "#AA44AA";
    case "BEGGING":
      return "#6644AA";
    default:
      return "#1A0800";
  }
}

function getChestColor(state, col) {
  switch (state) {
    case "HAPPY":
      return "#FFB800";
    case "ENERGY_DRINK":
      return "#39FF14";
    case "SLEEPING":
      return "#4488FF";
    case "ANGRY_1":
    case "ANGRY_2":
    case "TANTRUM":
      return "#FF2200";
    default:
      return col.dark;
  }
}

function drawEyes(ctx, state, eyeStyle, lx, ly, rx, ry, fontSize) {
  const [l, r] = getEyeSymbols(state, eyeStyle);
  ctx.fillStyle = getEyeColor(state);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(l, lx, ly);
  ctx.fillText(r, rx, ry);
}

export function drawClassic(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 14;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(S / 2, S - P * 0.5, P * 5, P * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 2, P * 2, P * 10, P * 7);
  ctx.fillRect(0, P * 4.5, P * 2.2, P * 2);
  ctx.fillRect(P * 11.8, P * 4.5, P * 2.2, P * 2);
  ctx.fillRect(P * 2.5, P * 9, P * 2, P * 3);
  ctx.fillRect(P * 5, P * 9, P * 2, P * 3);
  ctx.fillRect(P * 7, P * 9, P * 2, P * 3);
  ctx.fillRect(P * 9.5, P * 9, P * 2, P * 3);
  ctx.fillStyle = col.light;
  ctx.fillRect(P * 2.5, P * 2.5, P * 4, P * 1.2);
  ctx.fillStyle = col.dark;
  ctx.fillRect(P * 2, P * 8.2, P * 10, P * 0.8);
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 3.5, P * 3.2, P * 2.5, P * 3);
  ctx.fillRect(P * 8, P * 3.2, P * 2.5, P * 3);
  drawEyes(ctx, state, eyeStyle, P * 4.75, P * 4.7, P * 9.25, P * 4.7, P * 1.4);
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 4.5, P * 6.5, P * 5, P * 1.5);
  ctx.fillStyle = getChestColor(state, col);
  ctx.fillRect(P * 5, P * 6.8, P * 4, P * 0.9);
}

export function drawChonk(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 12;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(S / 2, S - P * 0.4, P * 4, P * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  roundRect(ctx, P * 1, P * 1, P * 10, P * 8, P * 1.5);
  ctx.fill();
  ctx.fillStyle = col.light;
  roundRect(ctx, P * 1.5, P * 1.5, P * 3.5, P * 1.5, P * 0.8);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 2.5, 0, P * 1.5, P * 1.5);
  ctx.fillRect(P * 8, 0, P * 1.5, P * 1.5);
  roundRect(ctx, P * 2, P * 8.8, P * 2.8, P * 2.8, P * 0.6);
  ctx.fill();
  roundRect(ctx, P * 7.2, P * 8.8, P * 2.8, P * 2.8, P * 0.6);
  ctx.fill();
  ctx.fillStyle = col.dark;
  ctx.fillRect(P * 2, P * 10.2, P * 2.8, P * 1);
  ctx.fillRect(P * 7.2, P * 10.2, P * 2.8, P * 1);
  if (["HAPPY", "FED", "STUFFED"].includes(state)) {
    ctx.fillStyle = col.light + "88";
    ctx.beginPath();
    ctx.ellipse(P * 2, P * 5.8, P * 1.2, P * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(P * 10, P * 5.8, P * 1.2, P * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 2.8, P * 3.2, P * 2.2, P * 3);
  ctx.fillRect(P * 7, P * 3.2, P * 2.2, P * 3);
  drawEyes(ctx, state, eyeStyle, P * 3.9, P * 4.7, P * 8.1, P * 4.7, P * 1.5);
}

export function drawSlim(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 12;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(S / 2, S - P * 0.3, P * 2.5, P * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 3.5, P * 0.5, P * 5, P * 5);
  ctx.fillStyle = col.light;
  ctx.fillRect(P * 4, P * 1, P * 2, P * 1);
  ctx.fillStyle = col.dark;
  ctx.fillRect(P * 5, P * 5.5, P * 2, P * 1);
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 4, P * 6.5, P * 4, P * 4);
  ctx.fillRect(P * 2, P * 7, P * 2, P * 1.8);
  ctx.fillRect(P * 8, P * 7, P * 2, P * 1.8);
  ctx.fillStyle = col.dark;
  ctx.fillRect(P * 4.5, P * 10.5, P * 1.2, P * 1.5);
  ctx.fillRect(P * 6.3, P * 10.5, P * 1.2, P * 1.5);
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 4.2, P * 1.5, P * 1.6, P * 2.5);
  ctx.fillRect(P * 6.2, P * 1.5, P * 1.6, P * 2.5);
  drawEyes(ctx, state, eyeStyle, P * 5, P * 2.75, P * 7, P * 2.75, P * 1.2);
  ctx.fillStyle = getChestColor(state, col);
  ctx.fillRect(P * 5, P * 7.5, P * 2, P * 1);
}

export function drawRound(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 12;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(S / 2, S - P * 0.3, P * 3.5, P * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.beginPath();
  ctx.ellipse(P * 6, P * 5.5, P * 4.5, P * 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.light;
  ctx.beginPath();
  ctx.ellipse(P * 4.2, P * 3.5, P * 2, P * 1.3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 3.5, P * 9.5, P * 1.8, P * 2);
  ctx.fillRect(P * 6.7, P * 9.5, P * 1.8, P * 2);
  ctx.fillStyle = col.dark;
  ctx.fillRect(P * 3.5, P * 10.8, P * 1.8, P * 0.7);
  ctx.fillRect(P * 6.7, P * 10.8, P * 1.8, P * 0.7);
  ctx.fillStyle = col.body;
  ctx.beginPath();
  ctx.ellipse(P * 1.5, P * 6.2, P * 1.6, P * 0.9, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(P * 10.5, P * 6.2, P * 1.6, P * 0.9, 0.4, 0, Math.PI * 2);
  ctx.fill();
  if (["HAPPY", "FED", "STUFFED", "IDLE"].includes(state)) {
    ctx.fillStyle = "#FF888844";
    ctx.beginPath();
    ctx.ellipse(P * 3.2, P * 7, P * 1.1, P * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(P * 8.8, P * 7, P * 1.1, P * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 3.8, P * 4.2, P * 1.8, P * 2.5);
  ctx.fillRect(P * 6.4, P * 4.2, P * 1.8, P * 2.5);
  drawEyes(ctx, state, eyeStyle, P * 4.7, P * 5.45, P * 7.3, P * 5.45, P * 1.3);
}

export function drawGhost(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 12;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = col.body;
  ctx.beginPath();
  ctx.moveTo(P * 2, P * 6);
  ctx.quadraticCurveTo(P * 2, P * 1, P * 6, P * 1);
  ctx.quadraticCurveTo(P * 10, P * 1, P * 10, P * 6);
  ctx.lineTo(P * 10, P * 9.5);
  const wave = Math.sin(t * 0.05) * P * 0.3;
  ctx.quadraticCurveTo(P * 9, P * 11 + wave, P * 8, P * 9.5);
  ctx.quadraticCurveTo(P * 7, P * 11.5 - wave, P * 6, P * 9.5);
  ctx.quadraticCurveTo(P * 5, P * 11.5 + wave, P * 4, P * 9.5);
  ctx.quadraticCurveTo(P * 3, P * 11 - wave, P * 2, P * 9.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = col.light + "CC";
  ctx.beginPath();
  ctx.ellipse(P * 4.5, P * 3.5, P * 1.8, P * 1.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.beginPath();
  ctx.ellipse(P * 1.2, P * 6.8, P * 1.3, P * 0.9, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(P * 10.8, P * 6.8, P * 1.3, P * 0.9, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 3.5, P * 3.8, P * 1.8, P * 2.5);
  ctx.fillRect(P * 6.7, P * 3.8, P * 1.8, P * 2.5);
  drawEyes(ctx, state, eyeStyle, P * 4.4, P * 5.05, P * 7.6, P * 5.05, P * 1.3);
}

export function drawCat(
  ctx,
  S,
  col,
  state = "IDLE",
  eyeStyle = "arrows",
  t = 0,
) {
  const P = S / 12;
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(S / 2, S - P * 0.3, P * 3.5, P * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 2, P * 1.5, P * 8, P * 6);
  ctx.beginPath();
  ctx.moveTo(P * 2, P * 1.5);
  ctx.lineTo(P * 2.2, P * -0.3);
  ctx.lineTo(P * 4.2, P * 1.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(P * 10, P * 1.5);
  ctx.lineTo(P * 9.8, P * -0.3);
  ctx.lineTo(P * 7.8, P * 1.5);
  ctx.fill();
  ctx.fillStyle = col.light;
  ctx.beginPath();
  ctx.moveTo(P * 2.4, P * 1.3);
  ctx.lineTo(P * 2.5, P * 0.1);
  ctx.lineTo(P * 3.9, P * 1.3);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(P * 9.6, P * 1.3);
  ctx.lineTo(P * 9.5, P * 0.1);
  ctx.lineTo(P * 8.1, P * 1.3);
  ctx.fill();
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 3, P * 7.5, P * 6, P * 3);
  ctx.fillStyle = col.light;
  ctx.fillRect(P * 2.5, P * 2, P * 3, P * 1);
  ctx.fillStyle = col.body;
  ctx.fillRect(P * 1, P * 8, P * 2.2, P * 1.8);
  ctx.fillRect(P * 8.8, P * 8, P * 2.2, P * 1.8);
  ctx.fillRect(P * 3.5, P * 10.5, P * 2, P * 1.5);
  ctx.fillRect(P * 6.5, P * 10.5, P * 2, P * 1.5);
  const tailWag = Math.sin(t * 0.06) * 0.3;
  ctx.beginPath();
  ctx.moveTo(P * 9, P * 10);
  ctx.quadraticCurveTo(
    P * 12,
    P * 9 + tailWag * P,
    P * 11.5,
    P * 7 - tailWag * P,
  );
  ctx.quadraticCurveTo(P * 11, P * 6, P * 10.5, P * 7);
  ctx.quadraticCurveTo(P * 11, P * 9, P * 9, P * 10.5);
  ctx.fill();
  ctx.fillStyle = "#110600";
  ctx.fillRect(P * 3.3, P * 3, P * 1.8, P * 2.5);
  ctx.fillRect(P * 6.9, P * 3, P * 1.8, P * 2.5);
  ctx.strokeStyle = "#1A0800";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(P * 1.2, P * 6.2);
  ctx.lineTo(P * 4.2, P * 6.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(P * 1.2, P * 7);
  ctx.lineTo(P * 4.2, P * 7);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(P * 10.8, P * 6.2);
  ctx.lineTo(P * 7.8, P * 6.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(P * 10.8, P * 7);
  ctx.lineTo(P * 7.8, P * 7);
  ctx.stroke();
  drawEyes(ctx, state, eyeStyle, P * 4.2, P * 4.25, P * 7.8, P * 4.25, P * 1.3);
}
