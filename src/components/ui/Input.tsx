import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all input attributes
}

export function Input({ className, ...props }: InputProps) {
  return <input className={clsx("form-input", className)} {...props} />;
}

export default Input;
