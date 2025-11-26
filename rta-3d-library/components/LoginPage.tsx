import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { SubscriptionFormData } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (data: SubscriptionFormData) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', phone: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase မှာ Email နဲ့ Phone တူတဲ့လူ ရှိလား ရှာမယ်
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', credentials.email)
        .eq('phone_no', credentials.phone)
        .single();

      if (error || !data) {
        alert("❌ Account not found! Please check your Email and Phone Number, or Subscribe first.");
        setLoading(false);
        return;
      }

      // Data တွေ့ရင် ပုံစံပြောင်းပြီး Dashboard ကို ပို့မယ်
      const userData: SubscriptionFormData = {
        name: data.user_name,
        email: data.email,
        phone: data.phone_no,
        telegram: data.telegram_username,
        plan: data.plan_type,
        duration: data.duration,
        status: data.status, // Status အဟောင်းအတိုင်း ပြန်ယူမယ်
        // Dummy fields (not needed for dashboard but required by type)
        country: 'Myanmar',
        software: '3ds Max',
        paymentMethod: 'KPay',
        screenshot: null
      };

      onLoginSuccess(userData); // App.tsx ကနေ Dashboard ကို ပို့ပေးလိမ့်မယ်

    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Check Your Status</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter the Email and Phone Number you used during subscription to access your dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input 
              type="text" 
              required 
              value={credentials.phone}
              onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition">
            {loading ? 'Checking...' : 'Access Dashboard'}
          </button>

          <button type="button" onClick={onBack} className="w-full text-gray-500 text-sm hover:text-white">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};
