# 🚆 Chennai AC Local Train Tracker & Personal Commuter Assistant
### Southern Railway Suburban Corridor: Chengalpattu Jn (CGL) ⇄ Chennai Egmore (MS) / Chennai Beach (MSB)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fompatel4423%2FTrain-Tracker)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-10B981.svg?style=flat-square&logo=pwa)](https://github.com/ompatel4423/Train-Tracker)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android-06B6D4.svg?style=flat-square)](https://github.com/ompatel4423/Train-Tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A dedicated, mobile-first Web App / PWA tailored specifically for daily office and college commuters traveling between **Chengalpattu Junction** and **Chennai Egmore / Chennai Beach** on Southern Railway's **AC EMU Local Trains (Train 49007, 49002)**.

---

## ⚡ Quick Deployment on Vercel

Deploying this repository to Vercel takes less than 60 seconds with zero configuration required.

### Option 1: One-Click Web Deployment (Recommended)
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Sign in with GitHub and select **`ompatel4423/Train-Tracker`**.
3. Under **Framework Preset**, leave it as **Other** (Vercel automatically detects the static PWA and `vercel.json` configuration).
4. Click **Deploy**.
5. Your app is immediately live at `https://train-tracker-*.vercel.app` with global Edge CDN caching and automatic SSL. Every push to `main` branch auto-deploys instantly!

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from repository directory
cd Train-Tracker
vercel
```

---

## 🌟 Key Commuter Features

### 1. 🛰️ Real-Time Commuter HUD
- Tracks live train position along the entire 16-station Chennai Beach ⇄ Egmore ⇄ Tambaram ⇄ Chengalpattu suburban corridor.
- Displays live velocity, next approaching halt, and percentage progress along the rail line.
- Highlights whether the train is moving, halted at a station, or scheduled.

### 2. 🚨 10-Minute Personal Arrival Reminder & Alarm
- **Personalized Trigger:** Automatically rings when the train is **10 minutes away** from your chosen station.
- **Two Smart Modes:**
  - **🎫 Alert to Board:** Alerts you 10 minutes before the train pulls into your boarding station (e.g. while packing up at office/home).
  - **🏁 Alert to Deboard:** Alerts you 10 minutes before reaching your destination (e.g. Chengalpattu Jn or Chennai Egmore).
- **Dual-Tone Railway Chime:** Authentic acoustic station chime generated using Web Audio API (100% offline, zero audio file lag).
- **Voice Text-to-Speech:** Authentic PA voice announcement in English (or தமிழ் Tamil) declaring:
  > *"Attention commuter! Train 49007 AC Local will reach Chennai Egmore in 10 minutes on Platform 10. Please be ready on the platform!"*
- **Native Browser Push Notifications:** System notification on mobile & desktop with vibration haptics.
- **1-Click Test Alarm:** Tap **🔔 Test 10m Alarm** anytime to test the acoustic chime and vocal announcement.

### 3. 🎯 Prominent Platform Guidance ("Platform XXX")
- Displays verified Southern Railway platform numbers for every stop:
  - **Chennai Egmore (MS):** **Platform 10** (Down to CGL) / **Platform 11** (Up to Beach)
  - **Chengalpattu Jn (CGL):** **Platform 5** / **Platform 4**
  - **Tambaram (TBM):** **Platform 7** / **Platform 8**
  - **Mambalam (MBM):** **Platform 4** / **Platform 3**
  - **Guindy (GDY):** **Platform 4** / **Platform 3**
- **1-Tap Platform Override:** If the station display board or station PA announces a sudden platform shift, tap **"Change PF"** to update it immediately. The app remembers your preference in `localStorage`.

### 4. 📋 Full 16-Station Corridor Timetable Drawer
- Tap **📋 Full Timetable** to view scheduled arrival and departure times, distances, and platform assignments for all 16 halts.
- Automatically adjusts times when a delay chip is tapped.
- Live-highlights the current / approaching station.

### 5. 🎛️ Tactile Skeuomorphic Toggle & Route Switcher
- **Train 49007:** Evening AC Local Fast (Chennai Beach 18:17 ➔ Egmore 18:27 ➔ Tambaram 19:04 ➔ Chengalpattu 19:50).
- **Train 49002:** Morning AC Local Fast (Chengalpattu 07:50 ➔ Tambaram 08:33 ➔ Egmore 09:14 ➔ Beach 09:30).
- 3D tactile WebGL shader switches with smooth sliding physical thumbs.

### 6. ⏱️ 1-Tap Delay Recalibration
- Suburban trains often encounter brief signal holds at Tambaram or Guindy.
- Tap **`+5m`**, **`+10m`**, **`+15m`**, or **`+30m`** delay chips to immediately shift all downstream arrival times and recalculate the 10-minute alert trigger.

### 7. 💡 Commuter Screen WakeLock
- Tap **💡** in the top bar to keep your phone's display awake while sitting on the train or waiting on the platform without screen timeout.

### 8. 📲 PWA Offline & Installable
- Fully installable to Home Screen on iOS (Safari Share ➔ Add to Home Screen) and Android (Chrome Install prompt).
- Service Worker with instant auto-update and offline caching.

---

## 🚉 Corridor Station Breakdown (16 Halts)

| # | Code | Station Name | Tamil Name | Morning Arr (49002) | Evening Arr (49007) | Platform | Distance |
|---|------|--------------|------------|---------------------|---------------------|----------|----------|
| 1 | **MSB** | Chennai Beach | சென்னை கடற்கரை | 09:30 (Terminus) | 18:17 (Dep) | PF 1 / 2 | 0 / 60 km |
| 2 | **MSF** | Chennai Fort | சென்னை கோட்டை | 09:22 | 18:21 | PF 1 / 2 | 4 / 56 km |
| 3 | **MPK** | Chennai Park | பூங்கா | 09:18 | 18:24 | PF 1 / 2 | 5 / 55 km |
| 4 | **MS** | **Chennai Egmore** | சென்னை எழும்பூர் | 09:14 | 18:27 | **PF 11 / 10** | 6 / 54 km |
| 5 | **MBM** | Mambalam | மாம்பலம் | 08:59 | 18:37 | PF 3 / 4 | 12 / 48 km |
| 6 | **GDY** | Guindy | கிண்டி | 08:54 | 18:42 | PF 3 / 4 | 16 / 44 km |
| 7 | **STM** | St. Thomas Mount | பரங்கிமலை | 08:50 | 18:45 | PF 3 / 4 | 19 / 41 km |
| 8 | **CMP** | Chromepet | குரோம்பேட்டை | 08:41 | 18:54 | PF 3 / 4 | 27 / 33 km |
| 9 | **TBM** | **Tambaram** | தாம்பரம் | 08:33 | 19:04 | **PF 8 / 7** | 29 / 31 km |
| 10 | **PRGL** | Perungalathur | பெருங்களத்தூர் | 08:23 | 19:10 | PF 2 / 3 | 34 / 26 km |
| 11 | **UPM** | Urappakkam | ஊரப்பாக்கம் | 08:17 | 19:16 | PF 2 / 1 | 40 / 20 km |
| 12 | **GI** | Guduvancheri | கூடுவாஞ்சேரி | 08:12 | 19:22 | PF 2 / 1 | 43 / 17 km |
| 13 | **POTI** | Potheri | பொத்தேரி | 08:07 | 19:28 | PF 2 / 1 | 48 / 12 km |
| 14 | **SKL** | Singaperumal Koil | சிங்கபெருமாள்கோவில் | 08:01 | 19:32 | PF 1 / 2 | 53 / 7 km |
| 15 | **PWU** | Paranur | பரனூர் | 07:56 | 19:37 | PF 2 / 1 | 57 / 3 km |
| 16 | **CGL** | **Chengalpattu Jn** | செங்கல்பட்டு சந்திப்பு | 07:50 (Dep) | 19:50 (Terminus) | **PF 4 / 5** | 60 / 0 km |

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/ompatel4423/Train-Tracker.git
cd Train-Tracker

# Start the native local server
npm start
# or: node dev-server.js

# Open in browser
open http://localhost:3000
```

---

## 📄 License
MIT © [ompatel4423](https://github.com/ompatel4423)
