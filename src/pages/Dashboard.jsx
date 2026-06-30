import { useState, useEffect } from 'react';
import { TrendingUp, Milk, Weight, Wheat, AlertTriangle, Sparkles, Plus, Trash2, Loader2, Droplets } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getTranslation } from '../utils/i18n';
import CustomSelect from '../components/CustomSelect';

const STORAGE_KEYS = {
  MILK_YIELD: 'farmbuddy_milk_yield',
  CROP_YIELD: 'farmbuddy_crop_yield',
  WEIGHT: 'farmbuddy_weight_log',
  GROWTH: 'farmbuddy_growth_log',
  WATER_USAGE: 'kisanalert_water_usage',
  IRRIGATION: 'kisanalert_irrigation_log',
};

function MiniBarChart({ data, maxVal, color = '#E5A914', label = '' }) {
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-32 mt-3">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-[8px] font-black text-charcoalDark dark:text-white">{d.value}</span>
          <div
            className="w-full rounded-t-md transition-all duration-500 hover:brightness-110"
            style={{
              height: `${Math.max((d.value / max) * 100, 4)}%`,
              background: color,
              opacity: 0.7 + (i / data.length) * 0.3,
            }}
          />
          <span className="text-[7px] font-bold text-sage truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const t = getTranslation;
  const [scans, setScans] = useState([]);
  const [milkLog, setMilkLog] = useState([]);
  const [cropYieldLog, setCropYieldLog] = useState([]);
  const [weightLog, setWeightLog] = useState([]);
  const [growthLog, setGrowthLog] = useState([]);
  const [waterLog, setWaterLog] = useState([]);
  const [irrigationLog, setIrrigationLog] = useState([]);
  const [milkInput, setMilkInput] = useState('');
  const [milkAnimal, setMilkAnimal] = useState('');
  const [cropInput, setCropInput] = useState('');
  const [cropName, setCropName] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [weightAnimal, setWeightAnimal] = useState('');
  const [growthInput, setGrowthInput] = useState('');
  const [growthCrop, setGrowthCrop] = useState('');
  const [waterInput, setWaterInput] = useState('');
  const [waterField, setWaterField] = useState('');
  const [irrigationDuration, setIrrigationDuration] = useState('');
  const [irrigationMethod, setIrrigationMethod] = useState('Drip');
  const [feedPlan, setFeedPlan] = useState('');
  const [fertilizerPlan, setFertilizerPlan] = useState('');
  const [waterPlan, setWaterPlan] = useState('');
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingFertilizer, setLoadingFertilizer] = useState(false);
  const [loadingWater, setLoadingWater] = useState(false);
  const [activeTab, setActiveTab] = useState('livestock');

  useEffect(() => {
    const loadData = () => {
      const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      setScans(history);
      setMilkLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.MILK_YIELD) || '[]'));
      setCropYieldLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.CROP_YIELD) || '[]'));
      setWeightLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.WEIGHT) || '[]'));
      setGrowthLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.GROWTH) || '[]'));
      setWaterLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.WATER_USAGE) || '[]'));
      setIrrigationLog(JSON.parse(localStorage.getItem(STORAGE_KEYS.IRRIGATION) || '[]'));
    };

    loadData();

    window.addEventListener('kisanalert_data_synced', loadData);
    return () => {
      window.removeEventListener('kisanalert_data_synced', loadData);
    };
  }, []);

  // Stats
  const livestockScans = scans.filter(s => s.type === 'Livestock');
  const cropScans = scans.filter(s => s.type === 'Crop');
  const criticalAlerts = scans.filter(s => s.severity === 'Critical').length;
  const avgHealth = scans.length > 0 ? Math.round(scans.reduce((a, s) => a + (s.healthPercentage || 0), 0) / scans.length) : 100;
  const uniqueBreeds = [...new Set(livestockScans.map(s => s.identity))];
  const uniqueCrops = [...new Set(cropScans.map(s => s.identity))];
  const totalWater = waterLog.reduce((sum, w) => sum + w.value, 0);

  // Helpers
  const addEntry = (input, nameInput, log, setter, storageKey, type) => {
    if (!input || isNaN(input)) return;
    const entry = {
      value: parseFloat(input),
      [type]: nameInput || 'General',
      date: new Date().toLocaleDateString(),
      label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' })
    };
    const updated = [entry, ...log].slice(0, 30);
    setter(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addMilkEntry = () => { addEntry(milkInput, milkAnimal, milkLog, setMilkLog, STORAGE_KEYS.MILK_YIELD, 'animal'); setMilkInput(''); setMilkAnimal(''); };
  const addCropYieldEntry = () => { addEntry(cropInput, cropName, cropYieldLog, setCropYieldLog, STORAGE_KEYS.CROP_YIELD, 'crop'); setCropInput(''); setCropName(''); };
  const addWeightEntry = () => { addEntry(weightInput, weightAnimal, weightLog, setWeightLog, STORAGE_KEYS.WEIGHT, 'animal'); setWeightInput(''); setWeightAnimal(''); };
  const addGrowthEntry = () => { addEntry(growthInput, growthCrop, growthLog, setGrowthLog, STORAGE_KEYS.GROWTH, 'crop'); setGrowthInput(''); setGrowthCrop(''); };

  const addWaterEntry = () => {
    if (!waterInput || isNaN(waterInput)) return;
    const entry = { value: parseFloat(waterInput), field: waterField || 'General', date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...waterLog].slice(0, 30);
    setWaterLog(updated);
    localStorage.setItem(STORAGE_KEYS.WATER_USAGE, JSON.stringify(updated));
    setWaterInput(''); setWaterField('');
  };

  const addIrrigationEntry = () => {
    if (!irrigationDuration || isNaN(irrigationDuration)) return;
    const entry = { duration: parseFloat(irrigationDuration), method: irrigationMethod, date: new Date().toLocaleDateString(), label: new Date().toLocaleDateString('en', { day: '2-digit', month: 'short' }) };
    const updated = [entry, ...irrigationLog].slice(0, 30);
    setIrrigationLog(updated);
    localStorage.setItem(STORAGE_KEYS.IRRIGATION, JSON.stringify(updated));
    setIrrigationDuration(''); setIrrigationMethod('Drip');
  };

  const clearLog = (key, setter) => {
    localStorage.removeItem(key);
    setter([]);
  };

  // AI Plans
  const getAIPlan = async (type) => {
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) { alert('Please set your Gemini API key in Settings first.'); return; }

    const isLivestock = type === 'feed';
    const isWater = type === 'water';
    if (isLivestock) setLoadingFeed(true);
    else if (isWater) setLoadingWater(true);
    else setLoadingFertilizer(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const userLang = localStorage.getItem('SMART_AG_LANG') || 'English';

      let prompt = '';
      if (isWater) {
        const recentWater = waterLog.slice(0, 7).map(w => `${w.date}: ${w.value}L (${w.field})`).join(', ') || 'No data';
        const recentIrrigation = irrigationLog.slice(0, 7).map(i => `${i.date}: ${i.duration}min (${i.method})`).join(', ') || 'No data';
        const cropList = uniqueCrops.join(', ') || 'General crops';
        const farmType = localStorage.getItem('SMART_AG_FARM_TYPE') || 'Mixed';
        const waterSource = localStorage.getItem('SMART_AG_WATER_SOURCE') || 'Not specified';
        prompt = `You are an expert water management advisor. Based on this farm data:
        - Farm Type: ${farmType}
        - Water Source: ${waterSource}
        - Crops: ${cropList}
        - Recent water usage (last 7 entries): ${recentWater}
        - Recent irrigation log (last 7 entries): ${recentIrrigation}
        - Average crop health: ${avgHealth}%
        
        Provide a structured, optimal water management plan including:
        1. Daily water budget recommendations
        2. Best irrigation method and timing
        3. Water conservation tips
        4. Warning signs to watch for (overwatering/underwatering)
        Format with clear sections. Respond in ${userLang}.`;
      } else if (isLivestock) {
        const breedList = uniqueBreeds.join(', ') || 'General cattle';
        const recentMilk = milkLog.slice(0, 7).map(m => `${m.date}: ${m.value}L (${m.animal})`).join(', ') || 'No data';
        const recentWeight = weightLog.slice(0, 7).map(w => `${w.date}: ${w.value}kg (${w.animal})`).join(', ') || 'No data';
        prompt = `You are an expert veterinary nutritionist. Based on this farm data:
        - Livestock breeds: ${breedList}
        - Recent milk yield (last 7 entries): ${recentMilk}
        - Recent weight log (last 7 entries): ${recentWeight}
        - Average health score: ${avgHealth}%
        
        Provide a structured, practical daily feeding schedule optimized for maximum yield and health. 
        Include specific feed types, quantities, timing, and any supplements. 
        Format with clear sections. Respond in ${userLang}.`;
      } else {
        const cropList = uniqueCrops.join(', ') || 'General crops';
        const recentYield = cropYieldLog.slice(0, 7).map(c => `${c.date}: ${c.value}kg (${c.crop})`).join(', ') || 'No data';
        const recentGrowth = growthLog.slice(0, 7).map(g => `${g.date}: ${g.value}cm (${g.crop})`).join(', ') || 'No data';
        prompt = `You are an expert agronomist. Based on this farm data:
        - Crops: ${cropList}
        - Recent yield (last 7 entries): ${recentYield}
        - Recent growth log (last 7 entries): ${recentGrowth}
        - Average health score: ${avgHealth}%
        
        Provide a structured, practical fertilizer and care schedule optimized for maximum yield and plant health.
        Include specific fertilizer types, quantities, application timing, irrigation tips, and pest prevention.
        Format with clear sections. Respond in ${userLang}.`;
      }

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

      if (isWater) setWaterPlan(responseText);
      else if (isLivestock) setFeedPlan(responseText);
      else setFertilizerPlan(responseText);
    } catch (err) {
      console.error('AI Plan error:', err);
      alert('Failed to generate plan. Check your API key and connection.');
    } finally {
      if (isLivestock) setLoadingFeed(false);
      else if (isWater) setLoadingWater(false);
      else setLoadingFertilizer(false);
    }
  };

  const chartData = (log) => [...log].reverse().slice(-7);

  const inputClass = "flex-1 bg-white dark:bg-charcoal/50 h-12 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-aqua transition-colors";
  const inputSmClass = "w-24 bg-white dark:bg-charcoal/50 h-12 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-aqua transition-colors";

  return (
    <div className="grid-bg min-h-[100dvh] relative overflow-hidden pb-28">
      {/* Floating background water droplets */}
      <div className="absolute top-24 left-[5%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/15 animate-droplet pointer-events-none" />
      <div className="absolute top-48 right-[10%] w-4 h-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-river/10 animate-droplet pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-[8%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/10 animate-droplet pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <header className="mb-6 mt-2 relative z-10">
        <div className="inline-flex items-center gap-2 bg-ocean/5 dark:bg-white/5 border border-ocean/10 dark:border-white/10 rounded-full px-4 py-1.5 mb-3">
          <Droplets className="w-3.5 h-3.5 text-aqua animate-pulse" />
          <span className="font-body text-[10px] uppercase tracking-widest text-ocean/70 dark:text-aqua/80">{t("Kisan Alert Analytics") || "Kisan Alert Analytics"}</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-none tracking-normal text-charcoalDark dark:text-white">
          Predictive <br/>
          <span className="highlight-bar px-2 sm:px-4 text-white uppercase">{t("Analytics") || "Analytics"}</span>
        </h2>
      </header>

      {/* Quick Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 relative z-10">
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-4 text-center border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <p className="font-display tracking-widest text-[8px] sm:text-[10px] uppercase text-charcoalDark/40 dark:text-white/50 mb-1">🐄 {t("Livestock")}</p>
          <p className="font-display text-2xl sm:text-3xl text-ocean dark:text-aqua">{livestockScans.length}</p>
        </div>
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-4 text-center border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <p className="font-display tracking-widest text-[8px] sm:text-[10px] uppercase text-charcoalDark/40 dark:text-white/50 mb-1">🌾 {t("Crops")}</p>
          <p className="font-display text-2xl sm:text-3xl text-ocean dark:text-aqua">{cropScans.length}</p>
        </div>
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-4 text-center border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <p className="font-display tracking-widest text-[8px] sm:text-[10px] uppercase text-aqua/80 mb-1">💧 {t("Total Water") || "Total Water"}</p>
          <p className="font-display text-2xl sm:text-3xl text-aqua">{totalWater}L</p>
        </div>
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-4 text-center border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <p className="font-display tracking-widest text-[8px] sm:text-[10px] uppercase text-alert/80 mb-1">⚠️ {t("Alerts") || "Alerts"}</p>
          <p className="font-display text-2xl sm:text-3xl text-alert">{criticalAlerts}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 relative z-10">
        {[
          { key: 'livestock', label: '🐄 ' + t("Livestock") },
          { key: 'crops', label: '🌾 ' + t("Crops") },
          { key: 'water', label: '💧 ' + t("Water") || "Water" },
        ].map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setActiveTab(tab.key)} 
            className={`flex-1 py-3.5 sm:py-4 rounded-xl font-display text-xs sm:text-sm uppercase tracking-widest transition-all ${
              activeTab === tab.key 
                ? 'water-gradient text-white shadow-md shadow-ocean/20 scale-105' 
                : 'bg-white dark:bg-white/5 text-charcoalDark/60 dark:text-white/60 border border-charcoalDark/10 dark:border-white/10 hover:border-aqua/45 hover:scale-[1.01]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── LIVESTOCK TAB ─── */}
      {activeTab === 'livestock' && (
        <div className="space-y-6 pb-28 relative z-10">
          {uniqueBreeds.length > 0 && (
            <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
              <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest mb-4">Detected Breeds</p>
              <div className="flex flex-wrap gap-2">
                {uniqueBreeds.map((b, i) => (
                  <span key={i} className="bg-ocean text-white dark:bg-aqua dark:text-charcoal font-display text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-lg">{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Milk Yield */}
          <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Milk className="w-4 h-4 text-aqua animate-pulse" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest">Milk Yield (Litres)</p>
              </div>
              {milkLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.MILK_YIELD, setMilkLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={milkAnimal} onChange={e => setMilkAnimal(e.target.value)} placeholder="Animal name" className={inputClass} />
              <input value={milkInput} onChange={e => setMilkInput(e.target.value)} placeholder="Litres" type="number" className={inputSmClass} />
              <button onClick={addMilkEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {milkLog.length > 0 && <MiniBarChart data={chartData(milkLog)} color="#6F8E2E" />}
          </div>

          {/* Weight */}
          <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-harvest" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest">Weight Log (kg)</p>
              </div>
              {weightLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.WEIGHT, setWeightLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={weightAnimal} onChange={e => setWeightAnimal(e.target.value)} placeholder="Animal name" className={inputClass} />
              <input value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="Kg" type="number" className={inputSmClass} />
              <button onClick={addWeightEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {weightLog.length > 0 && <MiniBarChart data={chartData(weightLog)} color="#E5A914" />}
          </div>

          {/* AI Feed Optimizer */}
          <div className="landing-card water-gradient rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-aquaLight animate-pulse" />
                <p className="font-display text-[12px] uppercase tracking-widest text-aquaLight">AI Feed Optimizer</p>
              </div>
              <p className="font-body text-white/70 text-sm mb-6 leading-relaxed">Analyzes your logged data and scanned breeds to generate an optimal daily feeding schedule.</p>
              <button onClick={() => getAIPlan('feed')} disabled={loadingFeed} className="w-full bg-white text-ocean font-display text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl active:scale-[0.98] hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md">
                {loadingFeed ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Feed Plan</>}
              </button>
              {feedPlan && (
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 max-h-[300px] overflow-y-auto custom-scroll">
                  <p className="font-display text-[10px] uppercase tracking-widest text-aquaLight mb-4">Recommended Plan</p>
                  <div className="font-body text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{feedPlan}</div>
                </div>
              )}
            </div>
          </div>

          {/* Livestock Health Trend */}
          {livestockScans.length > 0 && (
            <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-aqua animate-bounce" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest">Livestock Health Trend</p>
              </div>
              <MiniBarChart data={[...livestockScans].reverse().slice(-7).map(s => ({ value: s.healthPercentage || 0, label: s.identity?.slice(0, 6) || '?' }))} maxVal={100} color="#6F8E2E" />
            </div>
          )}
        </div>
      )}

      {/* ─── CROPS TAB ─── */}
      {activeTab === 'crops' && (
        <div className="space-y-6 pb-28 relative z-10">
          {uniqueCrops.length > 0 && (
            <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
              <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest mb-4">Detected Crops</p>
              <div className="flex flex-wrap gap-2">
                {uniqueCrops.map((c, i) => (
                  <span key={i} className="bg-ocean text-white dark:bg-aqua dark:text-charcoal font-display text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2 rounded-lg">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Crop Yield */}
          <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-aqua animate-pulse" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest font-medium">Crop Yield (kg)</p>
              </div>
              {cropYieldLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.CROP_YIELD, setCropYieldLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="Crop type" className={inputClass} />
              <input value={cropInput} onChange={e => setCropInput(e.target.value)} placeholder="Kg" type="number" className={inputSmClass} />
              <button onClick={addCropYieldEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {cropYieldLog.length > 0 && <MiniBarChart data={chartData(cropYieldLog)} color="#6F8E2E" />}
          </div>

          {/* Growth */}
          <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-harvest" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest font-medium">Growth Log (cm)</p>
              </div>
              {growthLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.GROWTH, setGrowthLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={growthCrop} onChange={e => setGrowthCrop(e.target.value)} placeholder="Crop type" className={inputClass} />
              <input value={growthInput} onChange={e => setGrowthInput(e.target.value)} placeholder="cm" type="number" className={inputSmClass} />
              <button onClick={addGrowthEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {growthLog.length > 0 && <MiniBarChart data={chartData(growthLog)} color="#E5A914" />}
          </div>

          {/* AI Optimizer */}
          <div className="landing-card water-gradient rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-aquaLight animate-pulse" />
                <p className="font-display text-[12px] uppercase tracking-widest text-aquaLight">AI Crop Optimizer</p>
              </div>
              <p className="font-body text-white/70 text-sm mb-6 leading-relaxed">Analyzes your crop data, growth logs, and scan results to recommend optimal fertilizer, care, and water guidelines.</p>
              <button onClick={() => getAIPlan('fertilizer')} disabled={loadingFertilizer} className="w-full bg-white text-ocean font-display text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl active:scale-[0.98] hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md">
                {loadingFertilizer ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Care Plan</>}
              </button>
              {fertilizerPlan && (
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 max-h-[300px] overflow-y-auto custom-scroll">
                  <p className="font-display text-[10px] uppercase tracking-widest text-aquaLight mb-4">Recommended Plan</p>
                  <div className="font-body text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{fertilizerPlan}</div>
                </div>
              )}
            </div>
          </div>

          {/* Crop Health Trend */}
          {cropScans.length > 0 && (
            <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-aqua animate-bounce" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest">Crop Health Trend</p>
              </div>
              <MiniBarChart data={[...cropScans].reverse().slice(-7).map(s => ({ value: s.healthPercentage || 0, label: s.identity?.slice(0, 6) || '?' }))} maxVal={100} color="#6F8E2E" />
            </div>
          )}
        </div>
      )}

      {/* ─── WATER TAB ─── */}
      {activeTab === 'water' && (
        <div className="space-y-6 pb-28 relative z-10">
          {/* Water Usage Tracker */}
          <div className="glass-water rounded-xl p-5 sm:p-6 border border-aqua/20 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-aqua animate-pulse" />
                <p className="font-display text-[10px] sm:text-xs text-ocean dark:text-aqua uppercase tracking-widest">Water Usage (Litres)</p>
              </div>
              {waterLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.WATER_USAGE, setWaterLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={waterField} onChange={e => setWaterField(e.target.value)} placeholder="Field / Zone name" className={inputClass} />
              <input value={waterInput} onChange={e => setWaterInput(e.target.value)} placeholder="Litres" type="number" className={inputSmClass} />
              <button onClick={addWaterEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {waterLog.length > 0 && <MiniBarChart data={chartData(waterLog)} color="#E5A914" />}
          </div>

          {/* Irrigation Log */}
          <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-river" />
                <p className="font-display text-[10px] sm:text-xs text-charcoalDark/50 dark:text-white/50 uppercase tracking-widest">Irrigation Log</p>
              </div>
              {irrigationLog.length > 0 && <button onClick={() => clearLog(STORAGE_KEYS.IRRIGATION, setIrrigationLog)} className="text-alert/80 hover:text-alert p-2 rounded-lg hover:bg-alert/10 transition-colors"><Trash2 className="w-4 h-4" /></button>}
            </div>
            <div className="flex gap-2 mt-4">
              <CustomSelect
                value={irrigationMethod}
                onChange={e => setIrrigationMethod(e.target.value)}
                options={['Drip', 'Flood', 'Sprinkler', 'Furrow', 'Manual'].map(m => ({ value: m, label: t(m) || m }))}
                selectClass="h-12"
                className="flex-1"
              />
              <input value={irrigationDuration} onChange={e => setIrrigationDuration(e.target.value)} placeholder="Min" type="number" className={inputSmClass} />
              <button onClick={addIrrigationEntry} className="h-12 w-12 bg-gradient-to-tr from-ocean to-river rounded-lg flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            {irrigationLog.length > 0 && (
              <div className="mt-4 space-y-2">
                {irrigationLog.slice(0, 5).map((entry, i) => (
                  <div key={i} className="flex items-center justify-between bg-white dark:bg-charcoal/30 rounded-lg px-3 py-2 text-xs border border-sage/10 dark:border-white/5">
                    <span className="font-body font-medium text-charcoalDark dark:text-white">{entry.method} — {entry.duration} min</span>
                    <span className="font-body text-sage">{entry.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Water Optimizer */}
          <div className="landing-card water-gradient rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-aquaLight animate-pulse" />
                <p className="font-display text-[12px] uppercase tracking-widest text-aquaLight">💧 AI Water Optimizer</p>
              </div>
              <p className="font-body text-white/70 text-sm mb-6 leading-relaxed">Analyzes your water usage logs, irrigation patterns, and soil conditions to formulate an optimal water-saving irrigation plan.</p>
              <button onClick={() => getAIPlan('water')} disabled={loadingWater} className="w-full bg-white text-ocean font-display text-sm sm:text-base uppercase tracking-widest py-4 rounded-xl active:scale-[0.98] hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md">
                {loadingWater ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : <><Droplets className="w-5 h-5" /> Generate Water Plan</>}
              </button>
              {waterPlan && (
                <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 max-h-[300px] overflow-y-auto custom-scroll">
                  <p className="font-display text-[10px] uppercase tracking-widest text-aquaLight mb-4">💧 Water Management Plan</p>
                  <div className="font-body text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{waterPlan}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
