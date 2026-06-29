import { Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="grid-bg min-h-screen py-10 px-6 sm:px-10 max-w-4xl mx-auto text-charcoalDark dark:text-white">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-sage hover:text-aqua transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 sm:p-10 border border-charcoalDark/10 dark:border-white/10 shadow-xl space-y-8">
        <div className="flex items-center gap-3 border-b border-charcoalDark/15 dark:border-white/15 pb-6">
          <div className="w-12 h-12 bg-aqua/10 dark:bg-aqua/20 rounded-xl flex items-center justify-center text-aqua shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none">Privacy Policy</h1>
            <p className="font-display text-[10px] sm:text-xs uppercase tracking-widest text-sage mt-1">Effective Date: June 29, 2026</p>
          </div>
        </div>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">1. Information We Collect</h2>
          <p>
            Kissan Alert prioritizes user privacy. We do not run any tracking telemetry or collect your personal data on remote servers. All your details—including farm type, water sources, scan histories, username, and Gemini API keys—are stored locally on your device using Web Storage API (localStorage).
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">2. Camera & Image Data</h2>
          <p>
            When utilizing the Crop Scanner, you upload images of plants or cattle. These files are processed directly on your browser and sent securely to Google Gemini APIs only if you initiate AI scans. We do not save your pictures on any Kissan Alert databases.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">3. Hyperlocal Weather Location</h2>
          <p>
            When requesting weather forecasts, Kissan Alert fetches your geographic coordinates using your browser's Geolocation API. This coordinate lookup is done to query open APIs like Open-Meteo. Your precise location is never tracked or logged after the weather details load.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">4. Third-Party Services</h2>
          <p>
            Our services integrate with Google Generative AI (Gemini) and Nominatim (OpenStreetMap). These third-party APIs process requests in accordance with their respective privacy policies.
          </p>
        </section>

        <div className="border-t border-charcoalDark/15 dark:border-white/15 pt-6 flex justify-between items-center text-xs text-sage">
          <p>© 2026 Kissan Alert. All rights reserved.</p>
          <p>Created by Pratyush Panda</p>
        </div>
      </div>
    </div>
  );
}
