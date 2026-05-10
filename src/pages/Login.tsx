import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

type UserMode = 'login' | 'signup';

export default function Login() {
  const { loginAdmin, loginUser, signupUser } = useAuth();
  const navigate = useNavigate();
  const [userMode, setUserMode] = useState<UserMode>('login');
  
  // User State
  const [identifier, setIdentifier] = useState(''); // email or phone for login
  const [email, setEmail] = useState(''); // for signup
  const [phone, setPhone] = useState(''); // for signup
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);
    try {
      if (userMode === 'login') {
        if (!identifier || !password) {
          throw new Error('Please fill in all fields.');
        }
        
        // Check if admin login
        if (identifier === 'admin@mooncreation.com' || identifier === 'gopinathsumathi05@gmail.com') {
          await loginAdmin(identifier, password);
          navigate('/admin');
        } else {
          await loginUser(identifier, password);
          navigate('/');
        }
      } else {
        if (!email || !phone || !password) {
          throw new Error('Please fill in all fields.');
        }
        if (phone.replace(/\D/g, '').length < 10) {
          throw new Error('Please enter a valid phone number.');
        }
        await signupUser(email, phone, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${userMode}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (mode: UserMode) => {
    if (mode === userMode) return;
    setUserMode(mode);
    setError('');
    setIdentifier('');
    setEmail('');
    setPhone('');
    setPassword('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF9F6] px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={userMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-serif font-bold text-[#2C2C2C]">
                {userMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 mt-2">
                {userMode === 'login' ? 'Sign in with your email or phone.' : 'Join us to discover MOONCREATION crafts.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <form onSubmit={handleUserAuth} className="space-y-6">
            <AnimatePresence mode="wait">
              {userMode === 'login' ? (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email or Phone Number
                    </label>
                    <input 
                      type="text" 
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="user@example.com or 9876543210"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent transition-all"
              />
            </motion.div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#2C2C2C] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors shadow-sm mt-2 disabled:opacity-70"
            >
              {loading ? 'Please wait...' : (userMode === 'login' ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <button 
              onClick={() => handleModeSwitch(userMode === 'login' ? 'signup' : 'login')}
              className="text-sm text-gray-600 hover:text-[#2C2C2C] font-medium transition-colors"
            >
              {userMode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
