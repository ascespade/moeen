// Form hooks
import { useState, useCallback, useRef, useEffect } from 'react';
import { validateForm } from '@/utils/validation';

interface FormField<T> {
    value: T;
    error?: string;
    touched: boolean;
}

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
    validationRules?: Partial<Record<keyof T, (value: any) => { isValid: boolean; error?: string }>>;
    onSubmit?: (values: T) => void | Promise<void>;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
}

export const useForm = <T extends Record<string, any>>(
    options: FormOptions<T>
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

    const initialValuesRef = useRef(initialValues);

    // Validate form
    const validate = useCallback(() => {
        if (Object.keys(validationRules).length === 0) {
            return { isValid: true, errors: {} };
        }

        return validateForm(state.values, validationRules);
    }, [state.values, validationRules]);

    // Update validation state
    useEffect(() => {
        const { isValid, errors } = validate();
        setState(prev => ({
            ...prev,
            isValid,
            errors,
        }));
    }, [validate]);

    // Check if form is dirty
    useEffect(() => {
        const isDirty = JSON.stringify(state.values) !== JSON.stringify(initialValuesRef.current);
        setState(prev => ({ ...prev, isDirty }));
    }, [state.values]);

    // Set field value
    const setFieldValue = useCallback(
        (field: keyof T, value: any) => {
            setState(prev => ({
                ...prev,
                values: { ...prev.values, [field]: value },
                touched: { ...prev.touched, [field]: true },
            }));
        },
        []
    );

    // Set field error
    const setFieldError = useCallback((field: keyof T, error: string) => {
        setState(prev => ({
            ...prev,
            errors: { ...prev.errors, [field]: error },
        }));
    }, []);

    // Clear field error
    const clearFieldError = useCallback((field: keyof T) => {
        setState(prev => {
            const { [field]: _, ...errors } = prev.errors;
            return { ...prev, errors };
        });
    }, []);

    // Set field touched
    const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
        setState(prev => ({
            ...prev,
            touched: { ...prev.touched, [field]: touched },
        }));
    }, []);

    // Handle field change
    const handleChange = useCallback(
        (field: keyof T) => (value: any) => {
            setFieldValue(field, value);

            if (validateOnChange) {
                const rule = validationRules[field as keyof typeof validationRules];
                if (rule) {
                    const result = rule(value);
                    if (!result.isValid) {
                        setFieldError(field, result.error || 'Invalid value');
                    } else {
                        clearFieldError(field);
                    }
                }
            }
        },
        [setFieldValue, setFieldError, clearFieldError, validationRules, validateOnChange]
    );

    // Handle field blur
    const handleBlur = useCallback(
        (field: keyof T) => () => {
            setFieldTouched(field);

            if (validateOnBlur) {
                const rule = validationRules[field as keyof typeof validationRules];
                if (rule) {
                    const result = rule(state.values[field]);
                    if (!result.isValid) {
                        setFieldError(field, result.error || 'Invalid value');
                    } else {
                        clearFieldError(field);
                    }
                }
            }
        },
        [setFieldTouched, setFieldError, clearFieldError, validationRules, validateOnBlur, state.values]
    );

    // Reset form
    const reset = useCallback(() => {
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
    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();

            if (!onSubmit) return;

            setState(prev => ({ ...prev, isSubmitting: true }));

            try {
                await onSubmit(state.values);
            } catch (error) {
                console.error('Form submission error:', error);
            } finally {
                setState(prev => ({ ...prev, isSubmitting: false }));
            }
        },
        [onSubmit, state.values]
    );

    // Get field props
    const getFieldProps = useCallback(
        (field: keyof T) => ({
            value: state.values[field],
            onChange: handleChange(field),
            onBlur: handleBlur(field),
            error: state.errors[field],
            touched: state.touched[field],
        }),
        [state.values, state.errors, state.touched, handleChange, handleBlur]
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
