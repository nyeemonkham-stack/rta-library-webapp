
import React, { useMemo } from 'react';
import { SubscriptionFormData, PlanName, SoftwareFormat, TelegramChannel, Duration } from '../../types';
import { PLANS, TELEGRAM_CHANNELS } from '../../constants';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DashboardPageProps {
  userData: SubscriptionFormData;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const LibraryChannelCard: React.FC<{ channel: TelegramChannel }> = ({ channel }) => (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center justify-between opacity-50 cursor-not-allowed hover:opacity-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="flex items-center relative z-20">
            <LockIcon />
            <span className="text-gray-300 font-medium">{channel.name}</span>
        </div>
        <span className="relative z-20 text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-black/40 px-2 py-1 rounded-md border border-white/5">
            Locked
        </span>
    </div>
);


export const DashboardPage: React.FC<DashboardPageProps> = ({ userData }) => {
  const selectedPlanDetails = useMemo(() => PLANS.find(p => p.name === userData.plan), [userData.plan]);

  const accessibleChannels = useMemo(() => {
    if (!userData || !selectedPlanDetails) return [];

    let channels = TELEGRAM_CHANNELS.filter(channel => {
      // 1. Standard Format Logic (Max or SketchUp)
      if (channel.software === 'Max') {
        if(userData.format === SoftwareFormat.Both) return true;
        if(userData.format === SoftwareFormat.Max) return true;
      }
      if (channel.software === 'SketchUp') {
        if(userData.format === SoftwareFormat.Both) return true;
        if(userData.format === SoftwareFormat.SketchUp) return true;
      }
      
      // 2. Premium Texture Library
      // Available for Professional OR Premium plans
      if (channel.name === 'Premium Texture Library') {
        if (selectedPlanDetails.name === PlanName.Professional || selectedPlanDetails.name === PlanName.Premium) {
            return true;
        }
      }

      // 3. Software Library - Archviz
      // Available ONLY for Premium Plan
      if (channel.name === 'Software Library - Archviz') {
        if (selectedPlanDetails.name === PlanName.Premium) return true;
      }

      // 4. Megascan Library for Archviz
      // Available ONLY for RTA Students
      if (channel.name === 'Megascan Library for Archviz') {
          if (userData.isRtaStudent) return true;
      }
      
      return false;
    });

    return [...new Set(channels)]; // Remove duplicates if any
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
    return <div className="text-center pt-20">Loading subscription details...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16 relative">
      
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Welcome, {userData.fullName}!</h1>
        <p className="text-gray-400 mt-4 text-lg">We have received your application. Please check your status below.</p>
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
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                            Pending Verification
                        </span>
                    </div>
                </div>
            </div>

            {/* What Happens Next Letter */}
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
                            <span>You will receive a confirmation email when your access is active.</span>
                        </li>
                         <li className="flex items-start">
                            <span className="text-yellow-500 mr-2 mt-0.5">3.</span>
                            <span>Once verified, we will manually add you to the private Telegram channels using your username: <strong className="text-white bg-white/10 px-1 rounded">{userData.telegram}</strong></span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-yellow-500 mr-2 mt-0.5">4.</span>
                            <span><strong>Bonus:</strong> We have added 3 extra days to your subscription to cover this verification time.</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-4 border-t border-white/10 pt-4">
                        Please do not change your Telegram username during this process, or we won't be able to add you.
                    </p>
                </div>
            </div>
        </div>
      </Card>
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Library Access</h2>
            <div className="flex items-center text-xs text-gray-500 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <LockIcon />
                <span>Unlocks after verification</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleChannels.map((channel, index) => (
                <LibraryChannelCard key={index} channel={channel} />
            ))}
        </div>
      </div>

    </div>
  );
};
