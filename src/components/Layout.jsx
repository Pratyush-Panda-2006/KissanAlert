import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setVersion(v => v + 1);
    window.addEventListener('kisanalert_translation_updated', handleUpdate);
    return () => window.removeEventListener('kisanalert_translation_updated', handleUpdate);
  }, []);

  return (
    <div key={version} className="min-h-screen bg-[#f8f9fa] dark:bg-charcoalDark text-charcoalDark dark:text-white font-body w-full relative transition-colors duration-300">
      <div className="w-full h-screen overflow-y-auto custom-scroll pb-24 md:pb-32 px-5 md:px-10 lg:px-20 max-w-[1400px] mx-auto pt-6">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
