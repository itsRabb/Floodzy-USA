# 🌊 RisqMap / RisqMap - Real-time Flood Monitoring & Weather Insights (US-focused)

<div align="center">
  <img src="public/logo1.png" alt="RisqMap Logo" width="200"/>

  <p align="center">
    <strong>Real-time flood monitoring, weather tracking, and multi-source alerts for US communities.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-13-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase"/>
  </p>
</div>

---

## 🚀 Overview

RisqMap (RisqMap fork) is a real-time flood monitoring and early warning platform built with **Next.js**, **TypeScript**, **React**, **Tailwind CSS**, and **Supabase**. The app provides water level feeds, pump status, weather forecasts via Open‑Meteo, disaster analysis, and interactive maps tailored for US regions. Data sources and features are adapted for US-centric workflows (USGS, FEMA, Nominatim country filter = US).

---
```
🌟 Roadmap -- RisqMap

> Project roadmap is now managed via [GitHub Issues](https://github.com/itsRabb/). Check the Issues tab to see development plans and contribute.
```

<h3 align="center">🌊 Main Features</h3>
<p>RisqMap provides a comprehensive feature set for real-time disaster monitoring and situational awareness.</p>

<table>
  <tr>
    <td width="50%">
      <h4>🗺️ Interactive Disaster Map</h4>
      <p>Real-time visualization of flood, weather, and sensor data using <b>Leaflet</b>, complete with interactive markers, layers, legends, and maps.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1fGo6J4es_JFH7eIXztyDYh3TKCg9WCer" alt="Interactive Disaster Map" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>📊 Landing Dashboard</h4>
      <p>Shows the RisqMap landing dashboard (hero section) with concise stats and primary navigation to monitoring features.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1Z-ONZGvKl7riQOARz1Lqm3IQJZJuIgci" alt="Landing Dashboard" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🤖 Flood Map & Evacuation Locations</h4>
      <p>Users can select a flood location on the map and automatically find the nearest evacuation point based on their location.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1vh0Lq0UezQ4lw8oHMCv13ZbMnb_-OSAJ" alt="Flood Map and Evacuation" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🌦️ Forecast & Weather History</h4>
      <p>Presents real-time weather data (temperature, humidity, wind speed) using <b>Open‑Meteo</b> (no API key required). Raster tile overlays from legacy providers are not used.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1CrBlERMTVB5o8NlheViY1jxkxWrBsIbs" alt="Forecast & Weather History" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>
<tr>
    <td width="50%">
      <h4>🚨 Multi-Source Early Warning</h4>
      <p>Collects warning data from various trusted sources to provide fast and accurate disaster notifications.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1SGVyChTnBIIG62nUXxEAFRupmP7cjSmp" alt="Multi-Source Early Warning" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🌬️ Air Quality Monitoring</h4>
      <p>Displays air pollution levels in selected areas to provide important environmental health information.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1LE2UlyOrQDjqh-riWj09-3B8hjD9nL4X" alt="Air Quality Monitoring" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🌍 Earthquake Information</h4>
      <p>Displays the latest earthquake data directly from <b>USGS</b> for real-time geological disaster and flood preparedness.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1YbOs2aPQNskv_5rB2xrqGXLXxHhk8bjs" alt="Earthquake Information" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>📈 Statistics & Analysis Dashboard</h4>
      <p>The <code>/statistika</code> page displays historical disaster statistics, rainfall charts, and flood reports in an easy-to-understand visual format.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1e1gYjYEo8vlc-Aa1UezjypglABkTYtiQ" alt="Statistics & Analysis Dashboard" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>💬 Sensor Data Analysis</h4>
      <p>Analyzes sensor data to accurately predict the likelihood of future floods using real-time data readings.</p>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1fvamK7WQD5vNaPxA9Nf09T8zelbxk3Me" alt="Sensor Data Analysis" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🌡️ Flood Statistics</h4>
      <p>Shows flood trends and historical data (temperature, humidity, water level, wind) for correlation analysis.</p>
      <ul>
        <li>Real-time weather data (Open‑Meteo)</li>
        <li>Tile overlays provided by supported providers or vector layers (no legacy raster tile providers)</li>
        <li>Weather and flood history</li>
      </ul>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1N1r0adgwvHxjyhBP1ZV-XLlcCQ4oFUYQ" alt="Flood Data Statistics" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🚨 Warning & Analysis</h4>
      <p>Provides disaster warnings from integrated data sources and automatic analysis using the <b>Gemini API</b>.</p>
      <ul>
        <li>Cross-source data integration</li>
        <li>AI-powered automatic analysis</li>
        <li>Disaster news summary</li>
      </ul>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1H4k4ylseAh6ePZ3ppiPrtSYF2IebiP4l" alt="Warning & Analysis" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>📍 Current Weather</h4>
      <p>Displays current weather based on user location permission automatically via an interactive popup.</p>
      <ul>
        <li>Automatic location (GPS)</li>
        <li>Temperature, humidity, and wind speed data</li>
        <li>Interactive UI popup</li>
      </ul>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1dNG7jdIcfTQWoK3bTUP0qH1cushyfJQT" alt="Current Weather" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>💬 Satellite Mode</h4>
      <p>Satellite mode allows users to view maps with detailed visuals to monitor locations and flood levels more clearly.</p>
      <ul>
        <li>Satellite map view</li>
        <li>Flood location visuals</li>
        <li>Interactive chatbot</li>
      </ul>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1CvF2Hu0XJLwWFf2AbCWms4pZUMdiuPBn" alt="Satellite Mode" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>

  <tr>
    <td width="50%">
      <h4>🛠 Critical Infrastructure Monitoring</h4>
      <p>Displays real-time infrastructure data such as water levels and flood pump status via an interactive scrollbar.</p>
      <ul>
        <li>Flood pump status</li>
        <li>Water level</li>
        <li>Real-time monitoring</li>
      </ul>
    </td>
    <td align="center">
      <img src="https://drive.google.com/uc?export=view&id=1VqNCH2Z5YNYjeQg8DGXCWNmRa_dOlona" alt="Critical Infrastructure Monitoring" style="border:2px solid #38B2AC; border-radius:12px; width:90%; max-width:700px;">
    </td>
  </tr>
</table>

- Public API (`/api`) for data integration.
- Custom hooks for state & UI management.

---

⚡ Custom Hooks
🌍 useRegionData → Regional data & monitoring for United States

🚰 usePumpStatusData → Flood pump status

🌊 useWaterLevelData → Water level data

🌫️ useAirPollutionData → Air quality data

🌐 useUSGSQuakeData → Earthquake data (USGS Global)

🚨 useDisasterData → General disaster data

🎨 UI & Experience

🌓 useTheme → UI theme management

🔔 useToast → Toast notifications

🛠️ Utilities

⏳ useDebounce → Input debouncing

## 📁 Project Structure

## API Hardening: Rate Limiting & Caching

To maintain API stability and prevent misuse, the RisqMap API implements rate limiting and caching mechanisms.

**Rate Limiting**: The API is limited to 60 requests per minute per IP address. If this limit is exceeded, a `429 Too Many Requests` response will be returned.

**Caching**: API responses are cached to reduce server load and improve response times. The default cache TTL (Time-To-Live) value is 60 seconds.

Both features run using Upstash Redis. Ensure the following environment variables are set in the `.env.local` file:

```
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN

```

You can override the default cache TTL value for specific routes by providing a `ttl` option in the caching function within the route handler. For example:

typescript
await setCache(cacheKey, data, { ttl: 300 });
Observability
RisqMap integrates with Sentry for error monitoring and performance tracing, and implements structured logging on API routes to enhance observability.

Sentry Configuration in the RisqMap Project
Sentry assists us in real-time error tracking and performance monitoring. To enable Sentry, set the following environment variables in the .env.local file (for local development) and also in your deployment environment (e.g., Vercel) during the preview and production stages:
```

SENTRY_DSN="https://<your-dsn>.ingest.sentry.io/<project-id>"
SENTRY_TRACES_SAMPLE_RATE="0.1"
SENTRY_PROFILES_SAMPLE_RATE="0.0"
SENTRY_ENVIRONMENT="development" # or "production", "preview"

```

SENTRY_DSN: Your project's DSN from Sentry.

SENTRY_TRACES_SAMPLE_RATE: Percentage of transactions to sample for performance monitoring (e.g., 0.1 for 10%).

SENTRY_PROFILES_SAMPLE_RATE: Percentage of transactions to sample for profiling (e.g., 0.0 for disabled).

SENTRY_ENVIRONMENT: The environment name (e.g., development, production, preview).

Anda dapat melihat error yang tertangkap dan jejak performa di dashboard Sentry, masing-masing pada tab "Issues" dan "Performance".

API Logging Structure
API routes (`/api/*`) produce structured JSON logs for better insights into request processing. Each API response includes an `X-Request-Id` header which can be used to correlate logs for a single request.

Example log entry (you can search for `X-Request-Id` in your Vercel logs):

```
{
  "level": "info",
  "ts": "2025-08-27T12:34:56.789Z",
  "route": "/api/disaster-reports",
  "method": "GET",
  "status": 200,
  "ip": "192.168.1.1",
  "cache": "HIT",
  "rlRemaining": 59,
  "durationMs": 15,
  "requestId": "some-uuid-1234"
}
```

Key fields in the logs:

route: The API endpoint path.

method: HTTP method (e.g., GET, POST).

status: HTTP response status code.

ip: Client IP address.

cache: Cache status (HIT, MISS, BYPASS).

rlRemaining: Remaining requests in the rate limit window.

durationMs: Request duration in milliseconds.

error: Error message if an error occurred.

requestId: Unique ID for the request (X-Request-Id header).

```
### 🌊 API Endpoints — RisqMap Backend

| Endpoint                | Description                                   | Parameter              |
|-------------------------|-----------------------------------------------|------------------------|
| `/api/analysis`         | AI-based disaster analysis                     | -                      |
| `/api/alerts-data`      | Consolidated alert data                        | -                      |
| `/api/chatbot`          | Flood & weather information chatbot            | `message` (POST)       |
| `/api/evacuation`       | Nearest evacuation points                       | `regionId`             |
| `/api/gemini-alerts`    | Automated alerts from Gemini API               | -                      |
| `/api/gemini-analysis`  | In-depth AI analysis for incidents             | -                      |
| `/api/reports`          | User-submitted flood reports                    | `location`, `status`   |
| `/api/pump-status-proxy`| Flood pump status proxy                         | `pumpId`               |
| `/api/regions`          | List of monitored regions                       | -                      |
| `/api/water-level-proxy`| Water level proxy                               | `stationId`            |
| `/api/weather`          | Current weather (Open‑Meteo)                    | `lat`, `lon`           |
| `/api/weather-history`  | Historical weather data                         | `regionId`             |
```


🚀 Getting Started
Follow these steps to clone and run RisqMap in your local development environment.

1. Prerequisites
- Node.js (v18 or newer)
- npm / yarn / pnpm
- Supabase CLI (for local database setup)

2. Installation
Clone the repository:

```
git clone https://github.com/mattyudha/risqmap.git
cd risqmap
```

Install dependencies:

```
npm install
```

3. Environment configuration
Create a `.env.local` from the example file:

```
cp .env.example .env.local
```

Fill in all environment variables in the .env.local file. Ensure all variables are filled, as many features depend on these API keys.
```
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Third-Party APIs (Required)
# Note: RisqMap uses Open‑Meteo for weather data (no legacy raster tile provider API key required).
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...
GEMINI_API_KEY=...

# Upstash Redis for Caching & Rate Limiting (Required)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Sentry for Error Monitoring (Optional)
SENTRY_DSN=...
SENTRY_ENVIRONMENT="development"

```
Setup Database (Supabase)
Log in to the Supabase CLI:

```
npx supabase login
```
Start Supabase locally:
```
npx supabase start
```

Apply database migrations. Table schemas and functions will be created automatically.

```
npx supabase db reset
```

Run the Application
Run the development server:

```
npm run dev
```
Open http://localhost:3000 in your browser.

Other Commands
npm run build: Create a production build.

npm run test: Run tests with Vitest.

npm run lint: Check code quality with ESLint.


### 📊 Performance

<div align="center">
  <img 
    src="https://drive.google.com/uc?export=view&id=141ihZZuGfCdzUT3iC3NmqobkcPImNWnH" 
    alt="Lighthouse Score" 
  style="border: 2px solid #38B2AC; border-radius: 8px; margin: 16px 0; width: 70%; max-width: 480px;">
</div>

**⚡ Lighthouse Score:** 95+  
**🚀 FCP:** < 1.5s  
**⏱️ TTI:** < 3s  
**📈 AUC:** 0.992  


---

### 🛡️ Security

- Supabase **Row Level Security (RLS)**
- **Server-side** input validation
- **API keys** stored securely in *environment variables*


---

### 🛠️ Architecture & Technology

RisqMap is built on a modern technology stack designed for **scalability**, **performance**, and **ease of development**.

- **Frontend:** Next.js 13+ (App Router) & TypeScript  
  UI uses Tailwind CSS and *reusable* components from `shadcn/ui`.

- **State Management:** React Query (`@tanstack/react-query`)  
  For caching, re-fetching, and data synchronization to keep the UI always *real-time*.

- **Backend:** Next.js API Routes + Supabase  
  PostgreSQL database, authentication, and security via **Row Level Security (RLS)**.

- **Testing:** Using **Vitest** for *smoke tests* to ensure core functionality remains stable.

- **CI/CD:** Managed with **GitHub Actions** — automatic linting & testing on every commit.


---

### 🎉 Acknowledgments

1. [Open‑Meteo](https://open-meteo.com/)  
2. [OpenFEMA / FEMA API](https://www.fema.gov/about/openfema)  
3. [Supabase](https://supabase.com/)  
4. [Leaflet](https://leafletjs.com/)  
5. [USGS](https://www.usgs.gov/)  
