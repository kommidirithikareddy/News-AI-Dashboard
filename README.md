# 📰 NewsAI Dashboard

A SvelteKit + Claude AI powered news dashboard with per-article AI summaries and trend analysis across headlines.

🌐 **Live Demo**: [coming soon..](https://news-ai-dashboard.vercel.app) 

---

## ✨ Features

- 📰 Live news articles across Tech, Business, Science, Health & Legal
- 🤖 Per-article AI summaries powered by Claude (Anthropic)
- 📈 AI trend analysis across all visible headlines
- 🔍 Real-time search with instant filtering
- 🏷 Category filtering with reactive Svelte stores
- 🌑 Dark mode UI with smooth animations

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| SvelteKit | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Claude API (Anthropic) | AI summaries & trend analysis |
| GNews API | Live news articles |
| Svelte Stores | Reactive state management |
| Vercel | Deployment |

---

## 🚀 Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/kommidirithikareddy/News-AI-Dashboard.git
cd News-AI-Dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your API keys
Create a `.env` file in the root folder:
```
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_GNEWS_API_KEY=your_gnews_api_key
```
- Claude API key → [console.anthropic.com](https://console.anthropic.com)
- GNews API key → [gnews.io](https://gnews.io) (optional — app works without it)

### 4. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import this repo
3. Add environment variables:
   - `VITE_CLAUDE_API_KEY` = your Claude key
   - `VITE_GNEWS_API_KEY` = your GNews key (optional)
4. Click Deploy 🚀

---

## 📁 Project Structure
```
src/
├── lib/
│   ├── components/
│   │   ├── ArticleCard.svelte    # News card with AI summary
│   │   ├── CategoryFilter.svelte # Category buttons
│   │   ├── SearchBar.svelte      # Search input
│   │   └── TrendsPanel.svelte    # AI trends sidebar
│   ├── claude.ts                 # Claude API client
│   ├── news.ts                   # GNews API + mock data
│   ├── stores.ts                 # Svelte reactive stores
│   └── types.ts                  # TypeScript interfaces
└── routes/
    ├── +page.svelte              # Main dashboard page
    ├── +page.server.ts           # Server-side data loading
    └── +layout.svelte            # Root layout
```

---

## ⚠️ Disclaimer

API keys should never be committed to version control.
Always use environment variables for sensitive credentials.

---

Built by [Rithika Reddy Kommidi](https://kommidirithikareddy.vercel.app) · Portfolio Project
