import * as GDS from "govuk-react-jsx";
import React from "react";

type Props = {
  rows: {
    key: { children: React.ReactNode };
    value?: { children: React.ReactNode };
    actions?: {
      items: {
        children: React.ReactNode;
        to?: string;
        visuallyHiddenText?: string;
        onClick?: () => void;
      }[];
    };
  }[];
};
export const SummaryList: React.FC<Props> = (props) => (
  <GDS.SummaryList {...props} />
);
