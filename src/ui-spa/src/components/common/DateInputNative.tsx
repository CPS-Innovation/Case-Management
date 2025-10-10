import React, { forwardRef } from "react";
import styles from "./DateInputNative.module.scss";
type DateInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label: React.ReactNode;
  id: string;
};

const DateInputNative = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={`govuk-form-group ${styles.dateInputWrapper}`}>
        <label className="govuk-label" htmlFor={props.id}>
          {props.label}
        </label>
        <span className={` govuk-hint ${styles.govukHint}`}>
          For example, 17/5/2024
        </span>

        <input
          type="date"
          className={`govuk-input ${styles.dateInput} ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
DateInputNative.displayName = "DateInputNative";
export default DateInputNative;
