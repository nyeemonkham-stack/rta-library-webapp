
import React from 'react';
import { Plan, Duration } from '../../types';
import { Button } from './Button';

interface PricingCardProps {
  plan: Plan;
  duration: Duration;
  isSelected: boolean;
  onSelect: () => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#c8102e]"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export const PricingCard: React.FC<PricingCardProps> = ({ plan, duration, isSelected, onSelect }) => {
  const priceInfo = plan.prices[duration];

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the parent div click from firing twice
    onSelect();
  };

  return (
    <div
      onClick={onSelect}
      className={`relative bg-[#111111]/70 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl shadow-black/40 transition-all duration-300 cursor-pointer
        ${isSelected ? 'border-[#c8102e] ring-2 ring-[#c8102e]/30' : 'border-white/10 hover:border-white/30 transform hover:-translate-y-1'}`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c8102e] text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-[#c8102e]">{plan.name}</h3>
        <p className="text-sm text-gray-400 mt-1">(${priceInfo.monthly} / Month)</p>

        <div className="my-6">
          <span className="text-4xl font-extrabold text-white">${priceInfo.total}</span>
          <span className="text-gray-400"> TOTAL</span>
          {priceInfo.save > 0 && <p className="text-sm text-green-400 mt-1">( Save ${priceInfo.save} )</p>}
        </div>

        <div className="bg-[#c8102e]/20 border border-[#c8102e]/30 text-[#c8102e] font-semibold text-center py-2 px-3 rounded-md text-sm mb-6">
          {priceInfo.bonus}
        </div>

        <ul className="space-y-3 text-sm flex-grow">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon />
              <span className="ml-3 text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-8">
            <Button 
                className="w-full" 
                variant={isSelected ? 'primary' : 'secondary'}
                type="button"
                onClick={handleButtonClick}
            >
                {isSelected ? 'Selected' : 'Choose Plan'}
            </Button>
        </div>
      </div>
    </div>
  );
};