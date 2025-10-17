"use client";

import React, { useState } from "react";
import { useTheme } from "@/core/theme";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface ThemeSwitchProps {
  variant?: "button" | "dropdown" | "toggle";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ThemeSwitch({
  variant = "dropdown",
  size = "md",
  showLabel = true,
  className = "",
}: ThemeSwitchProps) {
  const { theme, setTheme, isDark, isLight, isSystem } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      value: "light" as const,
      label: "فاتح",
      icon: Sun,
      description: "الوضع الفاتح",
    },
    {
      value: "dark" as const,
      label: "داكن",
      icon: Moon,
      description: "الوضع الداكن",
    },
    {
      value: "system" as const,
      label: "النظام",
      icon: Monitor,
      description: "يتبع إعدادات النظام",
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme) ?? themes[0];
  const CurrentIcon = currentTheme?.icon ?? Sun;

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (variant === "button") {
    return (
      <Button
        onClick={() => {
          if (theme === "light") setTheme("dark");
          else if (theme === "dark") setTheme("system");
          else setTheme("light");
        }}
        variant="outline"
        size={size}
        className={`relative overflow-hidden ${className}`}
      >
        <CurrentIcon className={iconSizes[size]} />
        {showLabel && (
          <span className="mr-2 hidden sm:inline text-[var(--text-primary)]">{currentTheme?.label || 'Theme'}</span>
        )}
      </Button>
    );
  }

  if (variant === "toggle") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Sun className={`${iconSizes[size]} ${isLight ? "text-[var(--brand-primary)]" : "text-[var(--text-tertiary)]"}`} />
        <button
          onClick={() => {
            if (theme === "light") setTheme("dark");
            else if (theme === "dark") setTheme("system");
            else setTheme("light");
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 ${
            isDark ? "bg-[var(--brand-primary)]" : "bg-[var(--border-primary)]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-[var(--background)] transition-transform ${
              isDark ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <Moon className={`${iconSizes[size]} ${isDark ? "text-[var(--brand-accent)]" : "text-[var(--text-tertiary)]"}`} />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size={size}
        className="flex items-center space-x-2"
      >
        <CurrentIcon className={iconSizes[size]} />
        {showLabel && <span>{currentTheme?.label || 'Theme'}</span>}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full right-0 mt-2 w-48 z-20 shadow-lg border border-[var(--border-primary)] bg-[var(--panel)]">
            <div className="p-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[var(--surface-hover)] ${
                      isSelected ? "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]" : "text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={iconSizes[size]} />
                      <div className="text-right">
                        <div className="font-medium">{themeOption.label}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">{themeOption.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-[var(--brand-primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
