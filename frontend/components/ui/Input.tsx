import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type InputProps = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        ref={ref}
        className={clsx(
          "rippl-input",
          error && "border-red-400 focus:border-red-400 focus:ring-red-50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
