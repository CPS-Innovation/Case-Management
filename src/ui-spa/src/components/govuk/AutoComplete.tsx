import Autocomplete from "accessible-autocomplete/react";
import styles from "./AutoComplete.module.scss";
type Props = {
  id: string;
  inputClasses?: string;
  errorMessage?: string;
  defaultValue?: string;
  confirmOnBlur?: boolean;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  source: (query: string, populateResults: (results: string[]) => void) => void;
  onConfirm: (value: string) => void;
};
export const AutoComplete: React.FC<Props> = (props) => (
  <div
    className={`${styles.autoCompleteWrapper} govuk-form-group  ${props.errorMessage ? "govuk-form-group--error" : ""}`}
  >
    {props.errorMessage && (
      <p className="govuk-error-message" data-testid={`${props.id}-error-text`}>
        <span className="govuk-visually-hidden">Error: </span>
        {props.errorMessage}
      </p>
    )}
    <Autocomplete {...props} />
  </div>
);
