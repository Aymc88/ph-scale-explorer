# pH Scale Explorer 🧪

An interactive 10th-grade science project that explains the pH scale — acids, bases, and neutralization — through **10 animated diagrams** and a companion **MCP (Model Context Protocol) teaching server**.

> Live demo (after Vercel deployment): `https://your-project.vercel.app`

## What's inside

| Folder / File | Purpose |
| --- | --- |
| `index.html` | The interactive learning page (10 diagrams) |
| `css/styles.css` | Styling and animations |
| `js/main.js` | All the interactive logic for the 10 diagrams |
| `mcp-server/` | A Node.js MCP server providing pH teaching tools |
| `vercel.json` | One-click Vercel deployment config |
| `DEPLOYMENT.md` | Step-by-step GitHub + Vercel instructions |

## The 10 Diagrams

1. **What is pH?** — interactive 0–14 scale with a moving marker
2. **The pH Scale of Common Substances** — clickable items from battery acid to drain cleaner
3. **The Ions Behind pH (H⁺ and OH⁻)** — add ions and watch the pH change
4. **Acids** — properties, examples, and an animated acid + zinc reaction
5. **Bases** — properties, examples, and an animated soap dissolution
6. **Neutral Water** — balance-scale visualization
7. **pH Indicators** — switch between litmus, universal, phenolphthalein, methyl orange
8. **Neutralization** — animated HCl + NaOH → NaCl + H₂O
9. **pH in Everyday Life** — blood, soil, ocean, mouth
10. **Measuring pH** — indicator paper, digital meter, universal indicator

## Run locally

```bash
# any static server works
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:3000` (or `:8000`) in your browser.

## Use the MCP teaching server

```bash
cd mcp-server
npm install
npm test     # quick pH-math sanity check
```

See [`mcp-server/README.md`](mcp-server/README.md) for how to plug the
server into Claude Desktop, Cursor, or another MCP-aware client.

## Deploy

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for the full step-by-step guide.

## License

MIT — free to remix for class projects.
