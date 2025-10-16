import { _useRef, useEffect } from "react";
// Previous value hook

export const __usePrevious = <T>(_value: T): T | undefined => {
  const __ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
