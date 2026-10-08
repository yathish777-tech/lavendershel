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
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const isFloating = isFocused || hasValue;

  return (
    <div className={`relative flex flex-col pt-3 ${className}`}>
      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={rows}
          required={required}
          className={`w-full px-4 pt-4 pb-2 text-sm bg-white/80 border rounded-2xl transition-all outline-none resize-none text-[#4A3B5C] ${
            isFocused
              ? 'border-[#B9A7E8] shadow-[0_0_15px_rgba(185,167,232,0.35)] bg-white'
              : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
          } ${error ? 'border-rose-400' : ''}`}
          placeholder={isFloating ? placeholder : ''}
          {...props}
        />
      ) : options ? (
        <select
          id={inputId}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`w-full px-4 pt-4 pb-2 text-sm bg-white/80 border rounded-2xl transition-all outline-none text-[#4A3B5C] appearance-none ${
            isFocused
              ? 'border-[#B9A7E8] shadow-[0_0_15px_rgba(185,167,232,0.35)] bg-white'
              : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
          }`}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={`w-full px-4 pt-4 pb-2 text-sm bg-white/80 border rounded-2xl transition-all outline-none text-[#4A3B5C] ${
            isFocused
              ? 'border-[#B9A7E8] shadow-[0_0_15px_rgba(185,167,232,0.35)] bg-white'
              : 'border-[#E6DEF8] hover:border-[#D4C6F4]'
          } ${error ? 'border-rose-400' : ''}`}
          placeholder={isFloating ? placeholder : ''}
          {...props}
        />
      )}

      {/* Floating Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`absolute left-4 pointer-events-none transition-all duration-200 select-none ${
            isFloating
              ? 'top-1 text-[11px] font-semibold text-[#8F7BD1]'
              : 'top-6 text-sm text-[#8A7B9C]'
          }`}
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {error && (
        <p className="text-xs text-rose-500 mt-1 pl-2">{error}</p>
      )}
    </div>
  );
}
