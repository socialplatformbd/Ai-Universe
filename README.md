# AI Universe

Independent directory and launcher for 30 popular AI tools.

Browse tools, search by name, filter by category, save favorites, and open each official website. English and Bengali. Dark and light themes.

**This app is not affiliated with, endorsed by, or sponsored by any listed AI provider.** Each provider keeps control of its website, accounts, features, and pricing.

## Install on Android (no computer needed)

1. Open AI Universe in **Chrome** on your phone.
2. Tap the menu **⋮**.
3. Choose **Install app** or **Add to Home screen**.
4. Open the icon on your home screen. It runs full-screen like a normal app.

Favorites, language, and theme stay on your device.

## Features

- 30 official AI websites (chat, research, image, design, video, writing, translation, coding, audio)
- Instant search across names, categories, and descriptions
- Category chips
- Popular tools row
- Favorites stored locally
- In-app browser attempt with a safe “open in browser” fallback
- Offline directory (AI sites still need internet)
- English / বাংলা
- About and privacy notices

## Important limits

AI Universe opens **official websites**. It does not merge every model into one chatbot and does not bypass logins or subscriptions.

Many AI sites block embedded browsers. If a page stays blank, use **Open official website**.

## Adding more tools later

Edit `src/data/tools.ts` and add an entry with id, name, HTTPS url, category, descriptions, colors, and initials.

## Web app হিসেবে অনলাইনে দেওয়া (ফোন থেকেই)

**GitHub Pages (প্রস্তাবিত):**
1. GitHub-এ নতুন repo বানান, এই ফোল্ডারের সব ফাইল (`.github` সহ) আপলোড করুন, branch = `main`।
2. Repo → Settings → Pages → Source: **GitHub Actions** নির্বাচন করুন।
3. Actions ট্যাবে বিল্ড শেষ হলে `https://<username>.github.io/<repo>/` লিংক পাবেন।
4. Chrome-এ লিংক খুলে ⋮ → Install app।

**Netlify:** repo কানেক্ট করুন; `netlify.toml` আগে থেকেই আছে।

পাথ সব relative (`./`), তাই repo সাবফোল্ডারে হোস্ট করলেও PWA ঠিক চলবে।
