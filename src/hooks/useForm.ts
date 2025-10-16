import { _useState, useCallback, useRef, useEffect } from "react";

import { _validateForm } from "@/utils/validation";
// Form hooks

// removed unused FormField interface

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface FormOptions<T> {
  initialValues: T;
  validationRules?: Partial<
    Record<keyof T, (_value: unknown) => { isValid: boolean; error?: string }>
  >;
  onSubmit?: (_values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export const __useForm = <T extends Record<string, unknown>>(
  options: FormOptions<T>,
) => {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
  } = options;

  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false,
    isDirty: false,
  });

  const __initialValuesRef = useRef(initialValues);

  // Validate form
  const __validate = useCallback(() => {
    if (Object.keys(validationRules).length === 0) {
      return { isValid: true, errors: {} };
    }

    const __rules = validationRules as Record<
      keyof T,
      (_value: unknown) => { isValid: boolean; error?: string }
    >;
    return validateForm(state.values, rules);
  }, [state.values, validationRules]);

  // Update validation state
  useEffect(() => {
    const { isValid, errors } = validate();
    setState((prev) => ({
      ...prev,
      isValid,
      errors,
    }));
  }, [validate]);

  // Check if form is dirty
  useEffect(() => {
    const isDirty =
      JSON.stringify(state.values) !== JSON.stringify(initialValuesRef.current);
    setState((prev) => ({ ...prev, isDirty }));
  }, [state.values]);

  // Set field value
  const __setFieldValue = useCallback((_field: keyof T, value: unknown) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      touched: { ...prev.touched, [field]: true },
    }));
  }, []);

  // Set field error
  const __setFieldError = useCallback((_field: keyof T, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  // Clear field error
  const __clearFieldError = useCallback((_field: keyof T) => {
    setState((prev) => {
      const newErrors: Partial<Record<keyof T, string>> = { ...prev.errors };
      // Remove the error for this field if it exists
      delete (newErrors as Record<string, string>)[field as string];
      return { ...prev, errors: newErrors } as typeof prev;
    });
  }, []);

  // Set field touched
  const __setFieldTouched = useCallback(
    (_field: keyof T, touched: boolean = true) => {
      setState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: touched },
      }));
    },
    [],
  );

  // Handle field change
  const __handleChange = useCallback(
    (_field: keyof T) => (_value: unknown) => {
      setFieldValue(field, value);

      if (validateOnChange) {
        const __rule = validationRules[
          field as keyof typeof validationRules
        ] as
          | ((_value: unknown) => { isValid: boolean; error?: string })
          | undefined;
        if (typeof rule === "function") {
          const __result = rule(value);
          if (!result.isValid) {
            setFieldError(field, result.error || "Invalid value");
          } else {
            clearFieldError(field);
          }
        }
      }
    },
    [
      setFieldValue,
      setFieldError,
      clearFieldError,
      validationRules,
      validateOnChange,
    ],
  );

  // Handle field blur
  const __handleBlur = useCallback(
    (_field: keyof T) => () => {
      setFieldTouched(field);

      if (validateOnBlur) {
        const __rule = validationRules[
          field as keyof typeof validationRules
        ] as
          | ((_value: unknown) => { isValid: boolean; error?: string })
          | undefined;
        if (typeof rule === "function") {
          const __result = rule(state.values[field]);
          if (!result.isValid) {
            setFieldError(field, result.error || "Invalid value");
          } else {
            clearFieldError(field);
          }
        }
      }
    },
    [
      setFieldTouched,
      setFieldError,
      clearFieldError,
      validationRules,
      validateOnBlur,
      state.values,
    ],
  );

  // Reset form
  const __reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false,
      isDirty: false,
    });
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  // Submit form
  const __handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!onSubmit) return;

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.values);
      } catch (error) {
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [onSubmit, state.values],
  );

  // Get field props
  const __getFieldProps = useCallback(
    (_field: keyof T) => ({
      value: state.values[field],
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: state.errors[field],
      touched: state.touched[field],
    }),
    [state.values, state.errors, state.touched, handleChange, handleBlur],
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    setFieldValue,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
  };
};
