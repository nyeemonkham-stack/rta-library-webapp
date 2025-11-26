import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/pages/LandingPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { LoginPage } from './components/pages/LoginPage';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { SubscriptionFormData } from './types';

// 'login' page ကို ထပ်ထည့်လိုက်ပါပြီ
type Page = 'landing' | 'signup' | 'dashboard' | 'login';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [submittedData, setSubmittedData] = useState<SubscriptionFormData | null>(null);

  // State for sign-up flow
  const [signUpStep, setSignUpStep] = useState(1);
  const [signUpMaxStep, setSignUpMaxStep] = useState(1);

  // Load data from local storage (Auto Login)
  useEffect(() => {
    const savedData = localStorage.getItem('rta_user_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            setSubmittedData(parsed);
            setPage('dashboard');
        } catch (e) {
            console.error("Failed to parse saved data");
        }
    }
  }, []);

  const navigateTo = useCallback((newPage: Page) => {
    setPage(newPage);
    if (newPage !== 'signup') {
        setSignUpStep(1);
        setSignUpMaxStep(1);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSetSignUpStep = (step: number) => {
    if (step <= signUpMaxStep) {
      setSignUpStep(step);
    }
  };

  // User က Sign Up လုပ်ပြီးရင် (Supabase ပို့ပြီးသားမို့ Local မှာပဲ သိမ်းတော့မယ်)
  const handleSignUpSubmit = (data: SubscriptionFormData) => {
    const dataForStorage = { ...data, screenshot: null };
    localStorage.setItem('rta_user_data', JSON.stringify(dataForStorage));
    
    setSubmittedData(data);
    navigateTo('dashboard');
  };

  // User က Login ဝင်ရင်
  const handleLoginSuccess = (data: SubscriptionFormData) => {
    const dataForStorage = { ...data, screenshot: null };
    localStorage.setItem('rta_user_data', JSON.stringify(dataForStorage));
    
    setSubmittedData(data);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
      localStorage.removeItem('rta_user_data');
      setSubmittedData(null);
      navigateTo('landing');
  }
   
  const renderPage = () => {
    switch (page) {
      case 'login':
        return (
            <LoginPage 
                onLoginSuccess={handleLoginSuccess} 
                onBack={() => navigateTo('landing')} 
            />
        );
      case 'signup':
        return (
            <SignUpPage 
                onSignUpSubmit={handleSignUpSubmit} 
                onNavigate={navigateTo}
                step={signUpStep}
                setStep={setSignUpStep}
                maxStepReached={signUpMaxStep}
                setMaxStepReached={setSignUpMaxStep}
            />
        );
      case 'dashboard':
        return submittedData ? <DashboardPage userData={submittedData} /> : <LandingPage onNavigate={navigateTo} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans antialiased relative overflow-x-hidden">
      <BackgroundOrbs />
      {/* Header ကို Login Page မှာ မပြဘူး */}
      {page !== 'login' && (
          <Header 
            page={page}
            onNavigate={navigateTo}
            signUpStep={signUpStep}
            signUpMaxStep={signUpMaxStep}
            onSetSignUpStep={handleSetSignUpStep}
            onLogout={handleLogout}
          />
      )}
      <main className="relative z-10 pt-24">
        {renderPage()}
      </main>
    </div>
  );
}
