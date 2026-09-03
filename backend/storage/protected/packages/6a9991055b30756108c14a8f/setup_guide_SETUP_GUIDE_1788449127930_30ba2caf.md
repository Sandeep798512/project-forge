# 🎬 MovieMatrix – AI Movie Recommender
## 🚀 Complete Project Setup Guide (for VS Code)

Welcome to **MovieMatrix**! Follow this simple step-by-step guide to run this project on any laptop using VS Code.

---

## 📋 System Prerequisites (Pehle ye check karein)

1. **Node.js**: Make sure Node.js is installed on your laptop.
   - Download & Install Node.js from: [https://nodejs.org](https://nodejs.org) (LTS Version recommended).
   - To check if Node is installed, open Terminal/CMD and run:
     ```bash
     node -v
     npm -v
     ```
2. **VS Code**: Download and install VS Code from [https://code.visualstudio.com](https://code.visualstudio.com).

---

## 🛠️ Step-by-Step Instructions (Kaise Run Karein)

### Step 1: Zip File Extract Karein
- Download the `.zip` file provided.
- Right-click on `MovieMatrix_AI_Movie_Recommender.zip` and select **Extract All...** (or Extract Here).

### Step 2: VS Code Me Project Open Karein
- Open **VS Code**.
- Go to `File` -> `Open Folder...` (ya `Ctrl + O`).
- Select the extracted folder: `MovieMatrix – AI Movie Recommender`.

### Step 3: VS Code Terminal Open Karein
- Press `Ctrl + ~` (Backtick key) OR go to the top menu: `Terminal` -> `New Terminal`.

### Step 4: `.env` File Check / Setup
- Project root folder me `.env` file honi chahiye.
- Agar `.env` file missing hai, to `.env.example` file ko duplicate karke `.env` rename kar lein.
- `.env` file ke andar ye keys honi chahiye:
  ```env
  OMDB_API_KEY=956a86
  PORT=3000
  ```

### Step 5: Required Packages Install Karein
Terminal me ye command run karein (Ye `express`, `dotenv`, `cors` install kar dega):
```bash
npm install
```

### Step 6: Server Start Karein
Terminal me ye command run karein:
```bash
npm start
```

Aapko Terminal me ye output dikhai dega:
```text
===================================================
🎬 MovieMatrix Server running on http://localhost:3000
🔑 OMDB API Key loaded securely from .env file
===================================================
```

### Step 7: Browser Me Open Karein
- Open any web browser (Chrome, Edge, Brave, Firefox).
- Navigate to: **`http://localhost:3000`**

🎉 **Congratulations!** Aapka MovieMatrix AI Movie Recommender project successfully run ho chuka hai!

---

## ⚡ Additional Features & Highlights

- **Dynamic Typewriter Headline**: Hero section me smooth auto-typing text animation.
- **AI Vibe & Mood Recommender**: Mind-bending Sci-Fi, Action, Feel-Good, Dark Thriller, Space, and Indian Cinema filter buttons.
- **Real-Time Auto-Suggestions & Search**: Instant movie search powered by IMDb database.
- **Movie Detail Popup & Youtube Trailer**: Movie details, cast, plot summary, ratings, and embedded YouTube trailer preview.
- **Saved Watchlist Drawer**: Bookmark movies in local storage with persistent drawer counter.
- **Auto Port Fallback**: Agar port `3000` busy hai, to server automatically port `3001` ya `3002` par switch ho jayega.

---

## ❓ Frequently Asked Questions (Troubleshooting)

1. **`npm start` karne par `EADDRINUSE` error aaye to?**
   - Humare `server.js` me auto-port fallback built-in hai! Server automatically port `3001` par start ho jayega (`http://localhost:3001`).

2. **Kya main bina Server ke direct HTML file chala sakta hu?**
   - Haan! Aap `index.html` file ko double-click karke direct browser me open kar sakte hain. Application static API mode me automatically switch ho jayegi.

3. **Apni khud ki OMDB API Key kaise use karein?**
   - [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx) par jaakar free API key generate karein aur `.env` file me `OMDB_API_KEY=your_key_here` update kar dein.

---
*Created with ❤️ by MovieMatrix AI Team*
