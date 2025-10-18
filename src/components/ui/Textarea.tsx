import clsx from 'clsx';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Extends all textarea attributes
}

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={clsx('form-input', className)} {...props} />;
}

export default Textarea;
