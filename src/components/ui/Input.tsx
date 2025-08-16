import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      className = '',
      fullWidth = true,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label htmlFor={props.id} className="form-label">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input-field ${
              icon && iconPosition === 'left' ? 'pl-10' : ''
            } ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${
              error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
            } placeholder:text-gray-400 placeholder:text-sm ${className}`}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
