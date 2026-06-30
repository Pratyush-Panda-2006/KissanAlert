import { supabase } from './supabaseClient';
import { auth } from './firebase';
import { compressImage } from './imageCompressor';

/**
 * Syncs the local storage data to the Supabase database.
 * If the user_data table does not exist or has RLS issues, it will fail gracefully.
 */
export async function syncUserData() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const localHistory = JSON.parse(localStorage.getItem('smartAgHistory') || '[]');
    
    // Compress large base64 scan images on the fly if needed to prevent payload size errors
    let historyChanged = false;
    const compressedHistory = await Promise.all(
      localHistory.map(async (scan) => {
        if (scan.image && typeof scan.image === 'string' && scan.image.startsWith('data:') && scan.image.length > 50 * 1024) {
          const compressed = await compressImage(scan.image, 600, 0.6);
          if (compressed !== scan.image) {
            historyChanged = true;
            return { ...scan, image: compressed };
          }
        }
        return scan;
      })
    );

    if (historyChanged) {
      localStorage.setItem('smartAgHistory', JSON.stringify(compressedHistory));
    }

    const payload = {
      user_id: userId,
      data: {
        username: localStorage.getItem('SMART_AG_USER') || '',
        gemini_api_key: localStorage.getItem('GEMINI_API_KEY') || '',
        farm_type: localStorage.getItem('SMART_AG_FARM_TYPE') || '',
        water_source: localStorage.getItem('SMART_AG_WATER_SOURCE') || '',
        lang: localStorage.getItem('SMART_AG_LANG') || '',
        history: compressedHistory,
        fields: JSON.parse(localStorage.getItem('farmbuddy_fields') || '[]'),
      },
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_data')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn('[Sync Warning] Could not sync data to Supabase database. This is normal if the "user_data" table has not been created yet in the Supabase Dashboard, or if RLS rules are active without an insert policy. Local data is still saved on this device. Error:', error.message);
    } else {
      console.log('[Sync Success] User data successfully synced to Supabase.');
    }
  } catch (err) {
    console.error('[Sync Error] Error in syncUserData:', err);
  }
}

/**
 * Fetches the user data from Supabase and restores it to localStorage.
 * Dispatches an event to notify pages to update their state.
 */
export async function fetchAndRestoreUserData(userId) {
  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('data')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[Sync Warning] Could not fetch data from Supabase database. Using local device data instead. Error:', error.message);
      return;
    }

    if (data && data.data) {
      const d = data.data;
      if (d.username) localStorage.setItem('SMART_AG_USER', d.username);
      if (d.gemini_api_key) localStorage.setItem('GEMINI_API_KEY', d.gemini_api_key);
      if (d.farm_type) localStorage.setItem('SMART_AG_FARM_TYPE', d.farm_type);
      if (d.water_source) localStorage.setItem('SMART_AG_WATER_SOURCE', d.water_source);
      if (d.lang) localStorage.setItem('SMART_AG_LANG', d.lang);
      if (d.history) localStorage.setItem('smartAgHistory', JSON.stringify(d.history));
      if (d.fields) localStorage.setItem('farmbuddy_fields', JSON.stringify(d.fields));
      
      // Dispatch an event to update state in the application pages
      window.dispatchEvent(new Event('kisanalert_translation_updated'));
      window.dispatchEvent(new Event('kisanalert_data_synced'));
      console.log('[Sync Success] User data successfully restored from Supabase.');
    }
  } catch (err) {
    console.error('[Sync Error] Error in fetchAndRestoreUserData:', err);
  }
}

/**
 * Clears user details and states from local storage upon logout.
 */
export function clearUserData() {
  localStorage.removeItem('SMART_AG_USER');
  localStorage.removeItem('GEMINI_API_KEY');
  localStorage.removeItem('SMART_AG_FARM_TYPE');
  localStorage.removeItem('SMART_AG_WATER_SOURCE');
  localStorage.removeItem('SMART_AG_LANG');
  localStorage.removeItem('smartAgHistory');
  localStorage.removeItem('farmbuddy_fields');
  localStorage.removeItem('kisanalert_cached_weather');
  localStorage.removeItem('kisanalert_cached_weather_city');
  localStorage.removeItem('kisanalert_cached_weather_time');
}
