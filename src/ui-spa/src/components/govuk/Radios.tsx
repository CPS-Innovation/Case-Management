import * as GDS from "govuk-react-jsx";

type RadioItemOption = {
  id?: string;
  reactListKey?: string;
  value: string | undefined;
  children: React.ReactNode;
  conditional?: { children: React.ReactNode[] };
  disabled?: boolean; // disabling only children not parent takes effect
  "data-testid"?: string;
};
type RadioItemDivider = {
  divider: string;
  reactListKey?: string;
  value?: string;
};

type RadioItem = RadioItemOption | RadioItemDivider;

export type RadiosProps = {
  fieldset?: {
    legend: {
      children: React.ReactNode;
      className?: string;
      isPageHeading?: boolean;
    };
  };
  hint?: {
    children: React.ReactNode;
  };
  errorMessage?: {
    className?: string;
    children: React.ReactNode;
  };
  className?: string;
  value: string | undefined;
  name?: string;
  items: RadioItem[];
  onChange?: (value: string | undefined) => void;
};

export const Radios: React.FC<RadiosProps> = ({
  items,
  onChange: propOnChange,
  ...props
}) => {
  const processedItems = items.map((item) => ({
    ...item,
    reactListKey: item.reactListKey || item?.value,
  }));

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (propOnChange) {
      propOnChange(event.target.value);
    }
  };

  return <GDS.Radios items={processedItems} onChange={onChange} {...props} />;
};
