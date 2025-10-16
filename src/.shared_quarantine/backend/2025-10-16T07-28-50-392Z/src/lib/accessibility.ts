// Accessibility utilities for users with special needs
export interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "extra-large";
  contrast: "normal" | "high" | "extra-high";
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  colorBlindSupport: boolean;
  dyslexiaSupport: boolean;
  language: "ar" | "en";
}

export class AccessibilityManager {
  private settings: AccessibilitySettings;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.settings = this.loadSettings();
    this.applySettings();
    this.setupEventListeners();
  }

  // Load settings from localStorage or use defaults
  private loadSettings(): AccessibilitySettings {
    if (typeof window === "undefined") {
      return this.getDefaultSettings();
    }

    const __saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      } catch (error) {}
    }

    return this.getDefaultSettings();
  }

  private getDefaultSettings(): AccessibilitySettings {
    return {
      fontSize: "medium",
      contrast: "normal",
      screenReader: false,
      keyboardNavigation: true,
      voiceControl: false,
      reducedMotion: false,
      focusIndicators: true,
      colorBlindSupport: false,
      dyslexiaSupport: false,
      language: "ar",
    };
  }

  // Save settings to localStorage
  private saveSettings(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        "accessibility-settings",
        JSON.stringify(this.settings),
      );
    } catch (error) {}
  }

  // Apply accessibility settings to the DOM
  private applySettings(): void {
    if (typeof window === "undefined") return;

    const __root = document.documentElement;

    // Font size
    const __fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
      "extra-large": "20px",
    };
    root.style.setProperty(
      "--base-font-size",
      fontSizeMap[this.settings.fontSize],
    );

    // Contrast
    if (this.settings.contrast === "high") {
      root.classList.add("high-contrast");
    } else if (this.settings.contrast === "extra-high") {
      root.classList.add("extra-high-contrast");
    } else {
      root.classList.remove("high-contrast", "extra-high-contrast");
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Focus indicators
    if (this.settings.focusIndicators) {
      root.classList.add("focus-indicators");
    } else {
      root.classList.remove("focus-indicators");
    }

    // Color blind support
    if (this.settings.colorBlindSupport) {
      root.classList.add("color-blind-support");
    } else {
      root.classList.remove("color-blind-support");
    }

    // Dyslexia support
    if (this.settings.dyslexiaSupport) {
      root.classList.add("dyslexia-support");
    } else {
      root.classList.remove("dyslexia-support");
    }

    // Screen reader support
    if (this.settings.screenReader) {
      root.classList.add("screen-reader-mode");
    } else {
      root.classList.remove("screen-reader-mode");
    }

    // Language direction
    root.setAttribute("dir", this.settings.language === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", this.settings.language);
  }

  // Setup event listeners for accessibility features
  private setupEventListeners(): void {
    if (typeof window === "undefined") return;

    // Keyboard navigation
    if (this.settings.keyboardNavigation) {
      document.addEventListener(
        "keydown",
        this.handleKeyboardNavigation.bind(this),
      );
    }

    // Voice control
    if (this.settings.voiceControl) {
      this.setupVoiceControl();
    }

    // Focus management
    document.addEventListener("focusin", this.handleFocusIn.bind(this));
    document.addEventListener("focusout", this.handleFocusOut.bind(this));
  }

  // Handle keyboard navigation
  private handleKeyboardNavigation(_event: KeyboardEvent): void {
    // Skip links
    if (event.key === "Tab" && event.shiftKey === false) {
      this.announceToScreenReader("انتقل إلى العنصر التالي");
    } else if (event.key === "Tab" && event.shiftKey === true) {
      this.announceToScreenReader("انتقل إلى العنصر السابق");
    }

    // Escape key
    if (event.key === "Escape") {
      this.announceToScreenReader("إغلاق");
    }

    // Enter key
    if (event.key === "Enter" || event.key === " ") {
      const __target = event.target as HTMLElement;
      if (target && target.getAttribute("role") === "button") {
        this.announceToScreenReader("تم الضغط على الزر");
      }
    }
  }

  // Setup voice control
  private setupVoiceControl(): void {
    if (typeof window === "undefined") return;

    // This would integrate with Web Speech API
    // For now, we'll just set up the basic structure
  }

  // Handle focus events
  private handleFocusIn(_event: FocusEvent): void {
    const __target = event.target as HTMLElement;
    if (target) {
      // Announce focused element to screen reader
      const __ariaLabel = target.getAttribute("aria-label");
      const __textContent = target.textContent?.trim();
      const __role = target.getAttribute("role");

      if (ariaLabel) {
        this.announceToScreenReader(ariaLabel);
      } else if (textContent) {
        this.announceToScreenReader(textContent);
      } else if (role) {
        this.announceToScreenReader(`عنصر ${role}`);
      }

      // Add focus indicator
      target.classList.add("focused");
    }
  }

  private handleFocusOut(_event: FocusEvent): void {
    const __target = event.target as HTMLElement;
    if (target) {
      target.classList.remove("focused");
    }
  }

  // Announce text to screen reader
  private announceToScreenReader(_text: string): void {
    if (typeof window === "undefined") return;

    const __announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = text;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Update settings
  updateSettings(_newSettings: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applySettings();
    this.notifyListeners("settingsChanged", this.settings);
  }

  // Get current settings
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  // Add event listener
  addEventListener(_event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  removeEventListener(_event: string, callback: Function): void {
    const __listeners = this.listeners.get(event);
    if (listeners) {
      const __index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Notify listeners
  private notifyListeners(_event: string, data: unknown): void {
    const __listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  // Accessibility helpers
  static addAriaLabels(_element: HTMLElement, label: string): void {
    element.setAttribute("aria-label", label);
  }

  static addAriaDescribedBy(
    _element: HTMLElement,
    descriptionId: string,
  ): void {
    element.setAttribute("aria-describedby", descriptionId);
  }

  static addRole(_element: HTMLElement, role: string): void {
    element.setAttribute("role", role);
  }

  static addTabIndex(_element: HTMLElement, index: number): void {
    element.setAttribute("tabindex", index.toString());
  }

  static makeFocusable(_element: HTMLElement): void {
    element.setAttribute("tabindex", "0");
  }

  static addKeyboardHandler(
    element: HTMLElement,
    handler: (_event: KeyboardEvent) => void,
  ): void {
    element.addEventListener("keydown", handler);
  }

  // Color contrast utilities
  static getContrastRatio(_color1: string, color2: string): number {
    // This would calculate the contrast ratio between two colors
    // For now, return a placeholder value
    return 4.5;
  }

  static isHighContrast(_color1: string, color2: string): boolean {
    return this.getContrastRatio(color1, color2) >= 4.5;
  }

  // Font size utilities
  static getFontSizeMultiplier(_fontSize: string): number {
    const __multipliers = {
      small: 0.875,
      medium: 1,
      large: 1.125,
      "extra-large": 1.25,
    };
    return multipliers[fontSize as keyof typeof multipliers] || 1;
  }

  // Language utilities
  static isRTL(_language: string): boolean {
    const __rtlLanguages = ["ar", "he", "fa", "ur"];
    return rtlLanguages.includes(language);
  }

  static getTextDirection(_language: string): "ltr" | "rtl" {
    return this.isRTL(language) ? "rtl" : "ltr";
  }
}

// Global accessibility manager instance
export const __accessibilityManager = new AccessibilityManager();

// React hook for accessibility
export function __useAccessibility() {
  const [settings, setSettings] = React.useState(
    accessibilityManager.getSettings(),
  );

  React.useEffect(() => {
    const __handleSettingsChange = (_newSettings: AccessibilitySettings) => {
      setSettings(newSettings);
    };

    accessibilityManager.addEventListener(
      "settingsChanged",
      handleSettingsChange,
    );

    return () => {
      accessibilityManager.removeEventListener(
        "settingsChanged",
        handleSettingsChange,
      );
    };
  }, []);

  const __updateSettings = (_newSettings: Partial<AccessibilitySettings>) => {
    accessibilityManager.updateSettings(newSettings);
  };

  return { settings, updateSettings };
}

// Import React for the hook
import React from "react";
