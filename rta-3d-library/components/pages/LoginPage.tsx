import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { SubscriptionFormData, SoftwareFormat } from '../../types';

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
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('email', credentials.email)
        .eq('phone_no', credentials.phone)
        .single();

      if (error || !data) {
        alert("❌ Account not found! Please check your Email and Phone Number.");
        setLoading(false);
        return;
      }

      // 🔥 ပြင်ဆင်ချက်များ (Fixes)
      const userData: SubscriptionFormData = {
        // 1. Name Fix: fullName ကို map လုပ်ပေးလိုက်ပါပြီ
        fullName: data.user_name, 
        name: data.user_name,

        // 2. Links Fix: format ကို 'Both' လို့ ပေးလိုက်ရင် Link အကုန်ပေါ်ပါမယ်
        format: SoftwareFormat.Both, 
        
        email: data.email,
        phone: data.phone_no,
        telegram: data.telegram_username,
        plan: data.plan_type,
        duration: data.duration,
        status: data.status, 
        
        // Dummy data required by types
        country: 'Myanmar',
        software: '3ds Max',
        paymentMethod: 'KPay',
        screenshot: null
      };

      onLoginSuccess(userData); 

    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Login / Check Status</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Please enter the Email and Phone Number you used during subscription.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white"
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
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-red-500 outline-none text-white"
              placeholder="Enter your phone number"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition">
            {loading ? 'Checking...' : 'Login to Dashboard'}
          </button>

          <button type="button" onClick={onBack} className="w-full text-gray-500 text-sm hover:text-white mt-4">
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};
