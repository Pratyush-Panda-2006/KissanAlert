/**
 * Utility helper to retrieve the Gemini API key.
 * Priority:
 * 1. User's personal API key stored in localStorage (from Profile / Settings)
 * 2. Default project fallback key configured in environment variables (VITE_GEMINI_API_KEY)
 */

export function getGeminiApiKey() {
  const userKey = localStorage.getItem('GEMINI_API_KEY');
  if (userKey && userKey.trim().length > 0) {
    return userKey.trim();
  }

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 0) {
    return envKey.trim();
  }

  return '';
}

export function hasCustomGeminiApiKey() {
  const userKey = localStorage.getItem('GEMINI_API_KEY');
  return !!(userKey && userKey.trim().length > 0);
}

export function hasDefaultGeminiApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return !!(envKey && envKey.trim().length > 0);
}

export function hasAnyGeminiApiKey() {
  return !!getGeminiApiKey();
}
