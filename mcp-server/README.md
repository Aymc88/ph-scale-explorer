# pH Teaching MCP Server

A small **Model Context Protocol** server that gives an AI assistant
five teaching tools for the pH chapter of a 10th-grade chemistry class.

## Tools

| Tool | What it does |
| --- | --- |
| `calculate_ph(h_concentration)` | Computes pH from [H⁺] in mol/L |
| `lookup_substance(name)` | Returns the typical pH and a one-line note for a common substance |
| `indicator_color(indicator, ph)` | Predicts the color of a pH indicator at a given pH |
| `neutralize(acid, base)` | Predicts the products of an acid–base neutralization |
| `compare_acidity(a, b)` | Compares two substances and reports how many times more acidic one is |

## Install & Run

```bash
cd mcp-server
npm install
npm start
```

The server speaks the MCP protocol over **stdio**, so it is launched
by an MCP-aware client (Claude Desktop, Cursor, Continue, etc.).

## Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ph-teaching": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop. You should now see the five `ph-teaching:*`
tools available in chat.

## Quick test

```bash
npm test
```

Runs the pH-math sanity checks (no network or SDK required).
