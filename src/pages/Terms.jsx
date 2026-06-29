import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="grid-bg min-h-screen py-10 px-6 sm:px-10 max-w-4xl mx-auto text-charcoalDark dark:text-white">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-sage hover:text-aqua transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 sm:p-10 border border-charcoalDark/10 dark:border-white/10 shadow-xl space-y-8">
        <div className="flex items-center gap-3 border-b border-charcoalDark/15 dark:border-white/15 pb-6">
          <div className="w-12 h-12 bg-aqua/10 dark:bg-aqua/20 rounded-xl flex items-center justify-center text-aqua shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-3xl uppercase leading-none">Terms & Conditions</h1>
            <p className="font-display text-[10px] sm:text-xs uppercase tracking-widest text-sage mt-1">Effective Date: June 29, 2026</p>
          </div>
        </div>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Kissan Alert (the "Service"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">2. Purpose of the Platform</h2>
          <p>
            Kissan Alert is an AI-powered smart water advisory, crop health diagnostics, and weather intelligence application designed to assist Indian farmers in making data-driven irrigation and agriculture management decisions.
          </p>
        </section>

        {/* ATTRIBUTION SECTION (MIDDLE OF TERMS) */}
        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed bg-aqua/5 dark:bg-aqua/10 p-6 rounded-2xl border border-aqua/25 border-l-4 border-l-aqua">
          <h2 className="font-display text-xl uppercase text-aqua">3. Intellectual Property Rights & Ownership</h2>
          <p>
            The software, design structure, codebase, and layout of this website are the proprietary property of the developer. 
          </p>
          <p className="font-bold text-charcoalDark dark:text-white border-y border-aqua/20 py-3 my-2">
            Specifically, this website is made by Pratyush Panda (LinkedIn: <a href="https://www.linkedin.com/in/pratyush-panda2006" target="_blank" rel="noopener noreferrer" className="underline hover:text-aqua transition-colors">www.linkedin.com/in/pratyush-panda2006</a>), and without my permission none can say it's mine. All rights to Kissan Alert's primary source files, unique layouts, and code concepts are strictly reserved.
          </p>
          <p>
            Unauthorized reproduction, redistribution, or misrepresentation of ownership of Kissan Alert's property will lead to immediate legal action under intellectual property regulations.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">4. User Account & API Keys</h2>
          <p>
            To use the advanced AI advisory features of Kissan Alert, you may be required to input a Google Gemini API Key. This key is stored securely on your local device (in localStorage) and is never transmitted to our external databases. You are solely responsible for managing the billing and usage associated with your own keys.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">5. Disclaimer of Liability</h2>
          <p>
            The weather advisory, disease scanner, and yield calculators are powered by machine learning algorithms and open APIs. Kissan Alert provides these suggestions for informational purposes only. Farmers should combine these advisories with localized agricultural expertise before carrying out major treatments or irrigation decisions.
          </p>
        </section>

        <section className="space-y-4 font-body text-sm sm:text-base leading-relaxed text-charcoalDark/80 dark:text-white/80">
          <h2 className="font-display text-xl uppercase text-charcoalDark dark:text-white">6. Amendments to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Continued use of Kissan Alert following any such changes constitutes your acceptance of the updated terms.
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
