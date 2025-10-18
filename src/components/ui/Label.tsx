export function Label({
import clsx from "clsx";

  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={clsx("form-label", className)} {...props} />;
}

export default Label;
