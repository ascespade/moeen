import clsx from "clsx";

export function __Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx("form-label", className)} {...props} />;
}

export default Label;
