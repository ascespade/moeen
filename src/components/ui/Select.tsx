import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  children: React.ReactNode;
}

export function Select({
  value,
  onValueChange,
  defaultValue,
  disabled = false,
  placeholder = "Select an option...",
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || "",
  );
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <SelectTrigger
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        placeholder={placeholder}
        value={selectedValue}
      />
      {isOpen && <SelectContent>{children}</SelectContent>}
    </div>
  );
}

export function SelectTrigger({
  onClick,
  disabled,
  placeholder,
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
  value?: string;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "form-input flex h-10 w-full items-center justify-between cursor-pointer",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className={clsx(!value && "text-gray-400")}>
        {value || placeholder}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[var(--brand-border)] bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:text-gray-100",
        className,
      )}
      {...props}
    />
  );
}

export function SelectItem({
  value,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
}) {
  return (
    <div
      className={clsx(
        "relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary)] focus:bg-[var(--brand-surface)] focus:text-[var(--brand-primary)] focus:outline-none dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-[var(--brand-primary)] dark:focus:bg-gray-800 dark:focus:text-[var(--brand-primary)]",
        className,
      )}
      onClick={() => {
        // This will be handled by the parent Select component
        const event = new CustomEvent("select-item", { detail: { value } });
        document.dispatchEvent(event);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Select;
