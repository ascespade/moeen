import { useState, useEffect, ReactNode } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // in milliseconds
  onClose?: () => void;
}

export default function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: "bg-green-500 border-green-600",
    error: "bg-red-500 border-red-600",
    info: "bg-blue-500 border-blue-600",
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white border ${typeClasses[type]}`}>
      {message}
    </div>
  );
}

