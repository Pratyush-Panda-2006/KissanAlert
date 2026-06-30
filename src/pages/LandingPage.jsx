import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X, Star, ChevronRight, Droplets, Shield, BarChart3, Cpu, Leaf, Users, CloudRain, Waves, Zap, MapPin, MessageSquare } from 'lucide-react';

/* ─────────────── Data ─────────────── */
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const OLD_WAY = [
  'Flood irrigation wastes 60% of water',
  'Guesswork-based crop management',
  'No weather-linked irrigation scheduling',
  'Delayed disease identification leads to crop loss',
];

const NEW_WAY = [
  'AI-optimized irrigation saves up to 40% water',
  'Instant crop diagnostics with treatment plans',
  'Weather-driven smart watering schedules',
  'Proactive alerts before problems escalate',
];

const FEATURES = [
  {
    title: 'Smart Water Advisory',
    desc: 'AI-driven irrigation schedules based on real-time weather, soil type, and crop growth stage. Know exactly when and how much to water.',
    icon: Droplets,
    span: 'col-span-2',
    dark: true,
  },
  {
    title: 'AI Crop Scanner',
    desc: 'Point your camera at any crop. Get instant disease identification, severity assessment, and step-by-step treatment plans.',
    icon: Cpu,
    span: '',
    dark: false,
  },
  {
    title: 'Weather Intelligence',
    desc: 'Hyperlocal forecasts with agricultural advisories. Rain alerts, frost warnings, and heat stress notifications for your specific crops.',
    icon: CloudRain,
    span: '',
    dark: false,
  },
  {
    title: 'Water & Yield Dashboard',
    desc: 'Track water usage, irrigation cycles, crop yields, and growth metrics with beautiful analytics and AI-powered optimization.',
    icon: BarChart3,
    span: 'col-span-2',
    dark: true,
  },
  {
    title: '22 Languages',
    desc: 'Full support for all scheduled Indian languages. Kisan Alert speaks your language — from Hindi to Tamil to Assamese.',
    icon: Users,
    span: '',
    dark: false,
  },
  {
    title: 'Smart Farm Mapping',
    desc: 'Map your fields, mark water sources, and track crop health spatially. AI correlates location data with advisories.',
    icon: MapPin,
    span: '',
    dark: false,
  },
];

const STEPS = [
  {
    num: '01',
    title: 'SCAN & ASSESS',
    desc: 'Open Kisan Alert and photograph your crop or field. Our AI instantly analyzes soil moisture indicators, plant health, and environmental conditions.',
  },
  {
    num: '02',
    title: 'GET SMART ADVISORY',
    desc: 'Receive personalized irrigation schedules, disease diagnoses, treatment plans, and weather-linked farming advice — all in your language.',
  },
  {
    num: '03',
    title: 'PROTECT & OPTIMIZE',
    desc: 'Follow AI-generated water management plans, track yields, and receive proactive alerts. Save water, increase yields, and protect your farm.',
  },
];

const TESTIMONIALS = [
  {
    name: 'RAJESH KUMAR',
    role: 'Wheat Farmer, Punjab',
    text: '"Kisan Alert told me exactly when to irrigate based on upcoming rain. I saved 35% water this season and my yield actually improved."',
    avatar: '👨‍🌾',
  },
  {
    name: 'PRIYA SHARMA',
    role: 'Vegetable Farmer, Gujarat',
    text: '"The smart water advisory is incredible. It considers my soil type, crop stage, and weather — no more guessing when to turn on the pump."',
    avatar: '👩‍🌾',
  },
  {
    name: 'ARUN PATEL',
    role: 'Rice Farmer, Tamil Nadu',
    text: '"Having everything in Tamil makes a real difference. The AI crop scanner found leaf blast disease early and saved my paddy crop."',
    avatar: '🧑‍🌾',
  },
];

const STATS = [
  { value: '40%', label: 'Water Saved', icon: Droplets },
  { value: '22', label: 'Languages', icon: MessageSquare },
  { value: '<3s', label: 'AI Diagnosis', icon: Zap },
  { value: '150M+', label: 'Farmers Reached', icon: Users },
];

/* ─────────────── Component ─────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [ctaEmail, setCtaEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    
    const user = localStorage.getItem('SMART_AG_USER');
    if (user) {
      setIsLoggedIn(true);
    }
    
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleWaitlist = (value, setter) => {
    if (value.trim()) {
      alert(`🎉 Welcome aboard! We'll notify ${value} when Kisan Alert launches in your region.`);
      setter('');
    }
  };

  return (
    <div className="font-body bg-white text-charcoalDark overflow-x-hidden">

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <img src="/logo.png" alt="Kissan Alert Logo" className="w-16 h-16 object-contain rounded-xl" />
            <span className="font-display text-2xl uppercase tracking-normal text-charcoalDark">
              Kissan<span className="text-aqua">Alert</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="font-body text-sm font-medium text-charcoalDark/70 hover:text-charcoalDark transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="water-gradient text-white font-body text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Go to Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-charcoalDark transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg md:hidden border-t border-charcoalDark/10">
            <div className="p-6 flex flex-col gap-4">
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="font-body text-lg font-medium text-charcoalDark/70">
                  {l.label}
                </a>
              ))}
              <hr className="border-charcoalDark/10" />
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="water-gradient text-white font-body font-medium text-center px-6 py-3 rounded-full">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="grid-bg min-h-screen flex flex-col items-center justify-center pt-20 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
        
        {/* Floating water drops */}
        <div className="absolute top-32 left-[15%] w-4 h-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/20 animate-droplet" />
        <div className="absolute top-48 right-[20%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-river/15 animate-droplet" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-[25%] w-5 h-6 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/10 animate-droplet" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 left-[70%] w-3 h-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-ocean/10 animate-droplet" style={{ animationDelay: '0.5s' }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-ocean/5 border border-ocean/10 rounded-full px-5 py-2 mb-8">
            <Droplets className="w-4 h-4 text-aqua animate-pulse" />
            <span className="font-body text-xs font-medium uppercase tracking-widest text-ocean/70">
              SMART WATER, CROP & ADVISORY SYSTEM
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.9] mb-6 tracking-normal text-center w-full">
            SMART WATER{' '}
            <br className="hidden sm:block" />
            HEALTHY{' '}
            <span className="highlight-bar px-2 sm:px-4 text-white">CROPS</span>
          </h1>

          {/* Subheadline */}
          <p className="font-body text-lg sm:text-xl text-charcoalDark/60 max-w-xl mx-auto mb-10 leading-relaxed">
            AI-powered irrigation advisory, crop diagnostics, and farming intelligence — in 22 Indian languages. Save water. Increase yields.
          </p>

          {/* CTA Buttons */}
          <div className="max-w-xs mx-auto">
            <Link
              to="/dashboard"
              className="w-full water-gradient text-white font-display text-xl px-8 py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-ocean/20"
            >
              GO TO DASHBOARD <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Trust line */}
          <p className="font-body text-xs text-charcoalDark/40 mt-4">
            Free forever · No credit card required · Works offline
          </p>
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="water-gradient py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-aquaLight/80" />
                  <span className="font-display text-3xl md:text-4xl text-white">{stat.value}</span>
                </div>
                <p className="font-body text-xs text-white/50 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ PROBLEM-SOLUTION ═══════ */}
      <section className="w-full">
        <div className="flex flex-col md:flex-row">
          {/* Problem — Left */}
          <div className="flex-1 bg-charcoalDark p-10 sm:p-12 md:p-16 lg:p-20">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-sageMuted/50 mb-2">TRADITIONAL FARMING</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.9] mb-10">
              THE OLD<br/>WAY
            </h2>
            <ul className="space-y-5">
              {OLD_WAY.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-coralRed shrink-0 mt-0.5" />
                  <span className="font-body text-base text-sageMuted/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution — Right */}
          <div className="flex-1 bg-ocean p-10 sm:p-12 md:p-16 lg:p-20 border-l-4 border-aqua">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-aqua/60 mb-2">WITH KISAN ALERT</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.9] mb-10">
              THE SMART<br/>WAY
            </h2>
            <ul className="space-y-5">
              {NEW_WAY.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-aqua shrink-0 mt-0.5" />
                  <span className="font-body text-base text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ BENTO FEATURE GRID ═══════ */}
      <section id="features" className="px-6 lg:px-10 py-16 md:py-28 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center justify-center">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3 text-center">EVERYTHING YOU NEED</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] text-center w-full">
            POWERFUL <span className="highlight-bar px-2 text-white">FEATURES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(280px,auto)] md:auto-rows-[minmax(340px,auto)]">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`landing-card rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden ${i === 0 || i === 3 ? 'sm:col-span-2' : ''} ${
                  f.dark
                    ? 'water-gradient text-white'
                    : 'bg-[#f8f9fa] text-charcoalDark border border-charcoalDark/5'
                }`}
              >
                {/* Abstract decoration */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${f.dark ? 'bg-white/10' : 'bg-ocean/[0.03]'}`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.dark ? 'bg-white/20' : 'bg-ocean/5'}`}>
                    <Icon className={`w-6 h-6 ${f.dark ? 'text-white' : 'text-ocean'}`} />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl uppercase mb-3">{f.title}</h3>
                  <p className={`font-body text-base leading-relaxed ${f.dark ? 'text-white/70' : 'text-charcoalDark/60'}`}>
                    {f.desc}
                  </p>
                </div>

                {/* Bottom decorative elements */}
                <div className="mt-6 flex gap-2 relative z-10">
                  {i === 0 && (
                    <>
                      <div className="h-2 flex-1 bg-white/20 rounded animate-pulse-slow" />
                      <div className="h-2 flex-1 bg-aquaLight/30 rounded animate-pulse-slow" style={{ animationDelay: '1s' }} />
                      <div className="h-2 w-8 bg-white/40 rounded animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  {i === 1 && (
                    <div className="bg-charcoalDark/5 rounded-lg p-3 w-full font-body text-xs text-charcoalDark/40">
                      <span className="text-ocean">$</span> scan --crop wheat --ai<br/>
                      <span className="text-leaf">✓</span> <span className="text-charcoalDark/60">Healthy · 98% confidence</span>
                    </div>
                  )}
                  {i === 3 && (
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 h-16 bg-white/10 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-aqua/20 rounded-b-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-aqua/40 rounded-b-lg" />
                      </div>
                      <div className="flex-1 h-16 bg-white/10 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/15 rounded-b-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white/30 rounded-b-lg" />
                      </div>
                    </div>
                  )}
                  {i === 4 && (
                    <div className="flex flex-wrap gap-1">
                      {['हि', 'த', 'ते', 'ক', 'ਪ', 'ಕ'].map((ch, ci) => (
                        <span key={ci} className="w-8 h-8 rounded bg-charcoalDark/5 flex items-center justify-center font-body text-xs text-charcoalDark/50">{ch}</span>
                      ))}
                    </div>
                  )}
                  {i === 5 && (
                    <div className="flex -space-x-2">
                      {['💧', '🌾', '📍', '☀️'].map((e, ei) => (
                        <span key={ei} className="w-10 h-10 rounded-full bg-charcoalDark/5 flex items-center justify-center text-lg border-2 border-[#f8f9fa]">{e}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF / TESTIMONIALS ═══════ */}
      <section id="testimonials" className="px-6 lg:px-10 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center justify-center">
          <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3 text-center">TRUSTED BY FARMERS</p>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-[0.9] text-center w-full text-charcoalDark dark:text-white">
            REAL RESULTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`landing-card rounded-2xl p-8 flex flex-col ${
                i === 1
                  ? 'water-gradient text-white md:translate-y-4 border-transparent'
                  : 'bg-white border border-charcoalDark/10'
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className={`w-5 h-5 ${i === 1 ? 'text-aquaLight fill-aquaLight' : 'text-harvest fill-harvest'}`} />
                ))}
              </div>

              {/* Body */}
              <p className={`font-body text-lg font-medium leading-relaxed mb-8 flex-1 ${i === 1 ? 'text-white/90' : 'text-charcoalDark/80'}`}>
                {t.text}
              </p>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${i === 1 ? 'bg-white/10' : 'bg-charcoalDark/5'}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-display text-sm uppercase">{t.name}</p>
                  <p className={`font-body text-xs ${i === 1 ? 'text-white/50' : 'text-charcoalDark/50'}`}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="px-6 lg:px-10 py-16 md:py-28 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left — Sticky title */}
          <div className="lg:w-1/3 lg:sticky lg:top-28 lg:self-start">
            <p className="font-body text-xs font-medium uppercase tracking-widest text-charcoalDark/50 mb-3">SIMPLE PROCESS</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9]">
              HOW IT <span className="highlight-bar px-2 text-white">WORKS</span>
            </h2>
          </div>

          {/* Right — Steps */}
          <div className="lg:w-2/3 space-y-8">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card group bg-[#f8f9fa] rounded-2xl p-8 md:p-10 border border-charcoalDark/5 hover:border-aqua/30 transition-colors cursor-default">
                <div className="flex items-start gap-6">
                  <span className="step-num font-display text-6xl md:text-8xl leading-none select-none">
                    {step.num}
                  </span>
                  <div className="pt-1 md:pt-3">
                    <h3 className="font-display text-xl md:text-2xl uppercase mb-2">{step.title}</h3>
                    <p className="font-body text-base text-charcoalDark/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="water-gradient relative overflow-hidden py-20 md:py-32 px-6">
        {/* Decorative text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[120px] sm:text-[180px] md:text-[260px] lg:text-[340px] uppercase text-white/[0.04] leading-none whitespace-nowrap">
            KISAN ALERT
          </span>
        </div>

        {/* Wave SVG decoration */}
        <svg className="absolute top-0 left-0 right-0 w-full h-12 md:h-16 pointer-events-none" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0,48L60,42.7C120,37,240,27,360,24C480,21,600,27,720,32C840,37,960,43,1080,42.7C1200,43,1320,37,1380,34.7L1440,32L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" fill="white" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] mb-6 text-white">
            SAVE WATER. GROW MORE. FARM SMARTER.
          </h2>
          <p className="font-body text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of farmers using AI to optimize water usage, diagnose crop diseases, and increase yields. It's free.
          </p>

          {/* CTA Button */}
          <div className="max-w-xs mx-auto">
            <Link
              to="/dashboard"
              className="w-full bg-white text-ocean font-display text-xl px-8 py-4 rounded-xl shadow-xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              GO TO DASHBOARD <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-charcoalDark text-white px-6 lg:px-10 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            {/* Logo */}
            <div>
              <a href="#" className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="Kissan Alert Logo" className="w-8 h-8 object-contain rounded-lg bg-white/90 p-0.5" />
                <span className="font-display text-2xl uppercase text-white">
                  Kissan<span className="text-aqua">Alert</span>
                </span>
              </a>
              <p className="font-body text-sm text-sageMuted/50 mt-3 max-w-xs">
                Smart Water, Crop & Advisory System. AI-powered agriculture for every Indian farmer, in every language.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-12 sm:gap-16">
              <div>
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Product</p>
                <ul className="space-y-3">
                  <li><a href="#features" className="font-body text-sm text-white/50 hover:text-white transition-colors">Features</a></li>
                  <li><Link to="/weather" className="font-body text-sm text-white/50 hover:text-white transition-colors">Water Advisory</Link></li>
                  <li><Link to="/camera" className="font-body text-sm text-white/50 hover:text-white transition-colors">Crop Scanner</Link></li>
                  <li><Link to="/profile" className="font-body text-sm text-white/50 hover:text-white transition-colors">Languages</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Resources</p>
                <ul className="space-y-3">
                  <li><a href="#how-it-works" className="font-body text-sm text-white/50 hover:text-white transition-colors">About</a></li>
                  <li><a href="#testimonials" className="font-body text-sm text-white/50 hover:text-white transition-colors">Blog</a></li>
                  <li><Link to="/chat" className="font-body text-sm text-white/50 hover:text-white transition-colors">FAQ</Link></li>
                  <li><a href="https://www.linkedin.com/in/pratyush-panda2006" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-sm uppercase mb-4 text-sageMuted/50">Legal</p>
                <ul className="space-y-3">
                  <li><Link to="/privacy" className="font-body text-sm text-white/50 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link to="/terms" className="font-body text-sm text-white/50 hover:text-white transition-colors">Terms</Link></li>
                  <li><Link to="/security" className="font-body text-sm text-white/50 hover:text-white transition-colors">Security</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-sageMuted/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-sageMuted/30">
              © 2026 Kisan Alert. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-sageMuted/30 hover:text-white transition-colors">Twitter</a>
              <a href="https://github.com/Pratyush-Panda-2006" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-sageMuted/30 hover:text-white transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/pratyush-panda2006" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-sageMuted/30 hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
