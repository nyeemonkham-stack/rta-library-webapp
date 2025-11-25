
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/pages/LandingPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { SubscriptionFormData, Duration } from './types';

type Page = 'landing' | 'signup' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [submittedData, setSubmittedData] = useState<SubscriptionFormData | null>(null);

  // State for sign-up flow
  const [signUpStep, setSignUpStep] = useState(1);
  const [signUpMaxStep, setSignUpMaxStep] = useState(1);

  // Load data from local storage on load (so dashboard persists on refresh)
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

  const handleSignUpSubmit = (data: SubscriptionFormData) => {
    // 1. Save to LocalStorage (Persist the session)
    // We can't save the File object to local storage, so we exclude it for the UI state
    const dataForStorage = { ...data, screenshot: null };
    localStorage.setItem('rta_user_data', JSON.stringify(dataForStorage));

    // 2. Update UI immediately
    setSubmittedData(data);
    navigateTo('dashboard');

    // 3. Calculate Expiry Date
    const today = new Date();
    const startDateString = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
    
    // Calculate End Date
    const endDate = new Date(today);
    // Add months based on duration
    let monthsToAdd = data.duration;
    
    // Add Bonus Months logic (must match constants logic)
    if (data.duration === Duration.TwelveMonths) monthsToAdd += 2;
    if (data.duration === Duration.SixMonths) monthsToAdd += 1;

    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    // Add the 3 bonus days for verification
    endDate.setDate(endDate.getDate() + 3);
    
    const expiryDateString = endDate.toLocaleDateString('en-GB'); // DD/MM/YYYY

    // 4. Prepare FormData for Server Upload (Netlify Compatible)
    // Netlify forms work by POSTing to "/" with 'form-name' attribute.
    // This uses the BROWSER'S native FormData (not our custom type)
    const serverFormData = new FormData();
    serverFormData.append('form-name', 'subscription');
    Object.keys(data).forEach(key => {
        // @ts-ignore
        const value = data[key as keyof SubscriptionFormData];
        if (key === 'screenshot' && value) {
            serverFormData.append('screenshot', value as File);
        } else {
            serverFormData.append(key, String(value));
        }
    });
    
    // Add derived fields for easier reading by Admin
    serverFormData.append('duration_text', `${data.duration} Months`);
    serverFormData.append('startDate', startDateString);
    serverFormData.append('expiryDate', expiryDateString);

    // 5. Send (Compatible with both Netlify and custom server if configured correctly)
    fetch('/', {
        method: 'POST',
        body: serverFormData,
    })
    .then(() => {
        console.log("Form submission sent");
    })
    .catch(error => {
        console.error("Form submission error:", error);
    });
  };

  const handleLogout = () => {
      localStorage.removeItem('rta_user_data');
      setSubmittedData(null);
      navigateTo('landing');
  }
  
  const renderPage = () => {
    switch (page) {
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
      <Header 
        page={page}
        onNavigate={navigateTo}
        signUpStep={signUpStep}
        signUpMaxStep={signUpMaxStep}
        onSetSignUpStep={handleSetSignUpStep}
        onLogout={handleLogout}
      />
      <main className="relative z-10 pt-24">
        {renderPage()}
      </main>
    </div>
  );
}
