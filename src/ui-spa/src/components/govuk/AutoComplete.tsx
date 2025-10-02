import Autocomplete from "accessible-autocomplete/react";

type Props = {
  id: string;
  inputClasses?: string;
  defaultValue?: string;
  confirmOnBlur?: boolean;
  source: (query: string, populateResults: (results: string[]) => void) => void;
  onConfirm: (value: string) => void;
};
export const AutoComplete: React.FC<Props> = (props) => (
  <Autocomplete {...props} />
);
