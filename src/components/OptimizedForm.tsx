'use client';

import { useState, useRef, useCallback, memo, FormEvent, ReactNode } from 'react';
import { useStableCallback } from '../utils/react-optimizer';
import useComponentOptimizer from '../hooks/useComponentOptimizer';

interface FormField {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  validate?: (value: string, formValues: Record<string, string>) => string | undefined;
}

interface OptimizedFormProps {
  /** Initial form values */
  initialValues: Record<string, string>;
  /** Form validation schema */
  validationSchema?: Record<string, (value: string, formValues: Record<string, string>) => string | undefined>;
  /** Callback when form is submitted */
  onSubmit: (values: Record<string, string>, isValid: boolean) => void | Promise<void>;
  /** Callback when form values change */
  onChange?: (values: Record<string, string>, isValid: boolean) => void;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on submit */
  validateOnSubmit?: boolean;
  /** Whether to disable the form while submitting */
  disableWhileSubmitting?: boolean;
  /** Whether to reset the form after successful submission */
  resetAfterSubmit?: boolean;
  /** Custom class name for the form */
  className?: string;
  /** Custom style for the form */
  style?: React.CSSProperties;
  /** Form children */
  children: ReactNode | ((formProps: OptimizedFormRenderProps) => ReactNode);
}

interface OptimizedFormRenderProps {
  /** Current form values */
  values: Record<string, string>;
  /** Form errors */
  errors: Record<string, string>;
  /** Touched fields */
  touched: Record<string, boolean>;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether the form is valid */
  isValid: boolean;
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Function to handle input change */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Function to handle input blur */
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Function to set a field value */
  setFieldValue: (name: string, value: string) => void;
  /** Function to set a field error */
  setFieldError: (name: string, error: string) => void;
  /** Function to set a field as touched */
  setFieldTouched: (name: string, touched?: boolean) => void;
  /** Function to reset the form */
  resetForm: () => void;
  /** Function to validate the form */
  validateForm: () => boolean;
  /** Function to submit the form */
  submitForm: () => void;
}

/**
 * OptimizedForm - A high-performance form component with validation and optimization
 */
const OptimizedForm = memo(function OptimizedForm({
  initialValues,
  validationSchema = {},
  onSubmit,
  onChange,
  validateOnBlur = true,
  validateOnChange = false,
  validateOnSubmit = true,
  disableWhileSubmitting = true,
  resetAfterSubmit = false,
  className = '',
  style = {},
  children,
}: OptimizedFormProps) {
  // Use component optimizer for performance monitoring
  useComponentOptimizer('OptimizedForm', {
    optimizeJavaScript: true,
  });
  
  // Form state
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Create stable callbacks
  const stableOnSubmit = useStableCallback(onSubmit);
  const stableOnChange = useStableCallback(onChange || (() => {}));
  
  // Track form validity
  const isValid = Object.keys(errors).length === 0;
  
  // Validate a single field
  const validateField = useCallback((name: string, value: string): string | undefined => {
    const validator = validationSchema[name];
    if (!validator) return undefined;
    
    return validator(value, values);
  }, [validationSchema, values]);
  
  // Validate the entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    return !hasErrors;
  }, [validateField, values]);
  
  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    
    if (validateOnChange) {
      const error = validateField(name, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error || '',
      }));
    }
    
    // Call onChange callback
    const newValues = { ...values, [name]: value };
    const newIsValid = validateOnChange ? Object.keys(errors).filter(key => key !== name).length === 0 && !validateField(name, value) : isValid;
    
    stableOnChange(newValues, newIsValid);
  }, [validateOnChange, validateField, values, errors, isValid, stableOnChange]);
  
  // Handle input blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
    
    if (validateOnBlur) {
      const error = validateField(name, values[name]);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error || '',
      }));
    }
  }, [validateOnBlur, validateField, values]);
  
  // Set a field value
  const setFieldValue = useCallback((name: string, value: string) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    
    if (validateOnChange) {
      const error = validateField(name, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: error || '',
      }));
    }
    
    // Call onChange callback
    const newValues = { ...values, [name]: value };
    const newIsValid = validateOnChange ? Object.keys(errors).filter(key => key !== name).length === 0 && !validateField(name, value) : isValid;
    
    stableOnChange(newValues, newIsValid);
  }, [validateOnChange, validateField, values, errors, isValid, stableOnChange]);
  
  // Set a field error
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);
  
  // Set a field as touched
  const setFieldTouched = useCallback((name: string, isTouched: boolean = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched,
    }));
  }, []);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  }, [initialValues]);
  
  // Submit the form
  const submitForm = useCallback(async () => {
    setIsSubmitted(true);
    
    // Validate the form if needed
    const formIsValid = validateOnSubmit ? validateForm() : isValid;
    
    if (formIsValid || !validateOnSubmit) {
      setIsSubmitting(true);
      
      try {
        await stableOnSubmit(values, formIsValid);
        
        if (resetAfterSubmit) {
          resetForm();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validateOnSubmit, validateForm, isValid, stableOnSubmit, values, resetAfterSubmit, resetForm]);
  
  // Handle form submission
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  }, [submitForm]);
  
  // Create form render props
  const formProps: OptimizedFormRenderProps = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isSubmitted,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateForm,
    submitForm,
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className={`optimized-form ${className}`}
      style={style}
      noValidate
    >
      {typeof children === 'function' ? children(formProps) : children}
    </form>
  );
});

export default OptimizedForm;