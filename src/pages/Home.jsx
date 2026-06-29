import { useState, useEffect } from 'react';
import { TrendingUp, Activity, AlertTriangle, Image as ImageIcon, X, Trash2, Droplets, CloudRain, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getTranslation } from '../utils/i18n';
import ExportShare from '../components/ExportShare';
import { syncUserData } from '../utils/userDataSync';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Farmer');
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('Recent');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('SMART_AG_USER');
    if (!user) {
      navigate('/login');
      return;
    }
    setUsername(user);
    const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    setScans(history);
  }, [navigate]);

  const issuesPicked = scans.filter(s => s.severity && s.severity !== 'Healthy').length;
  const recentInsight = scans.length > 0 ? scans[0].diagnosis : getTranslation("No scans yet");

  // Separate health for crops and livestock
  const cropScans = scans.filter(s => s.type === 'Crop');
  const livestockScans = scans.filter(s => s.type === 'Livestock');

  const cropIssues = cropScans.filter(s => s.severity && s.severity !== 'Healthy').length;
  const livestockIssues = livestockScans.filter(s => s.severity && s.severity !== 'Healthy').length;

  const cropHealthScore = cropScans.length > 0 ? Math.round(((cropScans.length - cropIssues) / cropScans.length) * 100) : 100;
  const livestockHealthScore = livestockScans.length > 0 ? Math.round(((livestockScans.length - livestockIssues) / livestockScans.length) * 100) : 100;

  const getHealthInfo = (score) => {
    if (score < 50) return { status: 'Critical', color: 'text-alert', bg: 'bg-alert/20', border: 'border-alert/20' };
    if (score < 80) return { status: 'Fair', color: 'text-harvest', bg: 'bg-harvest/20', border: 'border-harvest/20' };
    return { status: 'Good', color: 'text-leaf', bg: 'bg-leaf/20', border: 'border-leaf/20' };
  };

  const cropHealth = getHealthInfo(cropHealthScore);
  const livestockHealth = getHealthInfo(livestockHealthScore);

  const getFilteredScans = () => {
    if (filter === 'Crops') return scans.filter(s => s.type === 'Crop');
    if (filter === 'Livestock') return scans.filter(s => s.type === 'Livestock');
    return scans;
  };

  const filteredScans = getFilteredScans();
  const t = getTranslation;

  // Delete a single scan
  const deleteScan = (scanId, e) => {
    e?.stopPropagation();
    const updated = scans.filter(s => s.id !== scanId);
    setScans(updated);
    localStorage.setItem('smartAgHistory', JSON.stringify(updated));
    syncUserData(); // Sync deletion to backend
    if (selectedScan?.id === scanId) setSelectedScan(null);
  };

  // Clear all scans
  const clearAllScans = () => {
    if (!window.confirm(t('Are you sure you want to delete all scans?'))) return;
    setScans([]);
    localStorage.setItem('smartAgHistory', '[]');
    syncUserData(); // Sync deletion to backend
  };

  return (
    <div className="grid-bg min-h-[100dvh] relative overflow-hidden pb-28">
      {/* Floating background water droplets */}
      <div className="absolute top-24 left-[5%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/15 animate-droplet pointer-events-none" />
      <div className="absolute top-48 right-[10%] w-4 h-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-river/10 animate-droplet pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-[8%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/10 animate-droplet pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 pt-4 mb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-sage hover:text-aqua transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <header className="flex flex-col items-start text-left mb-8 mt-2 relative z-10">
        <div className="inline-flex items-center gap-2 bg-ocean/5 dark:bg-white/5 border border-ocean/10 dark:border-white/10 rounded-full px-4 py-1.5 mb-3">
          <Droplets className="w-3.5 h-3.5 text-aqua animate-pulse" />
          <span className="font-body text-[10px] uppercase tracking-widest text-ocean/70 dark:text-aqua/80">{t("Kisan Alert Dashboard") || "Kisan Alert Dashboard"}</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.9] tracking-normal text-charcoalDark dark:text-white">
          Welcome back, <br/>
          <span className="highlight-bar px-2 sm:px-4 text-white uppercase">{username}</span>
        </h1>
      </header>

      {/* Health Cards Bento block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
        {/* Crop Health */}
        <div className="landing-card water-gradient rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-ocean/20">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="font-display text-white/50 text-[10px] sm:text-xs uppercase tracking-widest mb-1.5">🌾 {t("Crop Health")}</p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-normal uppercase leading-[0.9] mb-4 text-white">
                {t(cropHealth.status)}
              </h2>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className={`inline-flex items-center gap-1.5 font-display text-xs tracking-widest px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border ${cropHealth.border}`}>
                <TrendingUp className={`${cropHealth.color} w-4 h-4`} />
                <span className={cropHealth.color}>{cropHealthScore}%</span>
              </div>
              <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{cropScans.length} {t("Scans")}</span>
            </div>
          </div>
        </div>

        {/* Livestock Health */}
        <div className="landing-card water-gradient rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-ocean/20">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="font-display text-white/50 text-[10px] sm:text-xs uppercase tracking-widest mb-1.5">🐄 {t("Livestock Health")}</p>
              <h2 className="font-display text-3xl sm:text-4xl tracking-normal uppercase leading-[0.9] mb-4 text-white">
                {t(livestockHealth.status)}
              </h2>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className={`inline-flex items-center gap-1.5 font-display text-xs tracking-widest px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border ${livestockHealth.border}`}>
                <TrendingUp className={`${livestockHealth.color} w-4 h-4`} />
                <span className={livestockHealth.color}>{livestockHealthScore}%</span>
              </div>
              <span className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{livestockScans.length} {t("Scans")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <Activity className="text-ocean dark:text-aqua w-5 h-5 mb-3" />
          <div>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Total Scans")}</p>
            <p className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl mt-1">{scans.length}</p>
          </div>
        </div>
        <div className="landing-card bg-white dark:bg-white/5 rounded-xl p-5 border border-charcoalDark/10 dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-ocean/[0.03] dark:bg-white/[0.02] rounded-full pointer-events-none" />
          <AlertTriangle className={`${issuesPicked > 0 ? 'text-alert' : 'text-ocean/40 dark:text-aqua/40'} w-5 h-5 mb-3`} />
          <div>
            <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest">{t("Issues Picked")}</p>
            <p className="font-display text-charcoalDark dark:text-white text-3xl sm:text-4xl mt-1">{issuesPicked}</p>
          </div>
        </div>
      </div>

      {/* Water Advisory Quick Card */}
      <div className="glass-water rounded-xl p-4 sm:p-5 mb-4 flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-aqua/10 flex items-center justify-center shrink-0">
          <Droplets className="w-5 h-5 text-aqua" />
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <p className="font-display text-ocean dark:text-aqua text-[10px] uppercase tracking-widest">{t("Water Advisory")}</p>
          <p className="font-body text-charcoalDark/70 dark:text-white/70 text-xs sm:text-sm mt-0.5 truncate">
            {scans.length > 0 ? t("Check Weather tab for smart irrigation advice") : t("Scan your crops to get personalized water advice")}
          </p>
        </div>
        <CloudRain className="w-5 h-5 text-ocean/30 dark:text-aqua/30 shrink-0 animate-pulse" />
      </div>

      {/* Smart Farm Map Card */}
      <div 
        onClick={() => navigate('/map')}
        className="landing-card bg-white dark:bg-white/5 cursor-pointer hover:border-aqua/45 border border-charcoalDark/10 dark:border-white/10 rounded-xl p-4 sm:p-5 mb-4 flex items-center gap-3 relative z-10 shadow-sm"
      >
        <div className="w-10 h-10 rounded-lg bg-ocean/10 dark:bg-white/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-ocean dark:text-white" />
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <p className="font-display text-charcoalDark dark:text-white text-xs uppercase tracking-widest">{t("Smart Farm Map")}</p>
          <p className="font-body text-charcoalDark/70 dark:text-white/70 text-[10px] sm:text-xs mt-0.5 truncate">
            {t("Map your fields, track crops and locate water sources")}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-charcoalDark/30 dark:text-white/30 shrink-0" />
      </div>

      {/* Yield Logs & Planners Card */}
      <div 
        onClick={() => navigate('/analytics')}
        className="landing-card bg-white dark:bg-white/5 cursor-pointer hover:border-aqua/45 border border-charcoalDark/10 dark:border-white/10 rounded-xl p-4 sm:p-5 mb-4 flex items-center gap-3 relative z-10 shadow-sm"
      >
        <div className="w-10 h-10 rounded-lg bg-aqua/10 dark:bg-white/10 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-aqua" />
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <p className="font-display text-charcoalDark dark:text-white text-xs uppercase tracking-widest">{t("Yield Logs & AI Planners") || "Yield Logs & AI Planners"}</p>
          <p className="font-body text-charcoalDark/70 dark:text-white/70 text-[10px] sm:text-xs mt-0.5 truncate">
            {t("Log crop yields, livestock health trends, and optimize water and soil resources") || "Log crop yields, livestock health trends, and optimize water and soil resources"}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-charcoalDark/30 dark:text-white/30 shrink-0" />
      </div>

      {/* Recent AI Insight */}
      <div className="landing-card water-gradient rounded-xl p-5 mb-8 flex justify-between items-center shadow-md text-white relative overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 w-full flex justify-between items-center">
          <div className="overflow-hidden pr-2">
            <p className="font-display text-white/50 text-[10px] uppercase tracking-widest">{t("Recent AI Insight")}</p>
            <p className="font-body text-white font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-[300px] mt-1">{recentInsight}</p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="text-aquaLight w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Categories + Clear All */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="overflow-x-auto flex gap-2 custom-scroll pb-1">
          {['Recent', 'Crops', 'Livestock'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 sm:px-5 py-2 rounded-lg font-display text-xs uppercase tracking-widest whitespace-nowrap shadow-sm transition-all border ${
                filter === cat 
                  ? 'bg-ocean text-white border-ocean dark:bg-aqua dark:text-charcoal dark:border-aqua' 
                  : 'bg-white dark:bg-white/5 text-charcoalDark/60 dark:text-white/60 border-charcoalDark/10 dark:border-white/10 hover:border-aqua/40'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
        {scans.length > 0 && (
          <button onClick={clearAllScans} className="text-alert/80 hover:text-alert font-display text-[10px] uppercase tracking-widest whitespace-nowrap ml-2 px-3 py-2 rounded-lg bg-alert/5 border border-alert/10 transition-colors flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> {t("Clear All")}
          </button>
        )}
      </div>

      {/* Recent Scans List */}
      <h3 className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-3 sm:mb-4 relative z-10">{t("Recent Scans")}</h3>

      <div className="space-y-3 relative z-10">
        {filteredScans.length === 0 ? (
          <div className="text-center py-10 opacity-50 border border-dashed border-ocean/20 dark:border-aqua/20 rounded-xl bg-white/20 dark:bg-white/5">
            <p className="font-display text-charcoalDark dark:text-white text-xs uppercase tracking-widest">{t("No scans found.")}</p>
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div key={scan.id} className="landing-card w-full bg-white dark:bg-white/5 p-3 sm:p-4 rounded-xl flex items-center justify-between border border-charcoalDark/10 dark:border-white/10 shadow-sm text-left hover:border-aqua/30 transition-all">
              <button onClick={() => setSelectedScan(scan)} className="flex items-center gap-3 sm:gap-4 overflow-hidden flex-1 min-w-0 active:scale-[0.98] transition-all">
                {scan.image ? (
                  <img src={scan.image} alt={scan.identity} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover bg-charcoalDark/5 border border-charcoalDark/10 shrink-0" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-charcoalDark/5 rounded-lg flex items-center justify-center text-charcoalDark/40 shrink-0 border border-charcoalDark/10"><ImageIcon className="w-5 h-5"/></div>
                )}
                <div className="overflow-hidden pr-2 min-w-0 text-left">
                  <p className="font-display text-charcoalDark dark:text-white text-base sm:text-lg uppercase leading-tight truncate">{scan.identity}</p>
                  <p className="font-body font-medium text-charcoalDark/50 dark:text-white/50 text-xs sm:text-sm mt-0.5 truncate">{scan.type || 'Unknown'} &bull; {scan.date}</p>
                </div>
              </button>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className={`font-display text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${scan.severity === 'Healthy' ? 'bg-leaf/10 text-leaf border-leaf/20' : 'bg-alert/10 text-alert border-alert/20'}`}>
                  {scan.severity}
                </span>
                <button onClick={(e) => deleteScan(scan.id, e)} className="w-8 h-8 rounded-lg flex items-center justify-center text-charcoalDark/30 hover:text-alert hover:bg-alert/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Scan Details Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-charcoalDark/80 backdrop-blur-sm p-0 sm:p-6">
          <div className="bg-[#f8f9fa] dark:bg-charcoalDark w-full max-w-lg h-[95dvh] sm:h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-t sm:border border-charcoalDark/20 dark:border-white/10 animate-in slide-in-from-bottom-5">
            {/* Fixed header */}
            <div className="p-5 flex justify-between items-center bg-white dark:bg-white/5 border-b border-charcoalDark/10 dark:border-white/10 shrink-0">
               <h3 className="font-display text-charcoalDark dark:text-white text-xl uppercase tracking-widest">{t("Scan Details")}</h3>
               <div className="flex items-center gap-3">
                 <button onClick={(e) => deleteScan(selectedScan.id, e)} className="w-10 h-10 rounded-xl bg-alert/10 flex items-center justify-center text-alert hover:bg-alert/20 transition-colors">
                   <Trash2 className="w-5 h-5" />
                 </button>
                 <button onClick={() => setSelectedScan(null)} className="w-10 h-10 rounded-xl bg-charcoalDark/5 dark:bg-white/10 flex items-center justify-center text-charcoalDark dark:text-white hover:bg-charcoalDark/10 dark:hover:bg-white/20 transition-colors">
                   <X className="w-6 h-6" />
                 </button>
               </div>
            </div>
            
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-5 sm:p-6 space-y-5">
              {selectedScan.image && (
                 <div className="w-full h-56 rounded-xl overflow-hidden border border-charcoalDark/10 dark:border-white/10 shadow-sm relative">
                   <img src={selectedScan.image} alt="Scanned subject" className="w-full h-full object-cover" />
                   <div className="absolute bottom-3 right-3 bg-white dark:bg-charcoalDark font-display text-xs px-3 py-1.5 rounded-lg shadow-md text-charcoalDark dark:text-white uppercase tracking-widest">
                     {selectedScan.date}
                   </div>
                 </div>
              )}
              
              <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display text-2xl border shrink-0 ${selectedScan.healthPercentage >= 80 ? 'bg-leaf/10 text-leaf border-leaf/20' : selectedScan.healthPercentage >= 50 ? 'bg-harvest/10 text-harvest border-harvest/20' : 'bg-alert/10 text-alert border-alert/20'}`}>
                  {selectedScan.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest truncate">{t("Identified")} {t(selectedScan.type)}</p>
                  <p className="font-display text-charcoalDark dark:text-white text-2xl uppercase leading-tight truncate mt-1">{selectedScan.identity}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm border-l-4" style={{ borderLeftColor: selectedScan.severity === 'Healthy' ? '#16A34A' : '#DC2626' }}>
                 <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">{t("Diagnosis")}</p>
                 <p className="font-body font-bold text-charcoalDark dark:text-white text-base sm:text-lg">{selectedScan.diagnosis}</p>
                 <div className="flex flex-wrap gap-2 mt-4">
                   <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${selectedScan.severity === 'Critical' ? 'bg-alert/10 text-alert border-alert/20' : selectedScan.severity === 'Healthy' ? 'bg-leaf/10 text-leaf border-leaf/20' : 'bg-charcoalDark/5 dark:bg-white/10 text-charcoalDark dark:text-white border-charcoalDark/10 dark:border-white/20'}`}>
                     {t("Severity")}: {selectedScan.severity}
                   </div>
                   {selectedScan.urgency && (
                     <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${selectedScan.urgency === 'Immediate' ? 'bg-alert/10 text-alert border-alert/20' : selectedScan.urgency === 'Within 24h' ? 'bg-harvest/10 text-harvest border-harvest/20' : 'bg-leaf/10 text-leaf border-leaf/20'}`}>
                       🕐 {selectedScan.urgency}
                     </div>
                   )}
                 </div>
              </div>

              {/* Water Stress indicator (new) */}
              {selectedScan.waterStress && (
                <div className="glass-water p-5 rounded-xl">
                  <p className="font-display text-ocean dark:text-aqua text-[10px] uppercase tracking-widest mb-2">💧 {t("Water Stress")}</p>
                  <p className="font-body font-bold text-charcoalDark dark:text-white text-base">{selectedScan.waterStress}</p>
                  {selectedScan.irrigationAdvice && (
                    <p className="font-body font-medium text-charcoalDark/70 dark:text-white/70 text-sm mt-2 leading-relaxed">{selectedScan.irrigationAdvice}</p>
                  )}
                </div>
              )}

              {selectedScan.affectedArea && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">{t("Affected Area")}</p>
                  <p className="font-body font-medium text-charcoalDark dark:text-white text-sm sm:text-base">{selectedScan.affectedArea}</p>
                </div>
              )}

              {selectedScan.possibleConditions && selectedScan.possibleConditions.length > 0 && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">{t("Possible Conditions")}</p>
                  <div className="space-y-3">
                    {selectedScan.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center font-display text-[10px] text-white shrink-0 ${i === 0 ? 'bg-alert' : i === 1 ? 'bg-harvest' : 'bg-charcoalDark/40 dark:bg-white/40'}`}>{i + 1}</span>
                        <p className="font-body font-medium text-sm sm:text-base text-charcoalDark dark:text-white/90 leading-relaxed">{cond}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedScan.immediateCare && (
                <div className="bg-harvest/5 dark:bg-harvest/10 p-5 rounded-xl border border-harvest/20 shadow-sm border-l-4 border-l-harvest">
                  <p className="font-display text-harvest text-[10px] uppercase tracking-widest mb-2">⚡ {t("Immediate Care")}</p>
                  <p className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed">{selectedScan.immediateCare}</p>
                </div>
              )}
              
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm border-t-4 border-t-aqua">
                <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">{t("Precaution & Action Plan")}</p>
                <div className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap">
                  {selectedScan.actionPlan}
                </div>
              </div>

              {/* Export & Share Buttons */}
              <div className="pt-2">
                <ExportShare scan={selectedScan} />
              </div>

              {/* Bottom safe area spacer for mobile */}
              <div className="h-4 sm:h-2"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
