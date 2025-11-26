import React, { useMemo, useEffect, useState } from 'react';
import { SubscriptionFormData, PlanName, SoftwareFormat, TelegramChannel, Duration } from '../../types';
import { PLANS, TELEGRAM_CHANNELS } from '../../constants';
import { Card } from '../ui/Card';
import { supabase } from '../../supabaseClient';

interface DashboardPageProps {
  userData: SubscriptionFormData & { status?: string }; 
}

// 🔒 Locked Icon
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

// 🔓 Unlocked Icon (Open Lock)
const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 mr-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
);

// Card Component
const LibraryChannelCard: React.FC<{ channel: TelegramChannel; isUnlocked: boolean }> = ({ channel, isUnlocked }) => {
    if (isUnlocked) {
        return (
            <a 
                href={channel.link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-green-900/10 p-4 rounded-lg border border-green-500/30 flex items-center justify-between cursor-pointer hover:bg-green-900/20 hover:border-green-500/60 transition-all duration-300 relative overflow-hidden"
            >
                <div className="flex items-center relative z-20">
                    <UnlockIcon />
                    <span className="text-white font-medium group-hover:text-green-400 transition-colors">{channel.name}</span>
                </div>
                <span className="relative z-20 text-[10px] uppercase tracking-wider font-bold text-green-400 bg-green-900/40 px-2 py-1 rounded-md border border-green-500/20 group-hover:bg-green-500 group-hover:text-black transition-all">
                    Access Now
                </span>
            </a>
        );
    }

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between opacity-50 cursor-not-allowed relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 z-10"></div>
            <div className="flex items-center relative z-20">
                <LockIcon />
                <span className="text-gray-400 font-medium">{channel.name}</span>
            </div>
            <span className="relative z-20 text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                Locked
            </span>
        </div>
    );
};


export const DashboardPage: React.FC<DashboardPageProps> = ({ userData }) => {
  // 1. Status Logic (Declared ONLY HERE)
  const [status, setStatus] = useState(userData.status || 'pending');

  useEffect(() => {
    const checkStatus = async () => {
      if (!userData.email) return;
      
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('email', userData.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStatus(data.status);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [userData.email]);

  const isApproved = status === 'approved';

  // 2. Plan Logic
  const selectedPlanDetails = useMemo(() => PLANS.find(p => p.name === userData.plan), [userData.plan]);

  const accessibleChannels = useMemo(() => {
    if (!userData || !selectedPlanDetails) return [];

    let channels = TELEGRAM_CHANNELS.filter(channel => {
      if (channel.software === 'Max') {
        if(userData.format === SoftwareFormat.Both) return true;
        if(userData.format === SoftwareFormat.Max) return true;
      }
      if (channel.software === 'SketchUp') {
        if(userData.format === SoftwareFormat.Both) return true;
        if(userData.format === SoftwareFormat.SketchUp) return true;
      }
      
      if (channel.name === 'Premium Texture Library') {
        if (selectedPlanDetails.name === PlanName.Professional || selectedPlanDetails.name === PlanName.Premium) {
            return true;
        }
      }

      if (channel.name === 'Software Library - Archviz') {
        if (selectedPlanDetails.name === PlanName.Premium) return true;
      }

      if (channel.name === 'Megascan Library for Archviz') {
          if (userData.isRtaStudent) return true;
      }
      
      return false;
    });

    return [...new Set(channels)];
  }, [userData, selectedPlanDetails]);
  
  const amountPaid = selectedPlanDetails ? selectedPlanDetails.prices[userData.duration].total : 0;

  const { durationDetails, totalMonths } = useMemo(() => {
      let details = `${userData.duration} Months`;
      let total = userData.duration;
      let bonus = 0;

      if (userData.duration === Duration.TwelveMonths) {
          bonus = 2;
          details = `${userData.duration} months + ${bonus} months FREE`;
          total += bonus;
      } else if (userData.duration === Duration.SixMonths) {
          bonus = 1;
          details = `${userData.duration} months + ${bonus} month FREE`;
          total += bonus;
      }
      
      return {
          durationDetails: details,
          totalMonths: `${total} months`
      };
  }, [userData.duration]);


  if (!selectedPlanDetails) {
    return <div className="text-center pt-20 text-white">Loading subscription details...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16 relative">
      
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {isApproved ? `Welcome Back, ${userData.fullName}!` : `Welcome, ${userData.fullName}!`}
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
            {isApproved 
                ? "Your access is active. Click the channels below to join." 
                : "We have received your application. Please check your status below."}
        </p>
      </div>

      <Card className="max-w-5xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Subscription Details */}
            <div className="md:col-span-1 space-y-6">
                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-2">Subscription Details</h2>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Plan Name</p>
                        <p className="text-white font-semibold text-lg text-[#c8102e]">{userData.plan}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Duration</p>
                        <p className="text-gray-300">{durationDetails}</p>
                    </div>
                     <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Total Access</p>
                        <p className="text-white font-medium">{totalMonths}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Amount Paid</p>
                        <p className="text-white font-medium">${amountPaid} (approx.)</p>
                    </div>
                    <div className="pt-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Current Status</p>
                        
                        {/* Status Badge */}
                        {isApproved ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                                Active Membership
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                                Pending Verification
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* What Happens Next Letter - Only show if NOT approved */}
            {!isApproved && (
                <div className="md:col-span-2 bg-white/5 p-6 rounded-xl border border-white/10 relative">
                    <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        What happens next?
                    </h2>
                    <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
                        <p>Thank you for subscribing to the RTA 3D Model Library. Because we manually verify every payment to ensure security, there is a short waiting period.</p>
                        <ul className="space-y-3 list-none ml-1">
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2 mt-0.5">1.</span>
                                <span>Our team will verify your payment slip within <strong>24 hours</strong>.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2 mt-0.5">2.</span>
                                <span>Once verified, this page will automatically update, and the locks below will open.</span>
                            </li>
                             <li className="flex items-start">
                                <span className="text-yellow-500 mr-2 mt-0.5">3.</span>
                                <span>We will also add you to the Telegram channels manually using: <strong className="text-white bg-white/10 px-1 rounded">{userData.telegram}</strong></span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2 mt-0.5">4.</span>
                                <span><strong>Bonus:</strong> We have added 3 extra days to your subscription to cover this verification time.</span>
                            </li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-4 border-t border-white/10 pt-4">
                            Please refresh this page later to check if your access is ready.
                        </p>
                    </div>
                </div>
            )}

            {/* Active Message - Show if Approved */}
            {isApproved && (
                 <div className="md:col-span-2 bg-green-900/10 p-6 rounded-xl border border-green-500/20 relative flex flex-col justify-center items-center text-center">
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Access Granted! 🎉</h2>
                    <p className="text-gray-300">
                        Your payment has been verified. You can now access all the libraries included in your plan.
                        <br/>Click the unlocked cards below to join the Telegram channels.
                    </p>
                </div>
            )}
        </div>
      </Card>
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Library Access</h2>
            <div className={`flex items-center text-xs px-3 py-1 rounded-full border ${isApproved ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-black/40 text-gray-500 border-white/10'}`}>
                {isApproved ? <UnlockIcon /> : <LockIcon />}
                <span>{isApproved ? 'Access Unlocked' : 'Unlocks after verification'}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleChannels.map((channel, index) => (
                <LibraryChannelCard 
                    key={index} 
                    channel={channel} 
                    isUnlocked={isApproved} 
                />
            ))}
        </div>
      </div>

    </div>
  );
};
