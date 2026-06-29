import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Security() {
  return (
    <div className="grid-bg min-h-screen py-10 px-6 sm:px-10 max-w-4xl mx-auto text-charcoalDark dark:text-white">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-sage hover:text-aqua transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 sm:p-10 border border-charcoalDark/10 dark:border-white/10 shadow-xl space-y-8">
        <div className="flex items-center gap-3 border-b border-charcoalDark/15 dark:border-white/15 pb-6">
          <div className="w-12 h-12 bg-aqua/10 dark:bg-aqua/20 rounded-xl flex items-center justify-center text-aqua shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none">Security Policy</h1>
            <p className="font-display text-[10px] sm:text-xs uppercase tracking-widest text-sage mt-1">Effective Date: June 29, 2026</p>
          </div>
        </div>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">1. API Key Protection</h2>
          <p>
            Your Google Gemini API Key is a highly sensitive credential. Kissan Alert uses a strict decentralized frontend architecture. Your API key is stored locally on your device within your browser's isolated local storage container. It is never sent to, read by, or stored on any Kissan Alert backend server. All API requests are fired directly from your browser to Google's official Gemini endpoint.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">2. Local Storage Auditing</h2>
          <p>
            You can inspect all stored parameters (e.g. `smartAgHistory`, `GEMINI_API_KEY`) at any time by opening your browser's Developer Console under Application Storage. You can fully delete all local configurations and history details instantly by clicking "Clear All" or "Delete Account" in the settings layout.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">3. Vulnerability Reporting</h2>
          <p>
            If you identify a security vulnerability in Kissan Alert, we encourage you to contact the maintainers. Please send reports to our repository administrator, Pratyush Panda, via LinkedIn or GitHub to coordinate a swift fix.
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
