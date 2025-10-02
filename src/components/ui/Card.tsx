import clsx from "clsx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "card shadow-soft bg-[var(--panel)] border border-brand-border rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-4 py-3 border-b border-brand-border", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("px-4 py-3 border-t border-brand-border", className)} {...props} />;
}

export default Card;

