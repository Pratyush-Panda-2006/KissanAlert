import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Plus, Trash2, Loader2, MapPin, Leaf, AlertTriangle, Droplets, ChevronRight } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getTranslation } from '../utils/i18n';
import CustomSelect from '../components/CustomSelect';
import { syncUserData } from '../utils/userDataSync';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const healthyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const issueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const pendingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function AddFieldMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

export default function FarmMap() {
  const t = getTranslation;
  const [fields, setFields] = useState(() => {
    const saved = localStorage.getItem('farmbuddy_fields');
    return saved ? JSON.parse(saved) : [];
  });
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center
  const [loading, setLoading] = useState(true);
  const [addingField, setAddingField] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldCrop, setFieldCrop] = useState('');
  const [markerType, setMarkerType] = useState('field'); // 'field' or 'water_source'
  const [waterSourceType, setWaterSourceType] = useState('Well'); // 'Well', 'Canal', 'River', 'Borewell', 'Pond', 'Other'

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setLoading(false);
      },
      () => setLoading(false),
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('farmbuddy_fields', JSON.stringify(fields));
    syncUserData(); // Sync map data to backend
  }, [fields]);

  const handleMapClick = (latlng) => {
    if (addingField) {
      setPendingLatLng(latlng);
    }
  };

  // Haversine formula to calculate distance in meters
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radius of Earth in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getClosestWaterSource = (field) => {
    const waterSources = fields.filter(f => f.isWaterSource);
    if (waterSources.length === 0) return null;
    let closest = null;
    let minDistance = Infinity;
    waterSources.forEach(ws => {
      const d = getDistance(field.lat, field.lng, ws.lat, ws.lng);
      if (d < minDistance) {
        minDistance = d;
        closest = { name: ws.name, type: ws.waterSourceType, distance: d };
      }
    });
    return closest;
  };

  const confirmField = () => {
    if (!fieldName.trim() || !pendingLatLng) return;
    const isWater = markerType === 'water_source';
    const newField = {
      id: Date.now(),
      name: fieldName.trim(),
      crop: isWater ? 'Water Source' : (fieldCrop.trim() || 'Not specified'),
      lat: pendingLatLng.lat,
      lng: pendingLatLng.lng,
      status: isWater ? 'water' : 'healthy',
      isWaterSource: isWater,
      waterSourceType: isWater ? waterSourceType : null,
      createdAt: new Date().toLocaleDateString(),
    };

    if (!isWater) {
      // Check scan history for health status
      const scans = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      const relatedScan = scans.find(s =>
        s.identity?.toLowerCase().includes(fieldCrop.toLowerCase()) ||
        fieldCrop.toLowerCase().includes(s.identity?.toLowerCase() || '')
      );
      if (relatedScan && relatedScan.severity !== 'Healthy') {
        newField.status = 'issue';
        newField.lastDiagnosis = relatedScan.diagnosis;
      }
    }

    setFields(prev => [...prev, newField]);
    setFieldName('');
    setFieldCrop('');
    setMarkerType('field');
    setWaterSourceType('Well');
    setPendingLatLng(null);
    setAddingField(false);
  };

  const deleteField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const getFieldIcon = (field) => {
    if (field.isWaterSource) return defaultIcon; // blue
    if (field.status === 'issue') return issueIcon; // red
    return healthyIcon; // green
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-10 h-10 text-aqua animate-spin mb-4" />
      <p className="text-sage font-bold text-sm">{t("Loading map...")}</p>
    </div>
  );

  return (
    <>
      <header className="mb-4 mt-2 flex justify-between items-start">
        <div>
          <h2 className="text-charcoal dark:text-white font-black text-2xl tracking-tighter">{t("Smart Farm Map") || "Smart Farm Map"}</h2>
          <p className="text-sage font-semibold text-xs mt-1">{fields.length} {t("markers active") || "markers active"}</p>
        </div>
        <button
          onClick={() => { setAddingField(!addingField); setPendingLatLng(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
            addingField ? 'bg-coralRed text-white shadow-lg shadow-coralRed/20' : 'bg-gradient-to-r from-ocean to-river text-white shadow-lg shadow-ocean/20'
          }`}
        >
          {addingField ? '✕ Cancel' : <><Plus className="w-4 h-4" /> Add Marker</>}
        </button>
      </header>

      {addingField && (
        <div className="bg-aqua/10 border border-aqua/20 rounded-xl p-3 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-aqua shrink-0 animate-bounce" />
          <p className="text-aqua text-xs font-bold">Tap on the map to place your marker</p>
        </div>
      )}

      {/* Map */}
      <div className="rounded-[20px] overflow-hidden border border-sage/20 dark:border-white/10 shadow-xl mb-4" style={{ height: '45vh' }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {addingField && <AddFieldMarker onAdd={handleMapClick} />}
          {fields.map(field => {
            const closestWS = !field.isWaterSource ? getClosestWaterSource(field) : null;
            return (
              <Marker key={field.id} position={[field.lat, field.lng]} icon={getFieldIcon(field)}>
                <Popup>
                  <div className="text-center min-w-[150px] p-1 font-body text-charcoal">
                    <p className="font-black text-sm">{field.name}</p>
                    {field.isWaterSource ? (
                      <p className="text-blue-600 text-[10px] font-extrabold uppercase mt-0.5">💧 {t("Water Source")} ({t(field.waterSourceType)})</p>
                    ) : (
                      <>
                        <p className="text-sage text-[10px] font-bold uppercase mt-0.5">🌾 {field.crop}</p>
                        {field.lastDiagnosis && (
                          <p className="text-coralRed text-[10px] font-bold mt-1">⚠️ {field.lastDiagnosis}</p>
                        )}
                        {closestWS && (
                          <div className="border-t border-sage/20 mt-2 pt-1">
                            <p className="text-[9px] font-semibold text-ocean">
                              💧 {t("Nearest Water")}:
                            </p>
                            <p className="text-[10px] font-bold text-ocean">
                              {closestWS.name} ({Math.round(closestWS.distance)}m)
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          {pendingLatLng && (
            <Marker position={[pendingLatLng.lat, pendingLatLng.lng]} icon={pendingIcon}>
              <Popup>New marker location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Add Marker Form */}
      {pendingLatLng && (
        <div className="bg-white dark:bg-charcoal/80 rounded-[20px] p-5 border border-sage/10 dark:border-white/10 shadow-sm mb-4 animate-in slide-in-from-bottom">
          <p className="text-[10px] text-sage font-bold uppercase tracking-widest mb-3">Add Location Marker</p>
          
          {/* Selector for Marker Type */}
          <div className="grid grid-cols-2 gap-2 mb-4 bg-offWhite dark:bg-white/5 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setMarkerType('field')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${markerType === 'field' ? 'bg-white dark:bg-charcoal text-charcoal dark:text-white shadow-sm' : 'text-sage'}`}
            >
              🌾 {t("Field")}
            </button>
            <button 
              type="button"
              onClick={() => setMarkerType('water_source')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${markerType === 'water_source' ? 'bg-white dark:bg-charcoal text-charcoal dark:text-white shadow-sm' : 'text-sage'}`}
            >
              💧 {t("Water Source")}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input 
              value={fieldName} 
              onChange={e => setFieldName(e.target.value)} 
              placeholder={markerType === 'water_source' ? "Source name (e.g. Well A)" : "Field name (e.g. Wheat Field)"} 
              className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-aqua transition-colors" 
            />
            {markerType === 'field' ? (
              <input 
                value={fieldCrop} 
                onChange={e => setFieldCrop(e.target.value)} 
                placeholder="Crop type (e.g. Rice)" 
                className="flex-1 bg-offWhite dark:bg-white/10 h-10 rounded-xl px-3 text-xs font-bold text-charcoal dark:text-white placeholder-sage/50 outline-none border border-sage/20 dark:border-white/10 focus:border-aqua transition-colors" 
              />
            ) : (
              <CustomSelect 
                value={waterSourceType} 
                onChange={e => setWaterSourceType(e.target.value)} 
                options={['Well', 'Canal', 'River', 'Borewell', 'Pond', 'Other'].map(m => ({ value: m, label: t(m) || m }))}
                selectClass="h-10 text-xs rounded-xl bg-offWhite dark:bg-white/10"
                className="flex-1"
              />
            )}
          </div>
          <button 
            onClick={confirmField} 
            disabled={!fieldName.trim()} 
            className="w-full h-10 bg-aqua hover:bg-aquaLight text-white text-xs font-bold uppercase tracking-widest active:scale-95 transition-all rounded-xl disabled:opacity-40"
          >
            Save Marker
          </button>
        </div>
      )}

      {/* Field & Water Source List */}
      <h3 className="text-charcoal dark:text-white font-extrabold text-xs uppercase tracking-wider mb-3">{t("Your Fields & Water Sources") || "Your Fields & Water Sources"}</h3>
      <div className="space-y-2 pb-28">
        {fields.length === 0 ? (
          <div className="text-center py-8 opacity-50">
            <MapPin className="w-8 h-8 text-sage mx-auto mb-2" />
            <p className="text-sage font-bold text-sm">No fields or water sources mapped yet</p>
            <p className="text-sage text-xs">Tap "Add Marker" and click on the map to start</p>
          </div>
        ) : (
          fields.map(field => {
            const closestWS = !field.isWaterSource ? getClosestWaterSource(field) : null;
            return (
              <div key={field.id} className="bg-white dark:bg-charcoal/60 p-3 rounded-[16px] flex items-center justify-between border border-sage/10 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    field.isWaterSource 
                      ? 'bg-blue-50 text-blue-500 dark:bg-blue-950/40 dark:text-blue-400' 
                      : field.status === 'issue' 
                        ? 'bg-coralRed/10 text-coralRed' 
                        : 'bg-leaf/10 text-leaf'
                  }`}>
                    {field.isWaterSource ? <Droplets className="w-5 h-5" /> : field.status === 'issue' ? <AlertTriangle className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-charcoal dark:text-white font-bold text-sm truncate">{field.name}</p>
                      {field.isWaterSource && (
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                          {t("Water")}
                        </span>
                      )}
                    </div>
                    <p className="text-sage text-[9px] font-bold uppercase tracking-tight truncate">
                      {field.isWaterSource ? `${t(field.waterSourceType)}` : `${field.crop}`} &bull; {field.createdAt}
                    </p>
                    {closestWS && (
                      <p className="text-ocean dark:text-aqua text-[9px] font-bold flex items-center gap-1 mt-0.5">
                        <span>💧</span>
                        <span className="truncate">
                          {t("Nearest Water")}: {closestWS.name} ({Math.round(closestWS.distance)}m)
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteField(field.id)} className="text-coralRed p-2 rounded-lg hover:bg-coralRed/10 transition-colors shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
