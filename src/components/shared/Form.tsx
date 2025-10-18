"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;


export function FormField({
  label,
  error,
  required,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="mr-1 text-brand-error">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-brand-error dark:text-red-400">{error}</p>
      )}
    </div>
  );

interface FormGroupProps {
  children: ReactNode;
  className?: string;


export function FormGroup({ children, className = "" }: FormGroupProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;

interface FormRowProps {
  children: ReactNode;
  className?: string;


export function FormRow({ children, className = "" }: FormRowProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
      {children}
    </div>
  );

interface FormActionsProps {
  children: ReactNode;
  className?: string;


export function FormActions({ children, className = "" }: FormActionsProps) {
  return (
    <div
      className={`flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}}}}}}}}