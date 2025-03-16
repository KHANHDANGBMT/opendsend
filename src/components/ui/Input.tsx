import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface BaseInputProps {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  as?: 'input' | 'textarea';
  rows?: number;
}

export type InputProps = (
  BaseInputProps & 
  (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>)
);

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    fullWidth = true, 
    helperText, 
    id, 
    icon, 
    iconPosition = 'left',
    as = 'input',
    rows = 3,
    ...props 
  }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;
    
    const hasError = !!error;
    
    const baseClasses = 'px-3 py-2 bg-white dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200';
    const stateClasses = hasError 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
      : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary/30';
    const widthClass = fullWidth ? 'w-full' : '';
    const iconPaddingClass = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} flex flex-col gap-1`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          
          {as === 'textarea' ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              rows={rows}
              className={twMerge(
                baseClasses,
                stateClasses,
                widthClass,
                className
              )}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...props as TextareaHTMLAttributes<HTMLTextAreaElement>}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              className={twMerge(
                baseClasses,
                stateClasses,
                widthClass,
                iconPaddingClass,
                className
              )}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              {...props as InputHTMLAttributes<HTMLInputElement>}
            />
          )}
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
        </div>
        
        {helperText && !hasError && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        
        {hasError && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 