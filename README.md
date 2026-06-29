# 🌾 Kisan Alert — Smart Water, Crop & Advisory System

> **"Smart Water, Healthy Crops."** A high-performance, offline-first PWA powered by Gemini AI to optimize water conservation, diagnose crop diseases instantly, and provide intelligent farm analytics in **22 Indian languages**.

---

## 🚀 Hackathon Submission Highlights
- **Water Conservation Focus**: Solves agricultural water waste (flood irrigation wastes up to 60% of water) through real-time weather-linked water budgets and smart advisories.
- **Multilingual Support**: Supports **22 Indian languages** (Hindi, Telugu, Tamil, Assamese, Punjabi, etc.) to ensure accessibility for every farmer.
- **Offline-First PWA**: Engineered as a Progressive Web Application with client-side LocalStorage caching, allowing critical scans and weather data to work seamlessly in low-connectivity rural regions.
- **Premium Bento-Grid UX**: Designed with a high-fidelity glassmorphic interface, dark/light theme options, interactive bar charts, water-wave vector graphics, and floating background animations.

---

## 🎨 Key Features

### 💧 1. Smart Water Advisory & Mapping
- **Weather-Linked Irrigation**: Pulls 7-day precipitation forecasts and uses Gemini AI to evaluate local water requirements (recommending skip-watering schedules if rain is imminent).
- **Water Source Proximity Proximity Mapping**: Interactive Leaflet maps allowing farmers to outline fields and map water sources, automatically computing proximity distances using the Haversine formula.
- **Water Consumption Analytics**: Log irrigation cycles (drip, sprinkler, furrow) and visualize consumption trends on custom-drawn bento charts.

### 📸 2. AI Crop & Livestock Scanner
- **Gemini-Powered Diagnostics**: Simply photograph crops or livestock to receive instant analysis.
- **Severity & Urgency Indicators**: Classifies health levels (Critical, Fair, Good) and urgency of action needed (Immediate, 24h, Routine).
- **Water-Stress Detection**: Automatically evaluates leaf dehydration or dry soil signs to recommend watering changes.
- **Export & Share**: Share generated PDFs or action plans via WhatsApp, SMS, or print them directly.

### 📊 3. Predictive Resource Analytics
- **Crops Tab**: Log crop species, yields (kg), and growth heights (cm).
- **Livestock Tab**: Track animal breeds, weight logs (kg), and dairy yields (Litres).
- **AI Resource Optimizers**: Generate custom schedules for crop care, feeding budgets, and watering cycles using local contextual prompts (farm size, soil type, and water resources).

### 🤖 4. Kisan AI Assistant
- Contextual chat assistant pre-loaded with local farm metrics, allowing farmers to ask questions in their native language and receive localized, actionable answers.

---

## 🛠️ Technology Stack
- **Frontend Core**: React 18, Vite, TailwindCSS
- **AI Core**: Gemini Pro Vision / Gemini Flash via `@google/generative-ai`
- **Mapping & GIS**: Leaflet, React-Leaflet
- **Icons & Graphics**: Lucide React, Custom CSS Keyframe Wave Animations
- **PWA Capabilities**: `vite-plugin-pwa` with custom service workers
- **Localization**: Lightweight custom JSON i18n translation utility

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/KisanAlert.git
cd KisanAlert/smart-ag

# Install dependencies
npm install
```

### 2. Configure environment
Create a `.env` file in the `smart-ag` directory (or use the setting panel inside the app interface):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 4. Build for Production (PWA)
```bash
npm run build
```
The compiled files, manifest, and service workers will be generated in the `dist/` directory.

---

## 📸 Screenshots & Demos
For detailed visual snapshots of the platform in light/dark modes and interactive workflows, check the walkthrough document:
🔗 **[Visual Walkthrough Artifact](https://github.com/your-username/KisanAlert/blob/main/walkthrough.md)**
