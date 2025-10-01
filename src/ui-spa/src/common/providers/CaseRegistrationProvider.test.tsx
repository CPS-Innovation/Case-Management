import { render, screen, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import {
  CaseRegistrationFormContext,
  CaseRegistrationProvider,
} from "./CaseRegistrationProvider";

describe("CaseRegistrationProvider", () => {
  it("provides initial state to children", () => {
    const TestComponent = () => {
      const { state } = useContext(CaseRegistrationFormContext);
      return (
        <div>
          <span data-testid="currentPage">{state.currentPage}</span>
          <span data-testid="operationNameRadio">
            {state.operationNameRadio}
          </span>
          <span data-testid="suspectDetailsRadio">
            {state.suspectDetailsRadio}
          </span>
          <span data-testid="operationNameText">{state.operationNameText}</span>
        </div>
      );
    };

    render(
      <CaseRegistrationProvider>
        <TestComponent />
      </CaseRegistrationProvider>,
    );

    expect(screen.getByTestId("currentPage").textContent).toBe(
      "case-registration",
    );
    expect(screen.getByTestId("operationNameRadio").textContent).toBe("");
    expect(screen.getByTestId("suspectDetailsRadio").textContent).toBe("");
    expect(screen.getByTestId("operationNameText").textContent).toBe("");
  });

  it("updates state when dispatch is called", () => {
    const TestComponent = () => {
      const { state, dispatch } = useContext(CaseRegistrationFormContext);
      return (
        <div>
          <button
            onClick={() =>
              dispatch({
                type: "SET_FIELD",
                payload: { field: "operationNameRadio", value: "yes" },
              })
            }
          >
            Set Operation Name Radio
          </button>
          <span data-testid="operationNameRadio">
            {state.operationNameRadio}
          </span>
        </div>
      );
    };

    render(
      <CaseRegistrationProvider>
        <TestComponent />
      </CaseRegistrationProvider>,
    );

    expect(screen.getByTestId("operationNameRadio").textContent).toBe("");
    fireEvent.click(screen.getByText("Set Operation Name Radio"));
    expect(screen.getByTestId("operationNameRadio").textContent).toBe("yes");
  });
});
