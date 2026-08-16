import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

/**
 * Neon-text field: dark glass, subtle border that brightens on focus.
 * Used for search boxes, selectors, forms across the app.
 */
const Input: React.FC<InputProps> = ({ icon, className = '', ...rest }) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        {icon}
      </span>
    )}
    <input
      className={`w-full bg-black/40 border border-white/10 rounded-xl py-3 ${
        icon ? 'pl-10' : 'px-4'
      } pr-4 text-white focus:outline-none focus:border-white/20 transition-all placeholder-gray-600 ${className}`}
      {...rest}
    />
  </div>
);

export default Input;
