import React, { useState } from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  multiline = false,
  rows = 4,
  options = null,
  helperText = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex flex-col space-y-1.5 text-left w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#4A3B5C] flex items-center justify-between select-none"
        >
          <span className="flex items-center gap-1">
            {label}
            {required && <span className="text-[#E74C3C] font-bold">*</span>}
          </span>
          {helperText && (
            <span className="text-[10px] text-[#8A7B9C] font-normal">{helperText}</span>
          )}
        </label>
      )}

      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-2xl transition-all outline-none resize-none text-[#4A3B5C] placeholder-[#8A7B9C] ${
            isFocused
              ? 'border-[#B9A7E8] shadow-[0_0_14px_rgba(185,167,232,0.35)] bg-white'
              : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
          } ${error ? 'border-rose-400 bg-rose-50/20' : ''}`}
          {...props}
        />
      ) : options ? (
        <div className="relative w-full">
          <select
            id={inputId}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            required={required}
            className={`w-full px-3.5 py-2.5 pr-9 text-sm bg-white border rounded-2xl transition-all outline-none text-[#4A3B5C] appearance-none cursor-pointer ${
              isFocused
                ? 'border-[#B9A7E8] shadow-[0_0_14px_rgba(185,167,232,0.35)] bg-white'
                : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
            } ${error ? 'border-rose-400 bg-rose-50/20' : ''}`}
            {...props}
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7B9C]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-2xl transition-all outline-none text-[#4A3B5C] placeholder-[#8A7B9C] ${
            isFocused
              ? 'border-[#B9A7E8] shadow-[0_0_14px_rgba(185,167,232,0.35)] bg-white'
              : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
          } ${error ? 'border-rose-400 bg-rose-50/20' : ''}`}
          {...props}
        />
      )}

      {error && (
        <p className="text-xs text-rose-500 font-medium pl-1 pt-0.5">{error}</p>
      )}
    </div>
  );
}
