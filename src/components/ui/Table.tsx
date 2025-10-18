import clsx from "clsx";

  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx("min-w-full text-sm", className)} {...props} />
    </div>
  );
}

  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={clsx("bg-surface dark:bg-gray-800", className)}
      {...props}
    />
  );
}

  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={clsx("divide-y divide-brand-border", className)}
      {...props}
    />
  );
}

  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx("hover:bg-surface dark:hover:bg-gray-800", className)}
      {...props}
    />
  );
}

  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-start font-semibold text-gray-700 dark:text-gray-200 border-b border-brand-border",
        className,
      )}
      {...props}
    />
  );
}

  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx("px-4 py-3", className)} {...props} />;
}



// Exports
export function Table({
export function THead({
export function TBody({
export function TR({
export function TH({
export function TD({
export default Table;