import { useState, useEffect } from 'react';
import { Key, Save, CheckCircle2, Languages, Moon, Sun, User2, Droplets, Trash2 } from 'lucide-react';
import { getTranslation, LANGUAGES } from '../utils/i18n';
import { useTheme } from '../utils/ThemeContext';
import CustomSelect from '../components/CustomSelect';
import { clearUserData, syncUserData } from '../utils/userDataSync';

export default function Profile() {
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('English');
  const [farmType, setFarmType] = useState('Irrigated');
  const [waterSource, setWaterSource] = useState('Well');
  const [saved, setSaved] = useState(false);
  const [showError, setShowError] = useState(false);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('SMART_AG_USER');
    if (storedUser) setUsername(storedUser);

    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) setApiKey(storedKey);
    
    const storedLang = localStorage.getItem('SMART_AG_LANG');
    if (storedLang) setLanguage(storedLang);

    const storedFarmType = localStorage.getItem('SMART_AG_FARM_TYPE');
    if (storedFarmType) setFarmType(storedFarmType);

    const storedWaterSource = localStorage.getItem('SMART_AG_WATER_SOURCE');
    if (storedWaterSource) setWaterSource(storedWaterSource);

    if (localStorage.getItem('GEMINI_KEY_ERROR') === 'true') {
      setShowError(true);
    }
  }, []);

  const handleSave = async () => {
    localStorage.setItem('SMART_AG_USER', username);
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    localStorage.setItem('SMART_AG_FARM_TYPE', farmType);
    localStorage.setItem('SMART_AG_WATER_SOURCE', waterSource);
    localStorage.removeItem('GEMINI_KEY_ERROR');
    setShowError(false);
    
    const currentLang = localStorage.getItem('SMART_AG_LANG');
    let langChanged = false;
    if (currentLang !== language) {
      localStorage.setItem('SMART_AG_LANG', language);
      langChanged = true;
    }
    
    // Sync data to Supabase (async, background sync)
    await syncUserData();

    setSaved(true);
    
    if (langChanged) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleResetData = () => {
    if (!window.confirm(t("Are you sure you want to reset all app data and settings? This will delete all your local scans, logs, and settings."))) return;
    clearUserData();
    window.location.href = '/';
  };

  const t = getTranslation;

  return (
    <>
      <header className="mb-6 mt-2">
        <h2 className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl uppercase leading-none">{t("Settings")}</h2>
        <p className="font-display tracking-widest uppercase text-charcoalDark/50 dark:text-white/50 text-[10px] sm:text-xs mt-2">{t("Configure your app preferences")}</p>
      </header>

      <div className="bg-[#f8f9fa] dark:bg-white/5 rounded-xl p-5 sm:p-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-6">
        
        {/* Personal Info Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-charcoalDark dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-charcoalDark shrink-0">
            <User2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Personal Info")}</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Update your details")}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Name" 
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-charcoalDark dark:focus:border-white transition-colors"
          />
        </div>

        {/* Farm & Irrigation Profile Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-aqua rounded-lg flex items-center justify-center text-white shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Farm & Irrigation Profile")}</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Water and crop setup")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <CustomSelect 
              value={farmType}
              onChange={(e) => setFarmType(e.target.value)}
              label={t("Farm Type")}
              options={[
                { value: 'Irrigated', label: t("Irrigated") || "Irrigated" },
                { value: 'Rainfed', label: t("Rainfed") || "Rainfed" },
                { value: 'Mixed', label: t("Mixed") || "Mixed" }
              ]}
            />
          </div>

          <div>
            <CustomSelect 
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              label={t("Primary Water Source")}
              options={[
                { value: 'Well', label: t("Well") || "Well" },
                { value: 'Canal', label: t("Canal") || "Canal" },
                { value: 'River', label: t("River") || "River" },
                { value: 'Borewell', label: t("Borewell") || "Borewell" },
                { value: 'Rainfed', label: t("Rainfed") || "Rainfed" }
              ]}
            />
          </div>
        </div>

        {/* API Key Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-charcoalDark rounded-lg flex items-center justify-center text-white shrink-0 animate-pulse-slow">
            <Key className="w-5 h-5 text-aqua" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">Gemini API Key</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">From Google AI Studio</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..." 
            className="w-full bg-white dark:bg-charcoalDark h-14 rounded-lg px-4 font-body text-sm font-medium text-charcoalDark dark:text-white placeholder-charcoalDark/30 outline-none border border-charcoalDark/20 dark:border-white/10 focus:border-aqua transition-colors"
          />
          {showError && (
            <p className="font-body text-[10px] sm:text-xs text-coralRed font-medium leading-relaxed bg-coralRed/5 p-3 rounded-lg border border-coralRed/20 animate-bounce">
              * Note: Do NOT use your Firebase App config API key here. It will result in a 404 error. Please generate a dedicated Gemini API key at aistudio.google.com
            </p>
          )}
        </div>

        {/* Language Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-aqua/10 dark:bg-aqua/20 rounded-lg flex items-center justify-center text-aqua shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Primary Language")}</h3>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">App & AI Translations</p>
          </div>
        </div>

        <div className="space-y-3 mb-8 relative">
          <CustomSelect 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
          />
        </div>

        {/* Dark Mode Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors shrink-0 ${dark ? 'bg-amber-500 text-white animate-pulse-slow' : 'bg-charcoalDark text-white'}`}>
              {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display text-charcoalDark dark:text-white text-sm sm:text-base uppercase tracking-wider">{t("Dark Mode")}</h3>
              <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Toggle dark/light theme")}</p>
            </div>
          </div>
          <button 
            onClick={toggle}
            className={`w-14 h-8 sm:w-16 sm:h-9 rounded-full flex items-center transition-all duration-300 px-1 border border-charcoalDark/20 dark:border-white/20 ${dark ? 'bg-charcoalDark justify-end' : 'bg-white justify-start'}`}
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md transition-transform ${dark ? 'bg-aqua' : 'bg-charcoalDark'}`} />
          </button>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full h-14 bg-gradient-to-r from-ocean to-river text-white rounded-xl font-display text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(12,74,110,0.39)] hover:shadow-[0_6px_20px_rgba(12,74,110,0.23)] border border-transparent dark:border-white/10 active:scale-[0.98] transition-all"
        >
           {saved ? <><CheckCircle2 className="w-5 h-5 text-aqua" /> {t("Saved!")}</> : <><Save className="w-5 h-5 opacity-70" /> {t("Save Preferences")}</>}
        </button>

        {/* Reset App Data Button */}
        <div className="border-t border-charcoalDark/10 dark:border-white/10 mt-6 pt-6">
          <button 
            onClick={handleResetData}
            className="w-full h-14 bg-transparent border border-coralRed/30 hover:bg-coralRed/5 hover:border-coralRed/60 text-coralRed rounded-xl font-display text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Trash2 className="w-5 h-5 opacity-70" /> {t("Reset App Data") || "Reset App Data"}
          </button>
        </div>
      </div>
    </>
  );
}
