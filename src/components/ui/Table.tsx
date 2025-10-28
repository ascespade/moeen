import clsx from 'clsx';

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className='overflow-x-auto'>
      <table className={clsx('min-w-full text-sm', className)} {...props} />
    </div>
  );
}

export function THead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={clsx('bg-surface dark:bg-gray-800', className)}
      {...props}
    />
  );
}

export function TBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={clsx('divide-y divide-default-border', className)}
      {...props}
    />
  );
}

export function TR({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx('hover:bg-surface dark:hover:bg-gray-800', className)}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        'px-4 py-3 text-start font-semibold text-gray-700 dark:text-gray-200 border-b border-default-border',
        className
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={clsx('px-4 py-3', className)} {...props} />;
}

export default Table;
