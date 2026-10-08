import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import WaxSeal from '../components/ui/WaxSeal.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import { Lock, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    const res = await login(username.trim(), password.trim());
    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-[at_50%_40%] from-[#FAF5FE] via-[#FFF9F4] to-[#FDE8F0]/30 pointer-events-none" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-12 left-12 text-[#E6DEF8] opacity-60 pointer-events-none hidden md:block">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-16 right-16 text-[#F8C8DC] opacity-60 pointer-events-none hidden md:block">
        <Sparkles className="w-10 h-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#FFFDFB] rounded-[32px] border border-[#E6DEF8] p-8 sm:p-10 shadow-pastel-lg relative z-10"
      >
        {/* Seal Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <WaxSeal size={60} motif="shell" color="#8F7BD1" interactive={false} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3B5C] tracking-tight">
            Studio Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#8A7B9C] mt-1 font-sans">
            Curate your snail mail editions & manage orders
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-2xl bg-[#FDEDEC] border border-[#F5B7B1] text-[#922B21] text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E74C3C]" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Username"
            id="admin-username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. lavendershelladmin"
          />

          <Input
            label="Password"
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2 text-sm shadow-[0_4px_16px_rgba(185,167,232,0.4)]"
              disabled={loading}
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Unlock Studio Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Subtle footer notice */}
        <div className="mt-8 pt-6 border-t border-[#F0E5F5] text-center">
          <p className="text-[11px] text-[#8A7B9C] flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-[#8F7BD1]" />
            <span>Protected by constant-time verification & 8h session JWT</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
