
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const SubscriptionPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    telegram: '',
    plan: '1 Year'
  });
  const [paymentFile, setPaymentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const plans = ['3 Months', '6 Months', '1 Year'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const calculateEndDate = (startDate, plan) => {
    const date = new Date(startDate);
    if (plan === '3 Months') {
      date.setMonth(date.getMonth() + 3);
    } else if (plan === '6 Months') {
      date.setMonth(date.getMonth() + 6);
    } else if (plan === '1 Year') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date;
  };

  const handleSubmit = async (e) => {
    // 1. STOP page reload immediately
    e.preventDefault();
    
    console.log("Form submission started...");
    setLoading(true);
    setErrorMsg('');

    if (!paymentFile) {
      setErrorMsg('Please upload a payment screenshot.');
      setLoading(false);
      return;
    }

    try {
      // --- Step A: Upload Image to Supabase Storage ---
      const fileExt = paymentFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("Uploading file:", filePath);

      // Upload directly using SDK
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, paymentFile);

      if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        throw new Error('Image upload failed: ' + uploadError.message);
      }

      console.log('File uploaded successfully:', uploadData);

      // --- Step B: Get Public URL ---
      const { data: urlData } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      console.log('Public URL generated:', publicUrl);

      // --- Step C: Insert Data into Database ---
      const startDate = new Date();
      const endDate = calculateEndDate(startDate, formData.plan);

      const dbPayload = {
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        telegram_username: formData.telegram,
        plan_duration: formData.plan,
        payment_proof_url: publicUrl,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'pending'
      };

      console.log('Inserting data into table:', dbPayload);

      const { data: insertData, error: insertError } = await supabase
        .from('subscriptions')
        .insert([dbPayload])
        .select();

      console.log('Supabase Insert Response:', { data: insertData, error: insertError });

      if (insertError) {
        throw new Error('Database insert failed: ' + insertError.message);
      }

      // Success
      setSubmitted(true);

    } catch (error) {
      console.error('Submission Process Error:', error);
      setErrorMsg(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Success!</h2>
        <p className="text-gray-700">
          Your subscription request has been received. We will verify your payment and contact you on Telegram shortly.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-600 underline text-sm"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">New Subscription</h1>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Telegram Username</label>
          <input
            type="text"
            name="telegram"
            required
            placeholder="@username"
            value={formData.telegram}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Plan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {plans.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Payment Screenshot */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Uploading & Saving...' : 'Submit Subscription'}
        </button>

      </form>
    </div>
  );
};

export default SubscriptionPage;
