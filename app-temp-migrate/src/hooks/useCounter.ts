// Counter hooks
import { useState, useCallback } from 'react';

export const useCounter = (
    initialValue: number = 0,
    options: {
        min?: number;
        max?: number;
        step?: number;
    } = {}
) => {
    const { min = -Infinity, max = Infinity, step = 1 } = options;

    const [count, setCount] = useState<number>(initialValue);

    const increment = useCallback(() => {
        setCount(prev => Math.min(prev + step, max));
    }, [step, max]);

    const decrement = useCallback(() => {
        setCount(prev => Math.max(prev - step, min));
    }, [step, min]);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    const setValue = useCallback((value: number) => {
        setCount(Math.min(Math.max(value, min), max));
    }, [min, max]);

    const isAtMin = count <= min;
    const isAtMax = count >= max;

    return {
        count,
        increment,
        decrement,
        reset,
        setValue,
        isAtMin,
        isAtMax,
    };
};
