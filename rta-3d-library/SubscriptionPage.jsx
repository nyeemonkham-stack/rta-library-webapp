import { useState } from 'react';
import { supabase } from '../supabaseClient'; 

const SubscriptionPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    telegram: '',
    plan: '3 Months'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // 1. STOP default form submission (အရေးကြီးဆုံး)
    e.preventDefault();
    console.log("🚀 Starting Supabase Submission...");
    setLoading(true);

    try {
      // 2. Get the file from the form directly
      const fileInput = e.target.querySelector('input[type="file"]');
      const file = fileInput?.files[0];

      if (!file) {
        alert("Please upload a payment screenshot!");
        setLoading(false);
        return;
      }

      // 3. Upload Image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      console.log("Image Uploaded:", publicUrl);

      // 5. Save Data to Table
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_name: formData.fullName,
            phone_no: formData.phone,
            email: formData.email,
            telegram_username: formData.telegram,
            plan_type: formData.plan,
            payment_screenshot_url: publicUrl,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      // 6. Success!
      alert("✅ Success! We have received your payment. We will contact you on Telegram.");
      
      // Optional: Clear form
      setFormData({ fullName: '', phone: '', email: '', telegram: '', plan: '3 Months' });
      e.target.reset();

    } catch (error) {
      console.error("❌ Error:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Subscribe Now</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input name="fullName" type="text" required onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-red-500 text-white" />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input name="phone" type="text" required onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-red-500 text-white" />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input name="email" type="email" required onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-red-500 text-white" />
          </div>

          <div>
            <label className="block text-sm mb-1">Telegram Username</label>
            <input name="telegram" type="text" required onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-red-500 text-white" />
          </div>

          <div>
            <label className="block text-sm mb-1">Select Plan</label>
            <select name="plan" onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white">
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Payment Screenshot</label>
            <input type="file" accept="image/*" required
              className="w-full p-2 bg-gray-800 text-white rounded" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition">
            {loading ? 'Sending to Supabase...' : 'Submit Payment'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SubscriptionPage;
