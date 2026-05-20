#!/usr/bin/env node
/**
 * pH Teaching MCP Server
 * ----------------------
 * A Model Context Protocol server that gives an AI assistant a set of
 * teaching tools for the pH chapter of a 10th-grade chemistry class.
 *
 * Tools exposed:
 *   1. calculate_ph           — pH from hydrogen-ion concentration
 *   2. lookup_substance       — typical pH of a common substance
 *   3. indicator_color        — color of an indicator at a given pH
 *   4. neutralize             — predicts the products of acid + base
 *   5. compare_acidity        — compares two substances by acidity
 *
 * Run:    node index.js
 * Add to Claude Desktop / Cursor / any MCP-aware client (see README).
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// =============================================================
// pH knowledge base (small, curriculum-focused)
// =============================================================
const SUBSTANCES = {
  "battery acid":    { ph: 0.5,  type: "strong acid", note: "Sulfuric acid (H₂SO₄). Extremely corrosive." },
  "stomach acid":    { ph: 1.5,  type: "strong acid", note: "Hydrochloric acid; helps digest food." },
  "lemon juice":     { ph: 2.2,  type: "weak acid",   note: "Contains citric acid." },
  "soda":            { ph: 2.5,  type: "weak acid",   note: "Phosphoric + carbonic acids; erodes tooth enamel." },
  "vinegar":         { ph: 2.9,  type: "weak acid",   note: "About 5% acetic acid (CH₃COOH) in water." },
  "orange juice":    { ph: 3.5,  type: "weak acid",   note: "Citric and ascorbic acids." },
  "tomato":          { ph: 4.5,  type: "weak acid",   note: "Mildly acidic." },
  "coffee":          { ph: 5.0,  type: "weak acid",   note: "Several organic acids." },
  "rainwater":       { ph: 5.6,  type: "weak acid",   note: "CO₂ dissolves to form carbonic acid." },
  "milk":            { ph: 6.5,  type: "weak acid",   note: "Slightly acidic due to lactic acid." },
  "pure water":      { ph: 7.0,  type: "neutral",     note: "Exactly equal H⁺ and OH⁻." },
  "blood":           { ph: 7.4,  type: "weak base",   note: "Tightly buffered between 7.35 and 7.45." },
  "seawater":        { ph: 8.1,  type: "weak base",   note: "Slightly basic; affected by CO₂ absorption." },
  "baking soda":     { ph: 9.0,  type: "weak base",   note: "Sodium bicarbonate (NaHCO₃)." },
  "soap":            { ph: 10.0, type: "weak base",   note: "Made by saponifying fats with NaOH or KOH." },
  "ammonia":         { ph: 11.5, type: "weak base",   note: "Household cleaner." },
  "bleach":          { ph: 12.5, type: "strong base", note: "Sodium hypochlorite — never mix with acids!" },
  "drain cleaner":   { ph: 14.0, type: "strong base", note: "Concentrated NaOH; extremely caustic." },
};

const INDICATORS = {
  litmus: ph => {
    if (ph < 4.5) return { color: "red",    description: "Litmus turns red in acidic solutions (pH < 4.5)." };
    if (ph > 8.3) return { color: "blue",   description: "Litmus turns blue in basic solutions (pH > 8.3)." };
    return                  { color: "purple", description: "Mixed color in the transition range." };
  },
  universal: ph => {
    const palette = [
      { max: 2,  color: "red",         note: "Strong acid" },
      { max: 4,  color: "orange",      note: "Acid" },
      { max: 6,  color: "yellow",      note: "Weak acid" },
      { max: 8,  color: "green",       note: "Neutral / near neutral" },
      { max: 10, color: "blue",        note: "Weak base" },
      { max: 12, color: "indigo",      note: "Base" },
      { max: 14, color: "violet",      note: "Strong base" },
    ];
    const band = palette.find(b => ph <= b.max) || palette[palette.length - 1];
    return { color: band.color, description: `Universal indicator at pH ${ph}: ${band.color} (${band.note}).` };
  },
  phenolphthalein: ph => {
    if (ph < 8.2)  return { color: "colorless",  description: "Phenolphthalein is colorless below pH 8.2." };
    if (ph > 10.0) return { color: "bright pink", description: "Phenolphthalein turns bright pink above pH 10." };
    return                  { color: "light pink",  description: "Phenolphthalein is in its transition range (light pink)." };
  },
  methyl_orange: ph => {
    if (ph < 3.1) return { color: "red",    description: "Methyl orange is red below pH 3.1." };
    if (ph > 4.4) return { color: "yellow", description: "Methyl orange is yellow above pH 4.4." };
    return                 { color: "orange", description: "Methyl orange is orange in its transition range." };
  },
};

// Simple neutralization look-up
const NEUTRALIZATIONS = {
  "hcl+naoh":              { salt: "NaCl",       water: "H₂O", equation: "HCl + NaOH → NaCl + H₂O",         note: "Table salt + water." },
  "h2so4+naoh":            { salt: "Na₂SO₄",     water: "2H₂O", equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O", note: "Sodium sulfate + water." },
  "hcl+koh":               { salt: "KCl",        water: "H₂O", equation: "HCl + KOH → KCl + H₂O",          note: "Potassium chloride + water." },
  "hcl+mg(oh)2":           { salt: "MgCl₂",      water: "2H₂O", equation: "2HCl + Mg(OH)₂ → MgCl₂ + 2H₂O", note: "Antacid neutralizing stomach acid." },
  "ch3cooh+naoh":          { salt: "CH₃COONa",   water: "H₂O", equation: "CH₃COOH + NaOH → CH₃COONa + H₂O", note: "Sodium acetate + water." },
  "hno3+naoh":             { salt: "NaNO₃",      water: "H₂O", equation: "HNO₃ + NaOH → NaNO₃ + H₂O",      note: "Sodium nitrate + water." },
};

// =============================================================
// Tool implementations
// =============================================================
function tool_calculate_ph({ h_concentration }) {
  const c = Number(h_concentration);
  if (!isFinite(c) || c <= 0) {
    return { error: "h_concentration must be a positive number in mol/L." };
  }
  const ph = -Math.log10(c);
  let cls = "neutral";
  if (ph < 7) cls = "acidic";
  if (ph > 7) cls = "basic";
  return {
    h_concentration: c,
    ph: Number(ph.toFixed(2)),
    classification: cls,
    explanation: `pH = -log₁₀([H⁺]) = -log₁₀(${c}) ≈ ${ph.toFixed(2)} → ${cls}.`,
  };
}

function tool_lookup_substance({ name }) {
  const key = String(name || "").toLowerCase().trim();
  const data = SUBSTANCES[key];
  if (!data) {
    return {
      error: `No entry for "${name}". Try one of: ${Object.keys(SUBSTANCES).join(", ")}.`,
    };
  }
  return { substance: key, ...data };
}

function tool_indicator_color({ indicator, ph }) {
  const ind = String(indicator || "").toLowerCase().replace(/[\s-]/g, "_");
  const phNum = Number(ph);
  if (!INDICATORS[ind]) {
    return { error: `Unknown indicator "${indicator}". Try: ${Object.keys(INDICATORS).join(", ")}.` };
  }
  if (!isFinite(phNum) || phNum < 0 || phNum > 14) {
    return { error: "ph must be a number between 0 and 14." };
  }
  return { indicator: ind, ph: phNum, ...INDICATORS[ind](phNum) };
}

function tool_neutralize({ acid, base }) {
  const a = String(acid || "").toLowerCase().replace(/\s+/g, "");
  const b = String(base || "").toLowerCase().replace(/\s+/g, "");
  const key = `${a}+${b}`;
  if (NEUTRALIZATIONS[key]) {
    return { acid, base, ...NEUTRALIZATIONS[key], type: "neutralization" };
  }
  return {
    acid, base,
    type: "neutralization (generic)",
    equation: `${acid} + ${base} → salt + H₂O`,
    note: "Acid H⁺ ions combine with base OH⁻ ions to form water. The remaining ions form a salt.",
  };
}

function tool_compare_acidity({ a, b }) {
  const da = SUBSTANCES[String(a || "").toLowerCase().trim()];
  const db = SUBSTANCES[String(b || "").toLowerCase().trim()];
  if (!da || !db) {
    return { error: `Could not find one of: "${a}", "${b}".` };
  }
  const diff = Math.abs(da.ph - db.ph);
  const times = Math.pow(10, diff).toFixed(0);
  const moreAcidic = da.ph < db.ph ? a : b;
  return {
    a: { name: a, ph: da.ph },
    b: { name: b, ph: db.ph },
    more_acidic: moreAcidic,
    pH_difference: Number(diff.toFixed(2)),
    times_more_acidic: `${times}× more acidic`,
    explanation: `${moreAcidic} is about ${times}× more acidic because each pH unit is a 10× change in H⁺ concentration.`,
  };
}

// =============================================================
// MCP wiring
// =============================================================
const server = new Server(
  { name: "ph-teaching-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const TOOLS = [
  {
    name: "calculate_ph",
    description: "Compute pH from a hydrogen-ion concentration. Input: h_concentration in mol/L.",
    inputSchema: {
      type: "object",
      properties: { h_concentration: { type: "number", description: "[H⁺] in mol/L (e.g., 1e-4)" } },
      required: ["h_concentration"],
    },
  },
  {
    name: "lookup_substance",
    description: "Look up the typical pH and notes for a common substance (e.g., 'lemon juice', 'blood').",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string", description: "Name of the substance." } },
      required: ["name"],
    },
  },
  {
    name: "indicator_color",
    description: "Predict the color of a pH indicator at a given pH. Indicators: litmus, universal, phenolphthalein, methyl_orange.",
    inputSchema: {
      type: "object",
      properties: {
        indicator: { type: "string", description: "litmus | universal | phenolphthalein | methyl_orange" },
        ph: { type: "number", minimum: 0, maximum: 14 },
      },
      required: ["indicator", "ph"],
    },
  },
  {
    name: "neutralize",
    description: "Predict the products of a neutralization reaction between an acid and a base.",
    inputSchema: {
      type: "object",
      properties: {
        acid: { type: "string", description: "Acid formula, e.g., HCl, H2SO4, CH3COOH" },
        base: { type: "string", description: "Base formula, e.g., NaOH, KOH, Mg(OH)2" },
      },
      required: ["acid", "base"],
    },
  },
  {
    name: "compare_acidity",
    description: "Compare two known substances by acidity and report how many times one is more acidic than the other.",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "string", description: "First substance (e.g., 'lemon juice')" },
        b: { type: "string", description: "Second substance (e.g., 'coffee')" },
      },
      required: ["a", "b"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result;
  switch (name) {
    case "calculate_ph":     result = tool_calculate_ph(args || {}); break;
    case "lookup_substance": result = tool_lookup_substance(args || {}); break;
    case "indicator_color":  result = tool_indicator_color(args || {}); break;
    case "neutralize":       result = tool_neutralize(args || {}); break;
    case "compare_acidity":  result = tool_compare_acidity(args || {}); break;
    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
});

const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("pH Teaching MCP server running on stdio.");
});
