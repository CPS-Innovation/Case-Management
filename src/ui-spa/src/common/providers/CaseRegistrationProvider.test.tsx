import { render, screen, fireEvent } from "@testing-library/react";
import { useContext } from "react";
import {
  CaseRegistrationFormContext,
  CaseRegistrationProvider,
} from "./CaseRegistrationProvider";

describe("CaseRegistrationProvider", () => {
  it("provides initial state to children", () => {
    const TestComponent = () => {
      const {
        state: { formData },
      } = useContext(CaseRegistrationFormContext);
      return (
        <div>
          <span data-testid="operationNameRadio">
            {formData.operationNameRadio}
          </span>
          <span data-testid="suspectDetailsRadio">
            {formData.suspectDetailsRadio}
          </span>
          <span data-testid="operationNameText">
            {formData.operationNameText}
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
    expect(screen.getByTestId("suspectDetailsRadio").textContent).toBe("");
    expect(screen.getByTestId("operationNameText").textContent).toBe("");
  });

  it("updates state when dispatch is called", () => {
    const TestComponent = () => {
      const {
        state: { formData },
        dispatch,
      } = useContext(CaseRegistrationFormContext);
      return (
        <div>
          <button
            onClick={() =>
              dispatch({
                type: "SET_FIELDS",
                payload: {
                  data: {
                    operationNameRadio: "yes",
                  },
                },
              })
            }
          >
            Set Operation Name Radio
          </button>
          <span data-testid="operationNameRadio">
            {formData.operationNameRadio}
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
