import { _useState, useCallback } from "react";
// Toggle hooks

export const __useToggle = (
  initialValue: boolean = false,
): [boolean, () => void, (_value: boolean) => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const __toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const __setToggle = useCallback((_newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
};

export const __useBoolean = (_initialValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const __setTrue = useCallback(() => setValue(true), []);
  const __setFalse = useCallback(() => setValue(false), []);
  const __toggle = useCallback(() => setValue((prev) => !prev), []);
  const __setBoolean = useCallback(
    (_newValue: boolean) => setValue(newValue),
    [],
  );

  return {
    value,
    setTrue,
    setFalse,
    toggle,
    setValue: setBoolean,
  };
};
