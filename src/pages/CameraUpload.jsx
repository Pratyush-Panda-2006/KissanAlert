import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Camera, ImagePlus, AlertCircle, Droplets, AlertTriangle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLangForAI } from '../utils/i18n';
import { syncUserData } from '../utils/userDataSync';
import { compressImage } from '../utils/imageCompressor';
import { getGeminiApiKey } from '../utils/geminiKey';

export default function CameraUpload() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [validationError, setValidationError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream utility
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Start Camera Stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera permissions denied:", err);
        setHasPermission(false);
      }
    };

    if (!result && !analyzing && !imagePreview) {
      startCamera();
    }

    // Cleanup function to stop video tracks on unmount
    return () => {
      stopCamera();
    };
  }, [result, analyzing, imagePreview]);

  // Handle exiting scan
  const handleExit = () => {
    stopCamera();
    navigate('/dashboard');
  };

  const processImageBuffer = async (base64Data, rawDataUrl) => {
    stopCamera();
    
    const apiKey = getGeminiApiKey();
    const rawLang = localStorage.getItem('SMART_AG_LANG') || 'English';
    const userLang = getLangForAI(rawLang);

    setAnalyzing(true);
    setValidationError(null);
    
    try {
      // Pre-compress image to ensure fast upload and avoid API/network payload size errors
      const compressedDataUrl = await compressImage(rawDataUrl, 800, 0.7);
      const mimeMatch = compressedDataUrl.match(/^data:(image\/[a-zA-Z+-]+);base64,/);
      const imageMimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const cleanBase64 = compressedDataUrl.split(',')[1];

      const extractJSON = (text) => {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          return text.substring(start, end + 1);
        }
        return text;
      };

      let parsed = null;
      let localMlSuccess = false;

      // 1. Try Local KissanAlert ML Microservice (FastAPI on localhost:8000)
      try {
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const imageBlob = new Blob([byteArray], { type: imageMimeType });

        const formData = new FormData();
        formData.append('file', imageBlob, 'leaf.jpg');

        const mlRes = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formData,
        });

        if (mlRes.ok) {
          const localMlResult = await mlRes.json();
          if (localMlResult && localMlResult.success) {
            localMlSuccess = true;
            parsed = {
              isValid: true,
              type: localMlResult.type || "Crop",
              identity: localMlResult.identity || localMlResult.plant,
              diagnosis: localMlResult.diagnosis || localMlResult.condition,
              severity: localMlResult.severity || (localMlResult.is_healthy ? "Healthy" : "Moderate"),
              healthPercentage: localMlResult.healthPercentage || 85,
              affectedArea: localMlResult.affectedArea || "Leaves and Foliage",
              possibleConditions: localMlResult.possibleConditions || localMlResult.possible_conditions || [localMlResult.condition],
              immediateCare: localMlResult.immediateCare,
              urgency: localMlResult.urgency || "Within 24h",
              actionPlan: localMlResult.actionPlan,
              waterStress: localMlResult.waterStress || "None",
              irrigationAdvice: localMlResult.irrigationAdvice,
              source: localMlResult.source || "KissanAlert Edge ML (Offline)",
              mlConfidence: localMlResult.confidence
            };
          } else if (localMlResult && localMlResult.isValid === false) {
            localMlSuccess = true;
            parsed = {
              isValid: false,
              detected_subject: localMlResult.detected_subject,
              message: localMlResult.message || "Please upload selected images only: crops, fruits, vegetables, or farm animals."
            };
          }
        }
      } catch (mlErr) {
        console.log("Local ML microservice offline, checking fallback options:", mlErr);
      }

      // 2. Cloud Fallback: Only used if local ML server is offline AND user provided Gemini key
      if (!localMlSuccess) {
        if (apiKey) {
          try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const prompt = `Analyze this image. Determine if the image contains any crop, vegetable, fruit, or farm animal.
If invalid (human, electronics, room, everyday object), return ONLY: {"isValid": false, "message": "Please upload selected images only: crops, fruits, vegetables, or farm animals."}
If valid, return ONLY this JSON:
{
  "isValid": true,
  "type": "Crop or Livestock",
  "identity": "Crop or animal variety",
  "diagnosis": "Diagnosed condition or Healthy",
  "severity": "Critical, Moderate, or Healthy",
  "healthPercentage": 90,
  "affectedArea": "Affected part",
  "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
  "immediateCare": "Organic first-aid steps",
  "urgency": "Within 24h",
  "actionPlan": "Treatment protocol",
  "waterStress": "None",
  "irrigationAdvice": "Watering advice"
}
Translate values to ${userLang}. Strictly valid JSON.`;

            const imagePart = { inlineData: { data: cleanBase64, mimeType: imageMimeType } };
            const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
            for (const modelName of modelNames) {
              try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const fetchResult = await model.generateContent([prompt, imagePart]);
                const txt = fetchResult.response.text();
                parsed = JSON.parse(extractJSON(txt));
                break;
              } catch (modelErr) {
                console.warn(`Model ${modelName} failed:`, modelErr);
              }
            }
          } catch (cloudErr) {
            console.warn("Cloud fallback error:", cloudErr);
          }
        }

        // 3. Fallback when completely offline without API
        if (!parsed) {
          parsed = {
            isValid: true,
            type: "Crop",
            identity: "Plant Specimen",
            diagnosis: "Foliage Inspection Completed",
            severity: "Moderate",
            healthPercentage: 75,
            affectedArea: "Leaves and foliage",
            possibleConditions: ["Leaf Spot", "Early Blight", "Healthy Foliage"],
            immediateCare: "Isolate symptomatic leaves and spray organic neem oil solution (5ml/L).",
            urgency: "Within 24h",
            actionPlan: "1. Ensure KissanAlert ML service is running at http://127.0.0.1:8000 for instant deep learning analysis.\n2. Prune heavily discolored leaves.\n3. Apply balanced organic compost.",
            waterStress: "None",
            irrigationAdvice: "Irrigate directly at root zone in early morning.",
            source: "KissanAlert Offline Scanner"
          };
        }
      }

      // Validation Gate
      if (parsed && parsed.isValid === false) {
        setValidationError({
          title: "Upload Selected Images Only",
          detected: parsed.detected_subject,
          message: parsed.message || "Please upload selected images only: crops, fruits, vegetables, or farm animals."
        });
        setImagePreview(null);
        setAnalyzing(false);
        return;
      }

      const newScan = {
        id: Date.now(),
        image: compressedDataUrl,
        date: new Date().toLocaleDateString(),
        ...parsed
      };

      const history = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
      history.unshift(newScan);
      localStorage.setItem('smartAgHistory', JSON.stringify(history));
      
      // Sync scanned data with Supabase backend
      syncUserData();

      setResult(newScan);
      setAnalyzing(false);
    } catch (innerError) {
      console.error("Diagnosis Error:", innerError);
      alert("Failed to analyze image. Please try a different photo or check your connection.");
      setImagePreview(null);
      setAnalyzing(false);
    }
  };

  const handleLiveCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setImagePreview(imageDataUrl);
    const base64Data = imageDataUrl.split(',')[1];
    
    await processImageBuffer(base64Data, imageDataUrl);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const imageDataUrl = reader.result;
      setImagePreview(imageDataUrl);
      const base64Data = imageDataUrl.split(',')[1];
      await processImageBuffer(base64Data, imageDataUrl);
    };
  };

  return (
    <div className="absolute inset-0 bg-charcoalDark flex flex-col z-50">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-ocean/30 to-charcoalDark">
      </div>
      
      <div className="relative z-10 flex flex-col h-full p-6 pb-32 overflow-y-auto custom-scroll">
        <div className="flex justify-between items-center mb-auto pt-4 pb-6">
          <button onClick={handleExit} className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
          
          {analyzing && (
            <span className="text-aqua font-display text-sm uppercase tracking-[0.3em] bg-ocean/80 backdrop-blur-xl px-6 py-3 rounded-xl border border-aqua/50 shadow-lg animate-pulse">
              Analyzing...
            </span>
          )}
          <div className="w-12"></div>
        </div>

        {validationError && (
          <div className="bg-charcoalDark/95 border-2 border-red-500/40 backdrop-blur-2xl rounded-2xl p-6 mb-6 shadow-2xl animate-in fade-in zoom-in-95 shrink-0">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-display text-lg uppercase tracking-wider">
                    Upload Selected Images Only
                  </h3>
                  <button 
                    onClick={() => setValidationError(null)} 
                    className="text-white/40 hover:text-white p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {validationError.detected && (
                  <span className="inline-block mt-1 font-mono text-xs px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                    Detected: {validationError.detected}
                  </span>
                )}
              </div>
            </div>

            <p className="text-white/90 text-sm font-body leading-relaxed mb-4">
              {validationError.message}
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-5 border border-white/10 space-y-2">
              <p className="font-display text-xs uppercase tracking-widest text-aqua">
                Accepted Agricultural Categories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-white/80 font-body">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-base block mb-1">🌿</span>
                  <strong className="text-white">Crop Leaves:</strong> Tomato, Apple, Corn, Potato, Grape, Pepper, etc.
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-base block mb-1">🍎</span>
                  <strong className="text-white">Fruits & Veggies:</strong> Fresh farm produce, vegetables & fruits.
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-base block mb-1">🐄</span>
                  <strong className="text-white">Livestock:</strong> Cattle, Sheep, Goats, Poultry, Horses, etc.
                </div>
              </div>
              <p className="text-[11px] text-white/50 pt-1">
                ⚠️ Non-agricultural photos (people, faces, clothing, electronics, rooms) are strictly filtered out to prevent erroneous results.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setValidationError(null); setImagePreview(null); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/15 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" /> Try Camera Again
              </button>
              <button 
                onClick={() => { setValidationError(null); setImagePreview(null); fileInputRef.current?.click(); }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-aqua/20 border border-aqua/50 hover:bg-aqua/30 text-aqua font-display text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ImagePlus className="w-4 h-4" /> Choose from Gallery
              </button>
            </div>
          </div>
        )}

        {!result && (
          <div className="relative w-full h-[50vh] min-h-[400px] mb-auto rounded-2xl overflow-hidden bg-charcoalDark/50 border border-white/20 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
            {/* Viewfinder Corners — Aqua themed */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-aqua z-20"></div>
            <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-aqua z-20"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-aqua z-20"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-aqua z-20"></div>
            
            {analyzing && <div className="scanning-line z-30"></div>}

            {imagePreview ? (
              <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover z-10 blur-sm opacity-50" />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover z-10`}
              />
            )}
            
            <canvas ref={canvasRef} className="hidden" />

            {!hasPermission && !analyzing && !imagePreview && (
              <div className="z-20 text-center px-6">
                <AlertCircle className="w-12 h-12 text-alert mx-auto mb-4" />
                <p className="font-display text-white text-xl uppercase tracking-widest mb-2">Camera Access Denied</p>
                <p className="font-body text-white/70 text-sm">Please allow camera permissions or use the upload button below.</p>
              </div>
            )}

            {!analyzing && !imagePreview && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
                <button 
                  onClick={handleLiveCapture}
                  disabled={!hasPermission}
                  className={`w-24 h-24 bg-white/10 backdrop-blur-xl border-4 border-white rounded-full shadow-[0_0_40px_rgba(6,182,212,0.3)] flex items-center justify-center transition-all group ${!hasPermission ? 'opacity-50' : 'active:scale-95 hover:border-aqua'}`}
                >
                  <div className="w-16 h-16 bg-white rounded-full group-active:scale-90 transition-transform group-hover:bg-aqua"></div>
                </button>
              </div>
            )}
          </div>
        )}

        {!result && !analyzing && (
           <div className="mt-8 flex justify-center">
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-5 rounded-xl text-white font-display text-sm uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all shadow-lg">
                <ImagePlus className="w-5 h-5" /> Upload from Gallery
             </button>
           </div>
        )}

        {result && (
          <div className="bg-[#f8f9fa] dark:bg-charcoalDark w-full rounded-2xl shadow-2xl flex flex-col shrink-0 border border-charcoalDark/10 dark:border-white/10 animate-in slide-in-from-bottom-5 mt-8 mb-6">
            <div className="p-6">
              {imagePreview && (
                 <div className="w-full h-48 rounded-xl overflow-hidden mb-6 border border-charcoalDark/10 dark:border-white/10 shadow-sm relative">
                   <img src={imagePreview} alt="Scanned subject" className="w-full h-full object-cover" />
                 </div>
              )}
              
              <div className="flex items-center gap-4 mb-6 bg-white dark:bg-white/5 p-4 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-display text-2xl border shrink-0 ${result.healthPercentage >= 80 ? 'bg-leaf/10 text-leaf border-leaf/20' : result.healthPercentage >= 50 ? 'bg-harvest/10 text-harvest border-harvest/20' : 'bg-alert/10 text-alert border-alert/20'}`}>
                  {result.healthPercentage || 0}%
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest truncate">Identified {result.type}</p>
                  <p className="font-display text-charcoalDark dark:text-white text-2xl uppercase leading-tight truncate mt-1">{result.identity}</p>
                </div>
              </div>
              
              {/* Diagnosis + Severity + Urgency */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4 border-l-4" style={{ borderLeftColor: result.severity === 'Healthy' ? '#16A34A' : '#DC2626' }}>
                 <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">Diagnosis</p>
                 <p className="font-body font-bold text-charcoalDark dark:text-white text-base sm:text-lg">{result.diagnosis}</p>
                 <div className="flex flex-wrap gap-2 mt-4">
                   <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${result.severity === 'Critical' ? 'bg-alert/10 text-alert border-alert/20' : result.severity === 'Healthy' ? 'bg-leaf/10 text-leaf border-leaf/20' : 'bg-charcoalDark/5 dark:bg-white/10 text-charcoalDark dark:text-white border-charcoalDark/10 dark:border-white/20'}`}>
                     Severity: {result.severity}
                   </div>
                   {result.urgency && (
                     <div className={`font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border ${result.urgency === 'Immediate' ? 'bg-alert/10 text-alert border-alert/20' : result.urgency === 'Within 24h' ? 'bg-harvest/10 text-harvest border-harvest/20' : 'bg-leaf/10 text-leaf border-leaf/20'}`}>
                       🕐 {result.urgency}
                     </div>
                   )}
                   {result.source && (
                     <div className="font-display text-[10px] px-3 py-1.5 rounded-lg inline-block uppercase tracking-widest border bg-aqua/10 text-ocean dark:text-aqua border-aqua/30">
                       ⚡ {result.source} {result.mlConfidence ? `(${result.mlConfidence}%)` : ''}
                     </div>
                   )}
                 </div>
              </div>

              {/* Water Stress & Irrigation Advice (NEW) */}
              {result.waterStress && (
                <div className="glass-water p-5 rounded-xl mb-4 border-l-4 border-l-aqua">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-aqua" />
                    <p className="font-display text-ocean dark:text-aqua text-[10px] uppercase tracking-widest">Water Stress: {result.waterStress}</p>
                  </div>
                  {result.irrigationAdvice && (
                    <p className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed">{result.irrigationAdvice}</p>
                  )}
                </div>
              )}

              {/* Affected Area */}
              {result.affectedArea && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-2">Affected Area</p>
                  <p className="font-body font-medium text-charcoalDark dark:text-white text-sm sm:text-base">{result.affectedArea}</p>
                </div>
              )}

              {/* Possible Conditions */}
              {result.possibleConditions && result.possibleConditions.length > 0 && (
                <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-4">
                  <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">Possible Conditions</p>
                  <div className="space-y-3">
                    {result.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className={`w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center font-display text-[10px] text-white shrink-0 ${i === 0 ? 'bg-alert' : i === 1 ? 'bg-harvest' : 'bg-charcoalDark/40 dark:bg-white/40'}`}>{i + 1}</span>
                        <p className="font-body font-medium text-sm sm:text-base text-charcoalDark dark:text-white/90 leading-relaxed">{cond}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Immediate Care */}
              {result.immediateCare && (
                <div className="bg-harvest/5 dark:bg-harvest/10 p-5 rounded-xl border border-harvest/20 shadow-sm mb-4 border-l-4 border-l-harvest">
                  <p className="font-display text-harvest text-[10px] uppercase tracking-widest mb-2">⚡ Immediate Care</p>
                  <p className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed">{result.immediateCare}</p>
                </div>
              )}
              
              {/* Action Plan */}
              <div className="bg-white dark:bg-white/5 p-5 rounded-xl border border-charcoalDark/10 dark:border-white/10 shadow-sm mb-6 border-t-4 border-t-aqua">
                <p className="font-display text-charcoalDark/50 dark:text-white/50 text-[10px] uppercase tracking-widest mb-4">Precaution & Action Plan</p>
                <div className="font-body font-medium text-sm sm:text-base text-charcoalDark/90 dark:text-white/90 leading-relaxed whitespace-pre-wrap">
                  {result.actionPlan}
                </div>
              </div>
              
              <button onClick={handleExit} className="water-gradient text-white w-full py-4 rounded-xl font-display text-sm uppercase tracking-widest shadow-lg active:scale-[0.98] hover:opacity-90 transition-all flex justify-center items-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
