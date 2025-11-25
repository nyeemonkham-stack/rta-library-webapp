
import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { PLANS } from '../../constants';
import { Duration } from '../../types';

interface LandingPageProps {
  onNavigate: (page: 'signup') => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <Card className="text-center transition-all duration-300 hover:border-[#c8102e]/50 hover:-translate-y-1">
    <div className="mx-auto w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-[#c8102e]">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 text-sm text-gray-400">{description}</p>
  </Card>
);

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#c8102e]"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const GreenCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    { title: 'High-Quality Models', description: 'Professionally crafted 3D assets ready for production.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> },
    { title: 'Lightning Fast', description: 'Instant downloads via Telegram. No waiting.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> },
    { title: 'Multiple Formats', description: '3ds Max, SketchUp, and more formats included.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> },
    { title: 'Unlimited Downloads', description: 'Download as many models as you need.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> },
    { title: 'Daily Updates', description: 'New models added every single day.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { title: 'Commercial License', description: 'Use in all your commercial projects.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> }
  ];

  return (
    <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[65vh]">
        {/* HEADLINE: Matches visual reference - Extra Bold, Stacked, Red Highlights */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none drop-shadow-2xl uppercase">
          YOUR COMPLETE <span className="text-[#c8102e]">3D</span>
          <br />
          <span className="text-[#c8102e]">MODEL</span> LIBRARY
        </h1>
        
        {/* SUB-HEADLINE */}
        <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-normal leading-relaxed drop-shadow-md">
          Get unlimited access to thousands of high-quality 3D models for 3ds Max & SketchUp. Updated daily for professional visualization.
        </p>

        {/* CTA BUTTON */}
        <div className="mt-10">
            <Button 
                onClick={() => onNavigate('signup')} 
                className="!px-10 !py-4 !text-lg md:!text-xl !font-bold !rounded-lg shadow-2xl shadow-[#c8102e]/40 hover:shadow-[#c8102e]/60 hover:scale-105 !bg-[#c8102e] hover:!bg-[#a00d25] border-none transition-all duration-300"
            >
                Subscribe Now <span aria-hidden="true" className="ml-2 text-2xl leading-none">&rsaquo;</span>
            </Button>
        </div>

        {/* TRUST BADGES - Pill Style */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <span className="flex items-center bg-[#111] px-4 py-2 rounded-full border border-white/10 text-gray-300 text-sm font-medium shadow-lg">
              <GreenCheckCircle /> Premium Quality Assets
            </span>
            <span className="flex items-center bg-[#111] px-4 py-2 rounded-full border border-white/10 text-gray-300 text-sm font-medium shadow-lg">
              <GreenCheckCircle /> Cancel anytime
            </span>
            <span className="flex items-center bg-[#111] px-4 py-2 rounded-full border border-white/10 text-gray-300 text-sm font-medium shadow-lg">
              <GreenCheckCircle /> 24/7 Support
            </span>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24 md:mt-32">
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">Everything You Need, All in One Place</h2>
        <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">
          From interior furnishings to complex exterior scenes, our library is curated to meet the demands of modern architectural visualization.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="mt-24 md:mt-32">
        <h2 className="text-3xl md:text-4xl font-bold text-center drop-shadow-lg">Choose Your Perfect Plan</h2>
        <p className="text-gray-400 text-center mt-4 max-w-2xl mx-auto">
          Flexible plans to fit your needs. Start with our lowest launch price for immediate access.
        </p>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map(plan => (
                <Card key={plan.name} className={`
                    ${plan.isPopular ? 'border-[#c8102e]/50' : ''}
                `}>
                    {plan.isPopular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c8102e] text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
                    <h3 className="text-xl font-bold text-[#c8102e]">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">(${plan.prices[Duration.ThreeMonths].monthly} / Month)</p>
                    <div className="my-6">
                        <span className="text-4xl font-extrabold text-white">${plan.prices[Duration.ThreeMonths].total}</span>
                        <span className="text-gray-400"> / 3 MONTHS</span>
                    </div>
                    <div className="bg-[#c8102e]/20 border border-[#c8102e]/30 text-[#c8102e] font-semibold text-center py-2 px-3 rounded-md text-sm mb-6">
                        {plan.prices[Duration.ThreeMonths].bonus}
                    </div>
                    <ul className="space-y-3 text-sm flex-grow">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                            <CheckIcon />
                            <span className="ml-3 text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
        <div className="mt-12 text-center">
            <Button onClick={() => onNavigate('signup')} className="px-10 py-4 text-lg">See All Plans & Subscribe</Button>
        </div>
      </section>
    </div>
  );
};
