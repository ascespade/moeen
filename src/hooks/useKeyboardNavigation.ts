import { _useEffect, useCallback } from "react";

export function __useKeyboardNavigation() {
  const __handleKeyDown = useCallback((_event: KeyboardEvent) => {
    // Global keyboard shortcuts
    switch (event.key) {
      case "/":
        if (!event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          // Focus search input
          const __searchInput = document.querySelector(
            '[data-testid="search-input"]',
          ) as HTMLInputElement;
          searchInput?.focus();
        }
        break;

      case "Escape":
        // Close modals, dropdowns, etc.
        const __activeModal = document.querySelector(
          '[data-testid="modal"]:not([hidden])',
        );
        if (activeModal) {
          const __closeButton = activeModal.querySelector(
            '[data-testid="close-button"]',
          ) as HTMLButtonElement;
          closeButton?.click();
        }
        break;

      case "Enter":
        // Handle Enter key for custom elements
        if (
          event.target instanceof HTMLElement &&
          event.target.dataset.keyboardAction === "click"
        ) {
          event.preventDefault();
          event.target.click();
        }
        break;

      case "Tab":
        // Enhanced tab navigation
        if (event.shiftKey) {
          // Shift+Tab - focus previous element
          const __focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const __currentIndex = Array.from(focusableElements).indexOf(
            document.activeElement as Element,
          );
          if (currentIndex > 0) {
            (focusableElements[currentIndex - 1] as HTMLElement)?.focus();
          }
        } else {
          // Tab - focus next element
          const __focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          const __currentIndex = Array.from(focusableElements).indexOf(
            document.activeElement as Element,
          );
          if (currentIndex < focusableElements.length - 1) {
            (focusableElements[currentIndex + 1] as HTMLElement)?.focus();
          }
        }
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardNavigation;
