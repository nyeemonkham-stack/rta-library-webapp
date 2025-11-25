
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black";

  const variantClasses = {
    primary: "bg-[#c8102e] text-white hover:shadow-lg hover:shadow-[#c8102e]/40 transform hover:-translate-y-0.5 focus:ring-[#c8102e]",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    ghost: "bg-transparent text-gray-300 hover:bg-white/10 hover:text-white"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};