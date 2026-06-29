import { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, Droplets, Thermometer, Eye, Loader2, MapPin, Sparkles, AlertTriangle, CloudSnow, Cloud, CloudSun, CloudDrizzle, Cloudy } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTranslation, getLangForAI } from '../utils/i18n';

const INDIAN_API_KEY = 'sk-live-53uikf89OPzAFpjJWJMtU84OxsMD4uPEWeqC21dP';

// ─── Weather code → icon mapping (for open-meteo fallback) ───
const WMO_ICONS = {
  0: { label: 'Clear Sky' }, 1: { label: 'Mainly Clear' }, 2: { label: 'Partly Cloudy' },
  3: { label: 'Overcast' }, 45: { label: 'Foggy' }, 48: { label: 'Rime Fog' },
  51: { label: 'Light Drizzle' }, 53: { label: 'Drizzle' }, 55: { label: 'Dense Drizzle' },
  61: { label: 'Slight Rain' }, 63: { label: 'Moderate Rain' }, 65: { label: 'Heavy Rain' },
  71: { label: 'Slight Snow' }, 73: { label: 'Moderate Snow' }, 75: { label: 'Heavy Snow' },
  80: { label: 'Rain Showers' }, 81: { label: 'Rain Showers' }, 82: { label: 'Violent Rain' },
  95: { label: 'Thunderstorm' },
};

function getWeatherIcon(description) {
  if (!description) return { icon: Sun, color: 'text-amber-400' };
  const desc = description.toLowerCase();
  if (desc.includes('thunder') || desc.includes('storm')) return { icon: CloudRain, color: 'text-purple-500' };
  if (desc.includes('heavy rain') || desc.includes('violent')) return { icon: CloudRain, color: 'text-blue-600' };
  if (desc.includes('rain') || desc.includes('shower')) return { icon: CloudRain, color: 'text-blue-400' };
  if (desc.includes('drizzle')) return { icon: CloudDrizzle, color: 'text-blue-400' };
  if (desc.includes('snow')) return { icon: CloudSnow, color: 'text-sky-400' };
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return { icon: Cloud, color: 'text-sage' };
  if (desc.includes('overcast') || desc.includes('cloudy')) return { icon: Cloudy, color: 'text-sage' };
  if (desc.includes('partly') || desc.includes('few clouds')) return { icon: CloudSun, color: 'text-amber-300' };
  if (desc.includes('clear') || desc.includes('sunny')) return { icon: Sun, color: 'text-amber-400' };
  return { icon: Cloud, color: 'text-sage' };
}

// ─── Normalize weather responses into a common shape ───
function normalizeIndianAPI(data) {
  return {
    source: 'IndianAPI',
    temperature: data?.current?.temperature ?? data?.temperature ?? '--',
    humidity: data?.current?.humidity ?? data?.humidity ?? '--',
    windSpeed: data?.current?.wind_speed ?? data?.wind?.speed ?? '--',
    precipitation: data?.current?.precipitation ?? data?.precipitation ?? '0',
    description: data?.current?.description ?? data?.weather ?? data?.current?.weather ?? 'Clear',
    feelsLike: data?.current?.feels_like ?? data?.feels_like ?? null,
    sunrise: data?.astronomy?.sunrise ?? data?.sun?.sunrise ?? null,
    sunset: data?.astronomy?.sunset ?? data?.sun?.sunset ?? null,
    forecast: data?.forecast ?? [],
  };
}

function normalizeOpenMeteo(data) {
  const wmoLabel = (code) => WMO_ICONS[code]?.label || 'Clear Sky';
  const forecast = data?.daily?.time?.map((day, i) => ({
    date: day,
    dayLabel: i === 0 ? 'Today' : new Date(day).toLocaleDateString('en', { weekday: 'short' }),
    description: wmoLabel(data.daily.weather_code[i]),
    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
    minTemp: Math.round(data.daily.temperature_2m_min[i]),
    rainChance: data.daily.precipitation_probability_max[i],
  })) || [];

  return {
    source: 'Open-Meteo',
    temperature: Math.round(data?.current?.temperature_2m),
    humidity: data?.current?.relative_humidity_2m,
    windSpeed: Math.round(data?.current?.wind_speed_10m),
    precipitation: data?.current?.precipitation,
    description: wmoLabel(data?.current?.weather_code),
    feelsLike: Math.round(data?.current?.apparent_temperature),
    sunrise: null,
    sunset: null,
    forecast,
  };
}

export default function Weather() {
  const t = getTranslation;
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [smartAlert, setSmartAlert] = useState('');
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [irrigationAdvice, setIrrigationAdvice] = useState('');
  const [loadingIrrigation, setLoadingIrrigation] = useState(false);
  const [cityInput, setCityInput] = useState('');

  useEffect(() => { fetchWeather(); }, []);

  const fetchWeather = async (manualCity) => {
    // 0. Try loading from cache first
    const cachedData = localStorage.getItem('kisanalert_cached_weather');
    const cachedCity = localStorage.getItem('kisanalert_cached_weather_city');
    const cachedTime = localStorage.getItem('kisanalert_cached_weather_time');
    
    let useCache = false;
    if (cachedData && cachedCity && cachedTime && !manualCity) {
      const parsedTime = parseInt(cachedTime, 10);
      const now = Date.now();
      // If cache is less than 30 minutes old
      if (now - parsedTime < 30 * 60 * 1000) {
        setWeather(JSON.parse(cachedData));
        setLocationName(cachedCity);
        setLoading(false);
        useCache = true;
      }
    }

    if (!useCache) {
      setLoading(true);
    }
    setError(null);

    try {
      let city = manualCity;
      let lat, lon;

      // 1. Geolocate if no manual city
      if (!city) {
        try {
          const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
          );
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
            headers: { 'User-Agent': 'KissanAlert/1.0' }
          });
          const geoData = await geoRes.json();
          city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state_district || geoData.address?.county || 'Delhi';
        } catch {
          city = cachedCity || 'Delhi';
        }
      }

      setLocationName(city);

      // 2. Try IndianAPI
      let normalized = null;
      try {
        const res = await fetch(`https://weather.indianapi.in/india/weather?city=${encodeURIComponent(city)}`, {
          headers: { 'X-Api-Key': INDIAN_API_KEY },
        });
        if (res.ok) {
          const data = await res.json();
          normalized = normalizeIndianAPI(data);
        } else {
          console.warn('IndianAPI returned', res.status, '— falling back to Open-Meteo');
        }
      } catch (e) {
        console.warn('IndianAPI unavailable:', e.message, '— falling back to Open-Meteo');
      }

      // 3. Fallback: open-meteo (needs lat/lon)
      if (!normalized) {
        if (!lat || !lon) {
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},India&format=json&limit=1`, {
              headers: { 'User-Agent': 'KissanAlert/1.0' }
            });
            const geoData = await geoRes.json();
            if (geoData.length > 0) { lat = geoData[0].lat; lon = geoData[0].lon; }
            else { lat = 28.6139; lon = 77.2090; } // Delhi fallback
          } catch { lat = 28.6139; lon = 77.2090; }
        }
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Both weather APIs failed');
        const data = await res.json();
        normalized = normalizeOpenMeteo(data);
      }

      setWeather(normalized);
      localStorage.setItem('kisanalert_cached_weather', JSON.stringify(normalized));
      localStorage.setItem('kisanalert_cached_weather_city', city);
      localStorage.setItem('kisanalert_cached_weather_time', Date.now().toString());
    } catch (err) {
      console.error('Weather error:', err);
      if (!localStorage.getItem('kisanalert_cached_weather')) {
        setError(err.message?.includes('denied')
          ? 'Location permission denied. Please enter a city name below.'
          : 'Failed to fetch weather data. Check your connection or try a different city.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
      setCityInput('');
    }
  };

  // ─── AI Smart Irrigation Advisory ───
  const generateIrrigationAdvice = async () => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }
    setLoadingIrrigation(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const userLang = getLangForAI(localStorage.getItem('SMART_AG_LANG') || 'English');
      const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      const recentScans = scans.slice(0, 5).map(s => `${s.identity} - ${s.diagnosis} (${s.severity}, Water Stress: ${s.waterStress || 'Unknown'})`).join('; ');
      const farmType = localStorage.getItem('SMART_AG_FARM_TYPE') || 'Mixed';
      const waterSource = localStorage.getItem('SMART_AG_WATER_SOURCE') || 'Not specified';

      let forecastSummary = 'No forecast data';
      if (weather?.forecast?.length) {
        forecastSummary = weather.forecast.map(d =>
          `${d.date || d.dayLabel}: ${d.description || 'N/A'}, Max: ${d.maxTemp ?? d.temp_max ?? 'N/A'}°, Min: ${d.minTemp ?? d.temp_min ?? 'N/A'}°, Rain: ${d.rainChance ?? 'N/A'}%`
        ).join('\n');
      }

      const prompt = `You are an expert agricultural water management advisor for Indian farmers. Based on this data:

CURRENT WEATHER: Temperature ${weather?.temperature}°C, Humidity ${weather?.humidity}%, Wind ${weather?.windSpeed} km/h, Rain: ${weather?.precipitation}mm
LOCATION: ${locationName}
FARM TYPE: ${farmType}
WATER SOURCE: ${waterSource}

7-DAY FORECAST:
${forecastSummary}

FARMER'S RECENT CROP/LIVESTOCK SCANS: ${recentScans || 'No scans yet'}

Provide a SMART IRRIGATION ADVISORY with:
1. 💧 TODAY'S IRRIGATION RECOMMENDATION: Should the farmer irrigate today? How much water? What time is best?
2. 📅 WEEKLY WATER PLAN: Day-by-day irrigation schedule for the next 7 days based on the forecast
3. ⚠️ WATER ALERTS: Any water-related warnings (drought risk, waterlogging risk, frost, excessive heat)
4. 🌱 CROP-SPECIFIC TIPS: If crops are identified, give specific water needs for those crops at their growth stage

Format with clear sections and emojis. Be concise but actionable.
CRITICAL INSTRUCTION: You MUST write the ENTIRE response (all text, titles, warnings, and schedules) in the language: ${userLang}. Do NOT use English under any circumstances except for standard measurements or units. Translate everything. Keep each section to 2-3 lines max.`;

      const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      let responseText = '';
      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          responseText = res.response.text();
          break;
        } catch (e) { console.warn(`${modelName} failed`, e); }
      }
      setIrrigationAdvice(responseText);
    } catch (err) {
      console.error('Irrigation advice error:', err);
      alert('Failed to generate irrigation advice.');
    } finally {
      setLoadingIrrigation(false);
    }
  };

  // ─── AI Smart Alerts ───
  const generateSmartAlert = async () => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }
    setLoadingAlert(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const userLang = getLangForAI(localStorage.getItem('SMART_AG_LANG') || 'English');
      const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      const recentScans = scans.slice(0, 5).map(s => `${s.identity} - ${s.diagnosis} (${s.severity})`).join('; ');

      let forecastSummary = 'No forecast data';
      if (weather?.forecast?.length) {
        forecastSummary = weather.forecast.map(d =>
          `${d.date || d.dayLabel}: ${d.description || 'N/A'}, Max: ${d.maxTemp ?? d.temp_max ?? 'N/A'}°, Min: ${d.minTemp ?? d.temp_min ?? 'N/A'}°`
        ).join('\n');
      }

      const prompt = `You are an expert agricultural meteorologist advisor. Based on this data:

CURRENT WEATHER: Temperature ${weather?.temperature}°C, Humidity ${weather?.humidity}%, Wind ${weather?.windSpeed} km/h
LOCATION: ${locationName}

FORECAST:
${forecastSummary}

FARMER'S RECENT SCANS: ${recentScans || 'No scans yet'}

Provide 3-4 SHORT, practical smart alerts combining weather conditions with the farmer's crop/livestock situation.
Format each alert as: [EMOJI] [Alert Title]: [Brief actionable advice]
Be specific to their crops/animals. If no scans, give general seasonal advice.
Include at least one water management alert.
CRITICAL INSTRUCTION: You MUST write the ENTIRE response in the language: ${userLang}. Do NOT use English under any circumstances. Translate everything, including any titles and emojis labels. Keep it concise.`;

      const modelNames = ['gemini-2.5-flash', 'gemini-1.5-flash'];
      let responseText = '';
      for (const modelName of modelNames) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const res = await model.generateContent(prompt);
          responseText = res.response.text();
          break;
        } catch (e) { console.warn(`${modelName} failed`, e); }
      }
      setSmartAlert(responseText);
    } catch (err) {
      console.error('Smart alert error:', err);
      alert('Failed to generate alerts.');
    } finally {
      setLoadingAlert(false);
    }
  };

  // ─── Loading / Error states ───
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-aqua animate-spin mb-4" />
      <p className="text-sage font-bold text-sm">{t("Fetching weather data...")}</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
      <AlertTriangle className="w-12 h-12 text-alert mb-4" />
      <p className="text-charcoal dark:text-white font-bold text-sm mb-4">{error}</p>
      <form onSubmit={handleCitySearch} className="flex gap-2 w-full max-w-sm mb-4">
        <input value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Enter city name..."
          className="flex-1 bg-white dark:bg-charcoalDark h-12 rounded-xl px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-aqua transition-colors" />
        <button type="submit" className="water-gradient text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">Search</button>
      </form>
      <button onClick={() => fetchWeather()} className="text-sage hover:text-aqua font-bold text-xs uppercase tracking-widest transition-colors">Or retry with location</button>
    </div>
  );

  // ─── Render ───
  const currentInfo = getWeatherIcon(weather?.description);
  const CurrentIcon = currentInfo.icon;

  return (
    <>
      <header className="mb-6 mt-2">
        <h2 className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl uppercase leading-none">{t("Weather")} & {t("Water Advisory")}</h2>
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-sage" />
          <p className="text-sage font-semibold text-xs">{locationName}</p>
          {weather?.source && (
            <span className="ml-2 text-[8px] font-bold uppercase tracking-widest text-aqua/60 bg-aqua/10 px-2 py-0.5 rounded-full">{weather.source}</span>
          )}
        </div>
      </header>

      {/* City Search */}
      <form onSubmit={handleCitySearch} className="flex gap-2 mb-4">
        <input value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Search Indian city..."
          className="flex-1 bg-white dark:bg-white/5 h-11 rounded-xl px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 dark:placeholder-white/30 outline-none border border-charcoalDark/10 dark:border-white/10 focus:border-aqua transition-colors" />
        <button type="submit" className="bg-ocean dark:bg-white/10 text-white px-5 h-11 rounded-xl font-display text-[10px] uppercase tracking-widest active:scale-95 transition-transform">Search</button>
      </form>

      {/* Current Weather Hero */}
      <div className="water-gradient rounded-2xl sm:rounded-[24px] p-5 sm:p-8 text-white mb-4 sm:mb-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-aqua/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl -mb-10 -ml-10 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">{t("Current Weather")}</p>
              <h2 className="text-[40px] sm:text-[56px] font-black tracking-tighter leading-none mb-1">
                {weather?.temperature}°
              </h2>
              <p className="text-aquaLight font-bold text-sm">{weather?.description}</p>
              {weather?.feelsLike != null && <p className="text-white/40 text-xs mt-1">Feels like {weather.feelsLike}°C</p>}
            </div>
            <CurrentIcon className={`w-16 h-16 ${currentInfo.color} opacity-80`} />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Humidity</p>
              <p className="text-white font-black text-sm">{weather?.humidity}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <Wind className="w-4 h-4 text-sage mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Wind</p>
              <p className="text-white font-black text-sm">{weather?.windSpeed} km/h</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <CloudRain className="w-4 h-4 text-blue-300 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Rain</p>
              <p className="text-white font-black text-sm">{weather?.precipitation} mm</p>
            </div>
          </div>
        </div>
      </div>

      {/* 💧 Smart Irrigation Advisory (NEW) */}
      <div className="glass-water rounded-2xl p-6 sm:p-8 mb-4 sm:mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-aqua/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-aqua" />
            <p className="font-display text-[12px] uppercase tracking-widest text-ocean dark:text-aqua">💧 {t("Smart Irrigation Advisory")}</p>
          </div>
          <p className="font-body text-charcoalDark/50 dark:text-white/50 text-sm mb-6 leading-relaxed">AI-powered irrigation advice based on current weather, forecast, and your crop data.</p>
          <button onClick={generateIrrigationAdvice} disabled={loadingIrrigation} className="w-full water-gradient text-white font-display text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl active:scale-[0.98] hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-ocean/20">
            {loadingIrrigation ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Droplets className="w-5 h-5" /> Generate Water Advisory</>}
          </button>
          {irrigationAdvice && (
            <div className="mt-6 bg-white/60 dark:bg-white/5 backdrop-blur rounded-xl p-5 sm:p-6 border border-aqua/20">
              <p className="font-display text-[10px] uppercase tracking-widest text-ocean dark:text-aqua mb-4">💧 Irrigation Plan</p>
              <div className="font-body text-charcoalDark/90 dark:text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{irrigationAdvice}</div>
            </div>
          )}
        </div>
      </div>

      {/* AI Smart Alerts */}
      <div className="bg-ocean rounded-2xl p-6 sm:p-8 text-white mb-4 sm:mb-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-aqua/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-aquaLight" />
            <p className="font-display text-[12px] uppercase tracking-widest text-aquaLight">⚡ {t("AI Smart Alerts")}</p>
          </div>
          <p className="font-body text-white/50 text-sm mb-6 leading-relaxed">Weather + crop data correlated advisories for proactive farm protection.</p>
          <button onClick={generateSmartAlert} disabled={loadingAlert} className="w-full bg-aqua text-ocean font-display text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl active:scale-[0.98] hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loadingAlert ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Smart Alerts</>}
          </button>
          {smartAlert && (
            <div className="mt-6 bg-white/5 backdrop-blur rounded-xl p-5 sm:p-6 border border-white/10">
              <p className="font-display text-[10px] uppercase tracking-widest text-aquaLight mb-4">Active Advisories</p>
              <div className="font-body text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{smartAlert}</div>
            </div>
          )}
        </div>
      </div>

      {/* Sunrise / Sunset (IndianAPI only) */}
      {(weather?.sunrise || weather?.sunset) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {weather?.sunrise && (
            <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-4 border border-charcoalDark/10 dark:border-white/10 shadow-sm text-center">
              <Sun className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-sage font-bold">Sunrise</p>
              <p className="text-charcoalDark dark:text-white font-black text-sm mt-1">{weather.sunrise}</p>
            </div>
          )}
          {weather?.sunset && (
            <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-4 border border-charcoalDark/10 dark:border-white/10 shadow-sm text-center">
              <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-[8px] uppercase tracking-widest text-sage font-bold">Sunset</p>
              <p className="text-charcoalDark dark:text-white font-black text-sm mt-1">{weather.sunset}</p>
            </div>
          )}
        </div>
      )}

      {/* 7-Day Forecast */}
      {weather?.forecast?.length > 0 && (
        <>
          <h3 className="text-charcoal dark:text-white font-extrabold text-xs uppercase tracking-wider mb-4">{t("7-Day Forecast")}</h3>
          <div className="overflow-x-auto custom-scroll -mx-5 px-5 pb-2 mb-6">
            <div className="flex gap-3">
              {weather.forecast.slice(0, 7).map((day, i) => {
                const info = getWeatherIcon(day.description);
                const DayIcon = info.icon;
                const label = day.dayLabel || (i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' }));
                return (
                  <div key={i} className={`shrink-0 w-[100px] ${i === 0 ? 'bg-aqua/10 border-aqua/30' : 'bg-white dark:bg-charcoal/80 border-sage/10 dark:border-white/10'} rounded-2xl p-4 text-center border shadow-sm`}>
                    <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-2 truncate">{label}</p>
                    <DayIcon className={`w-8 h-8 mx-auto mb-2 ${info.color}`} />
                    <p className="text-charcoal dark:text-white font-black text-sm">{day.maxTemp ?? day.temp_max ?? '--'}°</p>
                    <p className="text-sage text-[10px] font-bold">{day.minTemp ?? day.temp_min ?? '--'}°</p>
                    {day.rainChance != null && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <p className="text-[9px] text-blue-400 font-bold">{day.rainChance}%</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Bottom spacer */}
      <div className="h-28"></div>
    </>
  );
}
