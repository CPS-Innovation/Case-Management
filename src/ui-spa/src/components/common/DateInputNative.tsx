import React, { forwardRef } from "react";
import styles from "./DateInputNative.module.scss";
type DateInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  label: React.ReactNode;
  errorMessage?: string;
  id: string;
};

const DateInputNative = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, errorMessage, ...props }, ref) => {
    return (
      <div
        className={`govuk-form-group ${styles.dateInputWrapper} ${errorMessage ? "govuk-form-group--error" : ""}`}
      >
        <label className="govuk-label" htmlFor={props.id}>
          {props.label}
        </label>
        {errorMessage && (
          <p
            className="govuk-error-message"
            data-testid={`${props.id}-error-text`}
          >
            <span className="govuk-visually-hidden">Error: </span>
            {errorMessage}
          </p>
        )}
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
