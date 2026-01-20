import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { getChargesSummaryListRows } from "./getChargesSummaryListRows";
import type { ChargesFormData } from "../../../../common/reducers/caseRegistrationReducer";

const renderRows = (rows: ReturnType<typeof getChargesSummaryListRows>) => {
  const flat = rows.flat();
  const nodes = flat.map((r, i) => (
    <div key={i} data-testid={`row-${i}`}>
      <div data-testid={`row-${i}-key`}>{r.key.children}</div>
      <div data-testid={`row-${i}-value`}>{r.value.children}</div>
    </div>
  ));
  render(<div>{nodes}</div>);
};

describe("getChargesSummaryListRows", () => {
  it("shows correct values for the victim charge fields represented in rows", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "1990-06-26",
      addVictimRadio: "yes",
      victim: {
        victimId: "victim-1",
      },
    };
    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Intimidated" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(charge, victimList, true);
    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent("offence-code-1");
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "Theft description",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      "Date of Offence",
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent(
      "23 Mar 1990 to 26 Jun 1990",
    );
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Intimidated");
  });

  it("shows correct values for the victim charge fields, when offenceToDate is not provided", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "",
      addVictimRadio: "yes",
      victim: { victimId: "victim-1" },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(charge, victimList, true);

    renderRows(rows);
    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent("offence-code-1");
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent(
      "Theft description",
    );
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent(
      "Date of Offence",
    );
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("23 Mar 1990");
    expect(screen.getByTestId(`row-2-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-2-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-2-value`)).not.toHaveTextContent(
      "Intimidated",
    );
  });

  it("should not show the charge row if its turned off using the second parameter", () => {
    const charge: ChargesFormData = {
      chargeId: "charge-1",
      offenceSearchText: "theft",
      selectedOffence: {
        code: "offence-code-1",
        description: "Theft description",
        legislation: "Theft Act 1968",
        effectiveFromDate: "20-03-1990",
        effectiveToDate: "20-06-1990",
        modeOfTrial: "abc",
      },

      offenceFromDate: "1990-03-23",
      offenceToDate: "",
      addVictimRadio: "yes",
      victim: { victimId: "victim-1" },
    };

    const victimList = [
      {
        victimId: "victim-1",
        victimFirstNameText: "John",
        victimLastNameText: "Doe",
        victimAdditionalDetailsCheckboxes: [
          "Vulnerable" as const,
          "Witness" as const,
        ],
      },
    ];

    const rows = getChargesSummaryListRows(charge, victimList, false);

    renderRows(rows);

    expect(screen.getByTestId(`row-0-key`)).toHaveTextContent(
      "Date of Offence",
    );
    expect(screen.getByTestId(`row-0-value`)).toHaveTextContent("23 Mar 1990");
    expect(screen.getByTestId(`row-1-key`)).toHaveTextContent("Victim");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("DOE, John");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Vulnerable");
    expect(screen.getByTestId(`row-1-value`)).toHaveTextContent("Witness");
    expect(screen.getByTestId(`row-1-value`)).not.toHaveTextContent(
      "Intimidated",
    );
  });
});
