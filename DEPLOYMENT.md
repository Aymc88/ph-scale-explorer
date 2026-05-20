# Deployment Guide

This guide walks you through getting the **pH Scale Explorer** onto
**GitHub** (account `Aymc88`) and then live on **Vercel** in under 10 minutes.

---

## Part 1 — Put the project on GitHub

### Option A: GitHub web upload (easiest, no command line)

1. Sign in to GitHub as **Aymc88**, then go to <https://github.com/new>.
2. Repository name: `ph-scale-explorer` (or any name you like).
3. Choose **Public**, leave "Initialize with README" **unchecked**.
4. Click **Create repository**.
5. On the new empty repo page, click **uploading an existing file**.
6. Drag the **contents** of the `pH Project MCP Server Agent` folder (not the folder itself) — all the files and the `css`, `js`, `mcp-server`, `public` subfolders — into the upload area.
7. Scroll down, type a commit message like `Initial commit — pH Scale Explorer`, click **Commit changes**.

### Option B: Git command line

```bash
cd "pH Project MCP Server Agent"
git init
git add .
git commit -m "Initial commit — pH Scale Explorer"
git branch -M main
git remote add origin https://github.com/Aymc88/ph-scale-explorer.git
git push -u origin main
```

> If this is your first time using `git push`, GitHub will prompt for
> a Personal Access Token (not your password). You can create one at
> <https://github.com/settings/tokens>.

---

## Part 2 — Deploy on Vercel

### One-click deploy (no CLI)

1. Go to <https://vercel.com> and sign in **with GitHub** (`Aymc88`) — this links the two services.
2. On the Vercel dashboard, click **Add New… → Project**.
3. Click **Import** next to your `ph-scale-explorer` repo.
4. Framework Preset: **Other** (Vercel auto-detects static sites).
5. Leave **Build Command** and **Output Directory** empty.
6. Click **Deploy**.

Vercel will build and publish in ~30 seconds. You'll get a URL like:

```
https://ph-scale-explorer.vercel.app
```

That's your live science-project link. Share it with your teacher!

### Automatic redeploys

Every time you push a new commit to the `main` branch on GitHub,
Vercel automatically redeploys. Edit a diagram, push the change, refresh
the site — done.

### Custom domain (optional)

In Vercel → your project → **Settings → Domains**, add any domain you own
and follow the DNS instructions.

---

## Part 3 — Add the MCP server to Claude Desktop (optional)

If you want the AI tutor side of the project working too:

1. `cd mcp-server && npm install`
2. Edit your Claude Desktop config file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
3. Add the server:

   ```json
   {
     "mcpServers": {
       "ph-teaching": {
         "command": "node",
         "args": ["/absolute/path/to/ph-scale-explorer/mcp-server/index.js"]
       }
     }
   }
   ```
4. Restart Claude Desktop. Ask: *"Use the pH teaching tools to compare the acidity of lemon juice and coffee."*

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Vercel build fails | Make sure `vercel.json` is in the repo root. Set Build Command empty. |
| Site loads but no animations | Open the browser console (F12). The most common cause is the path to `js/main.js` being wrong — make sure the `js/` and `css/` folders are in the repo root, not nested. |
| MCP server won't start | Run `node --version` — needs Node 18+. Then `cd mcp-server && npm install`. |
| Push rejected | Either pull first (`git pull --rebase origin main`) or use a Personal Access Token instead of password. |

---

## Submission checklist (for your teacher)

- [ ] Live URL on Vercel
- [ ] GitHub repo URL (set to Public)
- [ ] Short write-up (use the bullet points from `README.md`)
- [ ] Demo: open the site, walk through diagrams 1, 7, and 8
- [ ] Bonus: demo the MCP server answering pH questions
