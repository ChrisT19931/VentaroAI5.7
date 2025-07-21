import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

type ValidationRule<T> = {
  validate: (value: any, formValues: T) => boolean;
  message: string;
};

type FieldConfig<T> = {
  required?: boolean;
  requiredMessage?: string;
  validationRules?: ValidationRule<T>[];
};

type FormConfig<T> = {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
};

type FieldErrors<T> = Partial<Record<keyof T, string>>;

type FormState<T> = {
  values: T;
  errors: FieldErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
};

type FormHandlers<T> = {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, isTouched: boolean) => void;
  resetForm: () => void;
};

type FieldProps<T> = {
  name: keyof T;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
};

type UseFormReturn<T> = {
  formState: FormState<T>;
  handleChange: FormHandlers<T>['handleChange'];
  handleBlur: FormHandlers<T>['handleBlur'];
  handleSubmit: FormHandlers<T>['handleSubmit'];
  setFieldValue: FormHandlers<T>['setFieldValue'];
  setFieldError: FormHandlers<T>['setFieldError'];
  setFieldTouched: FormHandlers<T>['setFieldTouched'];
  resetForm: FormHandlers<T>['resetForm'];
  getFieldProps: (fieldName: keyof T) => FieldProps<T>;
};

/**
 * Custom hook for managing form state, validation, and submission
 * @param config Form configuration object
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  config: FormConfig<T>
): UseFormReturn<T> {
  const {
    initialValues,
    onSubmit,
    validate,
    validateOnChange = true,
    validateOnBlur = true,
  } = config;

  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  // Validate the entire form
  const validateForm = useCallback(() => {
    if (!validate) return {};

    const errors = validate(formState.values);
    const isValid = Object.keys(errors).length === 0;

    setFormState(prev => ({
      ...prev,
      errors,
      isValid,
    }));

    return errors;
  }, [formState.values, validate]);

  // Handle field change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;

      setFormState(prev => {
        const newValues = { ...prev.values, [name]: fieldValue };
        const newState = {
          ...prev,
          values: newValues,
        };

        // Validate on change if enabled
        if (validateOnChange && validate) {
          const errors = validate(newValues);
          newState.errors = errors;
          newState.isValid = Object.keys(errors).length === 0;
        }

        return newState;
      });
    },
    [validate, validateOnChange]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;

      setFormState(prev => {
        const newTouched = { ...prev.touched, [name]: true };
        const newState = {
          ...prev,
          touched: newTouched,
        };

        // Validate on blur if enabled
        if (validateOnBlur && validate) {
          const errors = validate(prev.values);
          newState.errors = errors;
          newState.isValid = Object.keys(errors).length === 0;
        }

        return newState;
      });
    },
    [validate, validateOnBlur]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Mark all fields as touched
      const touchedFields = Object.keys(formState.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );

      setFormState(prev => ({
        ...prev,
        touched: touchedFields as Partial<Record<keyof T, boolean>>,
        isSubmitting: true,
      }));

      // Validate before submission
      const errors = validate ? validate(formState.values) : {};
      const isValid = Object.keys(errors).length === 0;

      if (!isValid) {
        setFormState(prev => ({
          ...prev,
          errors,
          isValid,
          isSubmitting: false,
        }));
        return;
      }

      try {
        await onSubmit(formState.values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
        }));
      }
    },
    [formState.values, onSubmit, validate]
  );

  // Set a field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const newState = {
        ...prev,
        values: newValues,
      };

      // Validate if needed
      if (validateOnChange && validate) {
        const errors = validate(newValues);
        newState.errors = errors;
        newState.isValid = Object.keys(errors).length === 0;
      }

      return newState;
    });
  }, [validate, validateOnChange]);

  // Set a field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: false,
    }));
  }, []);

  // Set a field's touched state programmatically
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: isTouched },
    }));
  }, []);

  // Reset the form to its initial state
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  // Get props for a field
  const getFieldProps = useCallback(
    (fieldName: keyof T): FieldProps<T> => ({
      name: fieldName,
      value: formState.values[fieldName],
      onChange: handleChange,
      onBlur: handleBlur,
      error: formState.errors[fieldName],
      touched: formState.touched[fieldName],
    }),
    [formState, handleChange, handleBlur]
  );

  return {
    formState,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    getFieldProps,
  };
}