import { useState, useCallback } from "react";

// Toggle hooks

export const useToggle = (
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
};

export const useBoolean = (initialValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setBoolean = useCallback((newValue: boolean) => setValue(newValue), []);

  return {
    value,
    setTrue,
    setFalse,
    toggle,
    setValue: setBoolean,
  };
};
