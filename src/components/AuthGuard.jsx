import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Droplets } from 'lucide-react';
import { fetchAndRestoreUserData } from '../utils/userDataSync';

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch and restore user data in background to sync other devices/sessions
        fetchAndRestoreUserData(user.uid);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoalDark flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Floating background drop */}
        <div className="absolute top-[30%] left-[20%] w-6 h-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-aqua/10 animate-pulse pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-8 h-10 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-river/10 animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl animate-spin-slow">
            <Droplets className="w-8 h-8 text-aqua animate-bounce" />
          </div>
          <p className="font-display uppercase tracking-widest text-xs text-sage mt-2">Checking Account...</p>
        </div>
      </div>
    );
  }

  return children;
}
