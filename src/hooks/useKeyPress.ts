import { _useEffect, useCallback } from "react";
// Key press hooks

export const __useKeyPress = (
  targetKey: string | string[],
  handler: (_event: KeyboardEvent) => void,
  options: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    enabled?: boolean;
  } = {},
) => {
  const {
    preventDefault = false,
    stopPropagation = false,
    enabled = true,
  } = options;

  const __handleKeyPress = useCallback(
    (_event: KeyboardEvent) => {
      if (!enabled) return;

      const __keys = Array.isArray(targetKey) ? targetKey : [targetKey];
      const __isTargetKey = keys.includes(event.key) || keys.includes(event.code);

      if (isTargetKey) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        handler(event);
      }
    },
    [targetKey, handler, preventDefault, stopPropagation, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress, enabled]);
};

export const __useEscapeKey = (_handler: () => void, enabled: boolean = true) => {
  useKeyPress("Escape", handler, { enabled });
};

export const __useEnterKey = (_handler: () => void, enabled: boolean = true) => {
  useKeyPress("Enter", handler, { enabled });
};

export const __useArrowKeys = (
  handler: (_direction: "up" | "down" | "left" | "right") => void,
  enabled: boolean = true,
) => {
  const __handleArrowKey = useCallback(
    (_event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case "ArrowUp":
          handler("up");
          break;
        case "ArrowDown":
          handler("down");
          break;
        case "ArrowLeft":
          handler("left");
          break;
        case "ArrowRight":
          handler("right");
          break;
      }
    },
    [handler, enabled],
  );

  useKeyPress(
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    handleArrowKey,
    {
      enabled,
    },
  );
};

export const __useHotkey = (
  key: string,
  handler: () => void,
  options: {
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    enabled?: boolean;
  } = {},
) => {
  const {
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
    enabled = true,
  } = options;

  const __handleHotkey = useCallback(
    (_event: KeyboardEvent) => {
      if (!enabled) return;

      const __isTargetKey = event.key === key || event.code === key;
      const modifiersMatch =
        event.ctrlKey === ctrlKey &&
        event.altKey === altKey &&
        event.shiftKey === shiftKey &&
        event.metaKey === metaKey;

      if (isTargetKey && modifiersMatch) {
        event.preventDefault();
        handler();
      }
    },
    [key, handler, ctrlKey, altKey, shiftKey, metaKey, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleHotkey);

    return () => {
      document.removeEventListener("keydown", handleHotkey);
    };
  }, [handleHotkey, enabled]);
};
