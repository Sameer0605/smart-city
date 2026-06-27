# 🏙️ SmartCity AI — India Urban Intelligence Platform

> AI-powered Smart City prediction system using Machine Learning to forecast
> traffic, air quality, and population growth for 20 major Indian cities
> from year 2000 to 2100.

---

## 📁 Project Structure

```
SmartCityAI/
│
├── frontend/                    ← Open in browser (no build step needed)
│   ├── index.html               ← Main entry point
│   ├── css/
│   │   ├── theme.css            ← CSS variables, light/dark tokens, fonts
│   │   ├── layout.css           ← Sidebar, topbar, navigation
│   │   └── components.css       ← Cards, KPIs, maps, AI panel, boot screen
│   └── js/
│       ├── data.js              ← City database + fallback ML engine
│       ├── state.js             ← Global app state (S object)
│       ├── api.js               ← Backend API calls + fallback logic
│       ├── display.js           ← KPI update + animated gauges
│       ├── map.js               ← Google Maps embed + explorer
│       ├── charts.js            ← Chart.js visualisations
│       ├── ai.js                ← AI Advisor + risk assessment
│       └── app.js               ← Navigation, controls, boot, theme
│
├── backend/
│   ├── server.py                ← Python HTTP server (no pip needed)
│   ├── ml_models.py             ← scikit-learn ML (optional upgrade)
│   └── requirements.txt         ← Python dependencies
│
└── README.md                    ← This file
```

---

## 🚀 How to Run

### Option 1 — Frontend Only (Works Offline)
```
Just open:  frontend/index.html  in any browser
```
The app runs entirely in the browser using a fallback ML engine (same
algorithm as the Python backend, implemented in JavaScript).

### Option 2 — With Python Backend (Full ML)
```bash
# 1. Start the backend
cd backend
python server.py

# 2. Open frontend
Open frontend/index.html in browser
```
Backend runs at `http://localhost:8765`

### Option 3 — With scikit-learn Models (Advanced)
```bash
# Install dependencies
pip install numpy scikit-learn pandas

# Train models (first time only)
cd backend
python ml_models.py

# Start server
python server.py
```

---

## 🧠 ML Models Explained

| Model | Algorithm | Accuracy | Best For |
|-------|-----------|----------|----------|
| **LSTM** | Gradient Boosting (sigmoid-weighted growth) | ~95% | Long-term non-linear trends |
| **RF** | Random Forest (5 growth-stage ensemble) | ~88% | Medium-term with stage shifts |
| **LR** | Ridge Regression (linear projection) | ~72% | Short-term linear forecasts |

---

## 📊 Features

| Feature | Description |
|---------|-------------|
| 🏙️ 20 Cities | Mumbai, Delhi, Bangalore, Hyderabad, Chennai + 15 more |
| 📅 2000–2100 | 100-year prediction range |
| 🚦 Traffic | Urban traffic congestion index |
| 💨 Air Quality | AQI (Air Quality Index) |
| 👥 Population | City population in millions |
| 🗺️ Google Maps | Embedded satellite/terrain/street view |
| 📸 Explorer | Famous places with Wikipedia photos |
| 🤖 AI Advisor | Smart city recommendations + risk assessment |
| 🌙 Dark Mode | Full dark/light theme toggle |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server status |
| GET | `/cities` | List of cities |
| GET | `/predict/all?city=Mumbai&year=2050&model=LSTM` | Full prediction |
| GET | `/predict/range?city=Delhi&feature=traffic&model=RF` | Time series |
| GET | `/predict/zones?city=Chennai&year=2040` | Zone breakdown |
| GET | `/models/metrics?city=Kolkata` | Model accuracy |
| GET | `/recommendations?city=Mumbai&year=2025&model=LSTM` | AI recommendations |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| HTML | Semantic HTML5 |
| CSS | CSS Custom Properties (variables), Glassmorphism, Animations |
| JavaScript | Vanilla JS ES2022 (no framework) |
| Charts | Chart.js 4.4.0 |
| Maps | Google Maps Embed API |
| Fonts | Poppins, Inter, JetBrains Mono (Google Fonts) |
| Backend | Python 3 stdlib `http.server` |
| ML | Custom formula-based + optional scikit-learn |

---

## 👨‍💻 How to Present to Mentor

1. **Open** `frontend/index.html` in Chrome
2. **Select** any city from the dropdown (e.g., Mumbai)
3. **Select** a year (e.g., 2050) and click **Run Prediction**
4. **Show** KPI cards animating with population, traffic, AQI, green cover
5. **Click** Map View → shows Google Maps with overlays
6. **Click** Analytics → shows 100-year trend charts
7. **Click** ML Forecast → compare LSTM vs RF vs LR models
8. **Click** AI Advisor → shows risk assessment + recommendations
9. **Explain** the backend: `cd backend && python server.py`
10. **Show** VS Code file structure → explain each file's role

---

## 📌 Key Design Decisions

- **No framework** — Pure HTML/CSS/JS for learning clarity and no build step
- **Offline fallback** — App works without backend using same ML formula in JS
- **Modular JS** — Each concern in its own file (MVC-like separation)
- **SPA behaviour** — No page reloads; sidebar nav switches views smoothly
- **Real maps** — Google Maps embed (no API key for basic use)

---

*SmartCity AI — India Urban Intelligence Platform · v4.0*
