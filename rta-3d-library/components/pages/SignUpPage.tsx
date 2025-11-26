
import React, { useMemo, useState } from 'react';
import { Plan, PlanName, Duration, Country, SubscriptionFormData, SoftwareFormat } from '../../types';
import { PLANS, CURRENCY_RATES, BANK_DETAILS } from '../../constants';
import { PricingCard } from '../ui/PricingCard';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { supabase } from '../../supabaseClient'; //
interface SignUpPageProps {
  onSignUpSubmit: (data: SubscriptionFormData) => void;
  onNavigate: (page: 'landing') => void;
  step: number;
  setStep: (step: number) => void;
  maxStepReached: number;
  setMaxStepReached: (step: number) => void;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'bg-[#c8102e] w-8' : 'bg-gray-700 w-4'}`}></div>
    ))}
  </div>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center text-sm z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
        Back
    </button>
);

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSubmit, step, setStep, maxStepReached, setMaxStepReached }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    fullName: '',
    email: '',
    phone: '',
    telegram: '',
    country: Country.Myanmar,
    plan: null,
    duration: Duration.TwelveMonths,
    format: null,
    isRtaStudent: false,
    screenshot: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, screenshot: e.target.files![0] }));
    }
  };

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("🚀 Starting Supabase Submission...");
    setLoading(true);

    try {
      // ၁။ ဖိုင်ယူမယ်
      const form = event.currentTarget;
      const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (!file) {
        alert("Please upload a payment screenshot!");
        setLoading(false);
        return;
      }

      // ၂။ End Date ကို အလိုအလျောက် တွက်မယ် (Calculation Logic)
      const startDate = new Date(); // ဒီနေ့
      const endDate = new Date(startDate); // သက်တမ်းကုန်မည့်ရက် (တွက်ရန်)
      const duration = formData.duration || '1 Year'; // Default က 1 Year

      if (duration === '3 Months') {
        endDate.setMonth(startDate.getMonth() + 3);
      } else if (duration === '6 Months') {
        endDate.setMonth(startDate.getMonth() + 6);
      } else if (duration === '1 Year') {
        endDate.setFullYear(startDate.getFullYear() + 1);
      }

      // ၃။ ပုံ Upload တင်မယ်
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // ၄။ ပုံ Link ယူမယ်
      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);

      // ၅။ Data အားလုံး (Duration + End Date အပါ) သိမ်းမယ်
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert([{
            user_name: formData.name || formData.fullName || 'Unknown',
            phone_no: formData.phone,
            email: formData.email,
            telegram_username: formData.telegram,
            plan_type: formData.plan,
            duration: duration,            // <--- Duration သိမ်းပြီ
            end_date: endDate.toISOString(), // <--- တွက်ထားတဲ့ရက် သိမ်းပြီ
            payment_screenshot_url: publicUrl,
            status: 'pending'
        }]);

      if (insertError) throw insertError;

      // Success
      if (onSignUpSubmit) onSignUpSubmit(formData);

    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = useMemo(() => {
    if (!formData.plan) return null;
    return PLANS.find(p => p.name === formData.plan) || null;
  }, [formData.plan]);

  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    return selectedPlan.prices[formData.duration].total;
  }, [selectedPlan, formData.duration]);

  const nextStep = () => {
    const newStep = Math.min(step + 1, 4);
    setStep(newStep);
    setMaxStepReached(Math.max(maxStepReached, newStep));
  };
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1PlanSelection formData={formData} setFormData={setFormData} onNext={nextStep} selectedPlan={selectedPlan} />;
      case 2:
        return <Step2PersonalInfo formData={formData} handleInputChange={handleInputChange} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3FormatSelection formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <Step4Payment formData={formData} totalPrice={totalPrice} onBack={prevStep} onFileChange={handleFileChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-6xl mx-auto relative">
        <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">Become a Subscriber</h1>
        <p className="text-gray-400 text-center mb-12">Follow the steps below to get instant access to the library.</p>
        <StepIndicator currentStep={step} totalSteps={4} />
        <form name="subscription" onSubmit={handleSubmit} data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="subscription" />
            {renderStep()}
        </form>
      </div>
    </div>
  );
};


// Step 1: Plan Selection
const Step1PlanSelection: React.FC<{ formData: SubscriptionFormData; setFormData: React.Dispatch<React.SetStateAction<SubscriptionFormData>>; onNext: () => void, selectedPlan: Plan | null }> = ({ formData, setFormData, onNext, selectedPlan }) => {
  const handleDurationChange = (duration: Duration) => {
      setFormData(prev => ({ ...prev, duration, isRtaStudent: duration !== Duration.TwelveMonths ? false : prev.isRtaStudent }));
  };
  const handlePlanSelect = (planName: PlanName) => {
      setFormData(prev => ({ ...prev, plan: planName }));
  };

  return (
      <Card>
          <h2 className="text-2xl font-bold text-center mb-2">Step 1: Select Your Plan</h2>
          <p className="text-gray-400 text-center mb-8">Choose your commitment and unlock savings.</p>

          <div className="mb-8">
              <h3 className="font-semibold mb-4 text-center">Choose Duration</h3>
              <div className="flex justify-center flex-wrap gap-4">
                  {(Object.keys(Duration) as Array<keyof typeof Duration>)
                      .filter(key => !isNaN(Number(Duration[key])))
                      .map(key => {
                          const durationValue = Duration[key] as unknown as Duration;
                          const labels = { [Duration.ThreeMonths]: '3 Months', [Duration.SixMonths]: '6 Months', [Duration.TwelveMonths]: '1 Year' };
                          const bonus = { 
                              [Duration.ThreeMonths]: 'Launch Price', 
                              [Duration.SixMonths]: '1 Month FREE', 
                              [Duration.TwelveMonths]: '2 Months FREE + Library Class ($30)' 
                          };
                          const isSelected = formData.duration === durationValue;

                          return (
                              <button key={key} type="button" onClick={() => handleDurationChange(durationValue)}
                                  className={`px-6 py-3 rounded-lg border-2 transition-all w-48 text-center
                                      ${isSelected ? 'bg-[#c8102e] border-transparent text-white shadow-lg shadow-[#c8102e]/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                              >
                                  <span className="font-bold text-lg">{labels[durationValue]}</span>
                                  <span className="block text-xs mt-1">{bonus[durationValue]}</span>
                              </button>
                          )
                      })
                  }
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PLANS.map(plan => (
                  <PricingCard
                      key={plan.name}
                      plan={plan}
                      duration={formData.duration}
                      isSelected={formData.plan === plan.name}
                      onSelect={() => handlePlanSelect(plan.name)}
                  />
              ))}
          </div>

          {selectedPlan && (
              <div className="mt-8">
                  <PriceSummary plan={selectedPlan} duration={formData.duration} isRtaStudent={formData.isRtaStudent} setFormData={setFormData} />
              </div>
          )}

          <div className="mt-8 text-center">
              <Button onClick={onNext} type="button" disabled={!formData.plan} className="px-10 py-3 text-base">
                  Continue <span aria-hidden="true">&rarr;</span>
              </Button>
          </div>
      </Card>
  );
};


// Price Summary Component
const PriceSummary: React.FC<{ plan: Plan; duration: Duration; isRtaStudent: boolean; setFormData: React.Dispatch<React.SetStateAction<SubscriptionFormData>> }> = ({ plan, duration, isRtaStudent, setFormData }) => {
    const priceInfo = plan.prices[duration];
    const regularPrice = plan.prices[duration].monthly * duration;
    const discount = regularPrice - priceInfo.total;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <BonusSection duration={duration} isRtaStudent={isRtaStudent} />
            
            {duration === Duration.TwelveMonths && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center">
                    <input type="checkbox" id="rtaStudent" name="isRtaStudent" checked={isRtaStudent} onChange={(e) => setFormData(prev => ({ ...prev, isRtaStudent: e.target.checked }))} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-[#c8102e] focus:ring-[#c8102e]" />
                    <label htmlFor="rtaStudent" className="ml-3">
                        <span className="font-semibold">I am an RTA student</span>
                        <span className="block text-sm text-gray-400">Get extra Megascan Library for FREE!</span>
                    </label>
                </div>
            )}

            <Card className="!p-0">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Plan Selected:</span><span>{plan.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Monthly Price:</span><span>${priceInfo.monthly}/month</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Duration:</span><span>{duration} months</span></div>
                        <hr className="border-white/10 my-2" />
                        <div className="flex justify-between"><span className="text-gray-400">Regular Price:</span><span>${regularPrice}</span></div>
                        {discount > 0 && <div className="flex justify-between text-green-400"><span className="text-gray-400">Discount ({Math.round(discount/regularPrice * 100)}%):</span><span>-${discount}</span></div>}
                    </div>
                </div>
                <div className="bg-white/5 p-6 rounded-b-xl flex justify-between items-center">
                    <span className="text-xl font-bold">Total Price:</span>
                    <span className="text-2xl font-extrabold text-[#c8102e]">${priceInfo.total}</span>
                </div>
            </Card>
        </div>
    );
};

// Bonus Section Component
const BonusSection: React.FC<{duration: Duration, isRtaStudent: boolean}> = ({ duration, isRtaStudent }) => {
    const bonusContent = {
        [Duration.TwelveMonths]: { title: '1 Year Plan Bonus:', items: ['Get 2 months FREE (14 months total)', 'Free Library Management Class (worth $30)'] },
        [Duration.SixMonths]: { title: '6 Month Plan Bonus:', items: ['Get 1 month FREE (7 months total)'] },
        [Duration.ThreeMonths]: { title: 'Launch Bonus:', items: ['Get the Lowest Launch Price'] }
    };
    const content = bonusContent[duration];
    const studentBonuses = ['RTA Student Bonus: Megascan Library FREE'];
    
    return (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg p-4 text-sm">
            <h4 className="font-bold flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-400"><path d="M20 12.58V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.42"/><path d="m4 8.58 4-2.3 4 2.3 4-2.3 4 2.3V11a2 2 0 0 1-2 2H6a2 2 0 0 1-2 2V8.58z"/><path d="M12 22V7.5"/><path d="M12 7.5S10 2 8 2 4.5 4 4.5 4"/><path d="M12 7.5S14 2 16 2s3.5 2 3.5 2"/></svg>
                {content.title}
            </h4>
            <ul className="space-y-1 pl-2">
                {content.items.map((item, i) => <li key={i} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>{item}</li>)}
                {isRtaStudent && studentBonuses.map((item, i) => <li key={`student-${i}`} className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>{item}</li>)}
            </ul>
        </div>
    );
};


// Step 2: Personal Info
const Step2PersonalInfo: React.FC<{ 
    formData: SubscriptionFormData; 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; 
    onNext: () => void; 
    onBack: () => void 
}> = ({ formData, handleInputChange, onNext, onBack }) => {
    
    // Validation State
    const [errors, setErrors] = useState({
        fullName: false,
        email: false,
        phone: false,
        telegram: false
    });

    // Validation Logic
    const validateAndProceed = () => {
        const isNameValid = formData.fullName.trim().length > 0;
        const isEmailValid = formData.email.trim().length > 0;
        
        // Phone: Must be at least 9 chars long (standard for most mobile numbers)
        const isPhoneValid = formData.phone.trim().length >= 9;
        
        // Telegram: Must start with @ and have text after it
        const isTelegramValid = formData.telegram.startsWith('@') && formData.telegram.length > 1;

        const newErrors = {
            fullName: !isNameValid,
            email: !isEmailValid,
            phone: !isPhoneValid,
            telegram: !isTelegramValid
        };

        setErrors(newErrors);

        // If no errors (all false), proceed
        if (!Object.values(newErrors).some(Boolean)) {
            onNext();
        }
    };

    const getPhoneFlag = (phone: string) => {
        if (phone.startsWith('08')) return '🇹🇭';
        if (phone.startsWith('09')) return '🇲🇲';
        return '📞';
    };

    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 2: Your Information</h2>
            <div className="max-w-md mx-auto space-y-4">
                <div>
                    <label htmlFor="fullName" className={`block text-sm font-medium mb-1 ${errors.fullName ? 'text-red-500' : 'text-gray-300'}`}>Full Name</label>
                    <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                        className={`w-full bg-white/5 rounded-md px-3 py-2 focus:ring-2 transition ${
                            errors.fullName 
                                ? 'border-red-500 focus:ring-red-500 border' 
                                : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">Full Name is required</p>}
                </div>
                <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${errors.email ? 'text-red-500' : 'text-gray-300'}`}>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className={`w-full bg-white/5 rounded-md px-3 py-2 focus:ring-2 transition ${
                            errors.email 
                                ? 'border-red-500 focus:ring-red-500 border' 
                                : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                     {errors.email && <p className="text-red-500 text-xs mt-1">Email is required</p>}
                </div>
                <div>
                    <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${errors.phone ? 'text-red-500' : 'text-gray-300'}`}>Phone Number</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none select-none">
                            {getPhoneFlag(formData.phone)}
                        </div>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            placeholder="09xxxxxxxxx" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            className={`w-full bg-white/5 rounded-md pl-10 pr-3 py-2 focus:ring-2 transition ${
                                errors.phone 
                                    ? 'border-red-500 focus:ring-red-500 border' 
                                    : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                            }`}
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">Please enter a valid phone number (min 5 digits).</p>}
                </div>
                <div>
                    <label htmlFor="telegram" className={`block text-sm font-medium mb-1 ${errors.telegram ? 'text-red-500' : 'text-gray-300'}`}>Telegram Username</label>
                    <input 
                        type="text" 
                        name="telegram" 
                        id="telegram" 
                        placeholder="@username" 
                        value={formData.telegram} 
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 rounded-md px-3 py-2 focus:ring-2 transition ${
                            errors.telegram
                            ? 'border-red-500 focus:ring-red-500 border' 
                            : 'border-white/10 focus:ring-[#c8102e] focus:border-[#c8102e]'
                        }`}
                    />
                    {errors.telegram && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            Username must start with @
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Payment Currency / Method</label>
                    <select name="country" id="country" value={formData.country} onChange={handleInputChange} className="w-full bg-white/5 border-white/10 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#c8102e] focus:border-[#c8102e] transition">
                        <option value={Country.Myanmar}>Myanmar (KBZPay / MMK)</option>
                        <option value={Country.Thailand}>Thailand (Bank Transfer / THB)</option>
                    </select>
                </div>
                
                <div className="pt-4 text-center">
                    <Button 
                        onClick={validateAndProceed} 
                        type="button" 
                        className="px-10 py-3 text-base"
                    >
                        Continue <span aria-hidden="true">&rarr;</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// Step 3: Format Selection
const Step3FormatSelection: React.FC<{ formData: SubscriptionFormData; setFormData: React.Dispatch<React.SetStateAction<SubscriptionFormData>>; onNext: () => void; onBack: () => void }> = ({ formData, setFormData, onNext, onBack }) => {
    const isPremium = formData.plan === PlanName.Premium;
    
    const handleFormatSelect = (format: SoftwareFormat) => {
        setFormData(prev => ({...prev, format}));
    };

    const options = [
        { value: SoftwareFormat.Max, label: '3ds Max' },
        { value: SoftwareFormat.SketchUp, label: 'SketchUp' },
    ];
    
    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 3: Choose Your Format</h2>
            <div className="max-w-md mx-auto">
                {isPremium ? (
                    <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-lg font-semibold text-[#c8102e]">Premium Plan Includes Both</h3>
                        <p className="text-gray-400 mt-2">Your Premium subscription gives you access to both 3ds Max and SketchUp model libraries automatically.</p>
                    </div>
                ) : (
                    <fieldset className="space-y-4">
                        <legend className="sr-only">Software Format</legend>
                        {options.map(option => (
                             <label key={option.value} htmlFor={option.value}
                                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.format === option.value ? 'bg-[#c8102e]/20 border-[#c8102e]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                <input type="radio" id={option.value} name="format" value={option.value} checked={formData.format === option.value} onChange={() => handleFormatSelect(option.value)} className="h-5 w-5 bg-gray-700 border-gray-600 text-[#c8102e] focus:ring-[#c8102e]" />
                                <span className="ml-4 font-semibold text-lg">{option.label}</span>
                            </label>
                        ))}
                    </fieldset>
                )}
                 <div className="pt-8 text-center">
                    <Button onClick={() => {
                        if (isPremium) setFormData(prev => ({...prev, format: SoftwareFormat.Both}));
                        onNext();
                    }} type="button" disabled={!isPremium && !formData.format} className="px-10 py-3 text-base">
                        Continue <span aria-hidden="true">&rarr;</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

// Step 4: Payment
const Step4Payment: React.FC<{ formData: SubscriptionFormData; totalPrice: number; onBack: () => void; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ formData, totalPrice, onBack, onFileChange }) => {
    const isMyanmar = formData.country === Country.Myanmar;
    const localPrice = isMyanmar ? (totalPrice * CURRENCY_RATES.MMK).toLocaleString() : (totalPrice * CURRENCY_RATES.THB).toLocaleString();
    const currency = isMyanmar ? 'MMK' : 'THB';
    const paymentMethod = isMyanmar ? 'KBZPay' : 'Thai Bank Transfer';
    const accountInfo = isMyanmar ? BANK_DETAILS.MMK : BANK_DETAILS.THB;
    
    return (
        <Card className="relative">
            <BackButton onClick={onBack} />
            <h2 className="text-2xl font-bold text-center mb-8">Step 4: Complete Your Payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
                    <h3 className="font-semibold text-lg mb-4">Payment Instructions</h3>
                    <p className="text-sm text-gray-400 mb-4">Transfer the total amount to the account below. Use your name and plan in the payment note (e.g., "{formData.fullName}, {formData.plan} {formData.duration}mo").</p>
                    <div className="bg-black/40 p-4 rounded-md space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Amount (USD):</span><span>${totalPrice}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-400">Exchange Rate:</span><span>1 USD = {isMyanmar ? CURRENCY_RATES.MMK : CURRENCY_RATES.THB} {currency}</span></div>
                         <hr className="border-white/10" />
                        <div className="flex justify-between font-bold text-lg"><span className="text-gray-300">Total to Pay:</span><span className="text-[#c8102e]">{localPrice} {currency}</span></div>
                    </div>
                    <div className="mt-4 bg-black/40 p-4 rounded-md space-y-1">
                        <p className="text-sm"><strong className="text-gray-400">Method:</strong> {paymentMethod}</p>
                        <p className="text-sm"><strong className="text-gray-400">Account:</strong> {accountInfo}</p>
                    </div>
                </div>
                 <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-full">
                    <h3 className="font-semibold text-lg mb-4">Upload Screenshot</h3>
                    <p className="text-sm text-gray-400 mb-4">After payment, upload a screenshot of your transaction. This is required for verification.</p>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <input type="file" id="screenshot" name="screenshot" onChange={onFileChange} accept="image/*" className="hidden" required />
                        <label htmlFor="screenshot" className="cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-500 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            <span className="text-[#c8102e] font-semibold">Click to upload</span>
                            <p className="text-xs text-gray-500 mt-1">{formData.screenshot ? formData.screenshot.name : 'PNG, JPG, GIF up to 10MB'}</p>
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <Button type="submit" disabled={!formData.screenshot} className="px-10 py-3 text-base">
                    Submit & Finish <span aria-hidden="true">&rarr;</span>
                </Button>
            </div>
        </Card>
    );
};
