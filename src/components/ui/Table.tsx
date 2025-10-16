import clsx from "clsx";

export function __Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx("min-w-full text-sm", className)} {...props} />
    </div>
  );
}

export function __THead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={clsx("bg-gray-50 dark:bg-gray-800", className)}
      {...props}
    />
  );
}

export function __TBody({
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

export function __TR({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx("hover:bg-gray-50 dark:hover:bg-gray-800", className)}
      {...props}
    />
  );
}

export function __TH({
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

export function __TD({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx("px-4 py-3", className)} {...props} />;
}

export default Table;
