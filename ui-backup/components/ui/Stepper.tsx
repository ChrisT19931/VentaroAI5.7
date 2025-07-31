'use client';

import React from 'react';

type StepStatus = 'completed' | 'current' | 'upcoming';

type StepProps = {
  /**
   * Label for the step
   */
  label: string;
  
  /**
   * Optional description for the step
   */
  description?: string;
  
  /**
   * Status of the step
   */
  status: StepStatus;
  
  /**
   * Optional icon for the step
   */
  icon?: React.ReactNode;
  
  /**
   * Optional click handler for the step
   */
  onClick?: () => void;
  
  /**
   * Whether the step is clickable
   */
  clickable?: boolean;
  
  /**
   * Index of the step (automatically set by Stepper)
   */
  index?: number;
  
  /**
   * Whether this is the last step (automatically set by Stepper)
   */
  isLastStep?: boolean;
  
  /**
   * Orientation of the stepper (automatically set by Stepper)
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Size of the step (automatically set by Stepper)
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variant of the step (automatically set by Stepper)
   */
  variant?: 'default' | 'outlined' | 'contained';
};

type StepperProps = {
  /**
   * Children must be Step components
   */
  children: React.ReactNode;
  
  /**
   * Active step index (0-based)
   */
  activeStep: number;
  
  /**
   * Orientation of the stepper
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Whether to alternate the alignment of steps (horizontal only)
   */
  alternativeLabel?: boolean;
  
  /**
   * Size of the stepper
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variant of the stepper
   */
  variant?: 'default' | 'outlined' | 'contained';
  
  /**
   * Whether to show the connector between steps
   */
  connector?: boolean;
  
  /**
   * Whether steps are clickable
   */
  nonLinear?: boolean;
  
  /**
   * Callback when a step is clicked
   */
  onStepClick?: (index: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export function Step({
  label,
  description,
  status,
  icon,
  onClick,
  clickable = false,
  index = 0,
  isLastStep = false,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
}: StepProps) {
  // Determine size classes
  const sizeConfig = {
    sm: {
      circle: 'w-6 h-6 text-xs',
      label: 'text-xs',
      description: 'text-xs',
      connector: 'w-full h-0.5',
    },
    md: {
      circle: 'w-8 h-8 text-sm',
      label: 'text-sm',
      description: 'text-xs',
      connector: 'w-full h-0.5',
    },
    lg: {
      circle: 'w-10 h-10 text-base',
      label: 'text-base',
      description: 'text-sm',
      connector: 'w-full h-1',
    },
  }[size];
  
  // Determine status classes
  const statusConfig = {
    completed: {
      circle: 'bg-blue-500 text-white',
      label: 'font-medium text-gray-900',
      description: 'text-gray-500',
      connector: 'bg-blue-500',
    },
    current: {
      circle: 'bg-blue-500 text-white',
      label: 'font-medium text-gray-900',
      description: 'text-gray-500',
      connector: 'bg-gray-300',
    },
    upcoming: {
      circle: 'bg-gray-200 text-gray-500',
      label: 'text-gray-500',
      description: 'text-gray-400',
      connector: 'bg-gray-300',
    },
  }[status];
  
  // Determine variant classes
  const variantConfig = {
    default: {
      circle: '',
      wrapper: '',
    },
    outlined: {
      circle: 'border-2 border-current',
      wrapper: '',
    },
    contained: {
      circle: '',
      wrapper: status === 'current' ? 'bg-blue-50 p-3 rounded-md' : '',
    },
  }[variant];
  
  // Handle step click
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };
  
  // Render step content
  const stepContent = (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex flex-col items-center' : 'flex'}
        ${clickable ? 'cursor-pointer' : ''}
        ${variantConfig.wrapper}
      `}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="flex items-center">
        {/* Step circle */}
        <div
          className={`
            ${sizeConfig.circle} rounded-full flex items-center justify-center
            ${statusConfig.circle} ${variantConfig.circle}
          `}
        >
          {status === 'completed' && !icon ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : icon ? (
            icon
          ) : (
            index + 1
          )}
        </div>
        
        {/* Connector (for vertical orientation) */}
        {orientation === 'vertical' && !isLastStep && (
          <div className="ml-4 flex-1">
            <div className={`h-full w-0.5 ${statusConfig.connector}`} style={{ height: '24px' }} />
          </div>
        )}
      </div>
      
      {/* Step label and description */}
      <div
        className={`
          ${orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-3 mt-0'}
          ${orientation === 'vertical' ? 'flex-1' : ''}
        `}
      >
        <div className={`${sizeConfig.label} ${statusConfig.label}`}>{label}</div>
        {description && (
          <div className={`${sizeConfig.description} ${statusConfig.description}`}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
  
  return stepContent;
}

export default function Stepper({
  children,
  activeStep,
  orientation = 'horizontal',
  alternativeLabel = false,
  size = 'md',
  variant = 'default',
  connector = true,
  nonLinear = false,
  onStepClick,
  className = '',
}: StepperProps) {
  // Filter and validate children
  const steps = React.Children.toArray(children).filter(
    (step) => React.isValidElement(step) && step.type === Step
  ) as React.ReactElement[];
  
  // Determine size classes for connector
  const sizeConfig = {
    sm: {
      connector: 'w-full h-0.5',
    },
    md: {
      connector: 'w-full h-0.5',
    },
    lg: {
      connector: 'w-full h-1',
    },
  }[size];
  
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
        ${className}
      `}
      role="navigation"
      aria-label="Progress"
    >
      {steps.map((step, index) => {
        // Determine step status
        let status: StepStatus = 'upcoming';
        if (index < activeStep) {
          status = 'completed';
        } else if (index === activeStep) {
          status = 'current';
        }
        
        // Clone step with additional props
        const enhancedStep = React.cloneElement(step, {
          status,
          index,
          isLastStep: index === steps.length - 1,
          orientation,
          size,
          variant,
          clickable: nonLinear,
          onClick: () => onStepClick?.(index),
        });
        
        return (
          <React.Fragment key={index}>
            {/* Step */}
            <div
              className={`
                ${orientation === 'horizontal' ? 'flex-1' : ''}
                ${alternativeLabel && index % 2 === 1 ? 'mt-8' : ''}
              `}
            >
              {enhancedStep}
            </div>
            
            {/* Connector */}
            {connector && index < steps.length - 1 && (
              <div
                className={`
                  ${orientation === 'horizontal' ? 'flex-1 flex items-center' : 'ml-4'}
                  ${alternativeLabel && orientation === 'horizontal' ? 'mt-4' : ''}
                `}
              >
                <div
                  className={`
                    ${sizeConfig.connector}
                    ${index < activeStep ? 'bg-blue-500' : 'bg-gray-300'}
                    ${orientation === 'horizontal' ? 'w-full' : 'h-full w-0.5 ml-4'}
                  `}
                  style={orientation === 'vertical' ? { height: '24px' } : undefined}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}