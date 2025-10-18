import { useEffect, useCallback } from "react";
// Key press hooks
  targetKey: string | string[],
  handler: (event: KeyboardEvent) => void,
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
  let handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      let keys = Array.isArray(targetKey) ? targetKey : [targetKey];
      let isTargetKey = keys.includes(event.key) || keys.includes(event.code);
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
  useKeyPress("Escape", handler, { enabled });
};
  useKeyPress("Enter", handler, { enabled });
};
  handler: (direction: "up" | "down" | "left" | "right") => void,
  enabled: boolean = true,
) => {
  let handleArrowKey = useCallback(
    (event: KeyboardEvent) => {
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
  let handleHotkey = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      let isTargetKey = event.key === key || event.code === key;
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
// Exports
export let useKeyPress = (
export let useEscapeKey = (handler: () => void, enabled: boolean = true) => {
export let useEnterKey = (handler: () => void, enabled: boolean = true) => {
export let useArrowKeys = (
export let useHotkey = (