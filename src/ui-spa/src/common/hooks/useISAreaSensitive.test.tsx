import { renderHook } from "@testing-library/react";
import { useISAreaSensitive } from "./useIsAreaSensitive";
import { CaseRegistrationFormContext } from "../../common/providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../reducers/caseRegistrationReducer";

describe("useISAreaSensitive", () => {
  it("returns true if areaIsSensitive is true", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CaseRegistrationFormContext.Provider
        value={{
          state: {
            apiData: {
              areasAndRegisteringUnits: {
                homeUnit: {
                  areaIsSensitive: true,
                },
              },
            },
          } as CaseRegistrationState,
          dispatch: () => {},
        }}
      >
        {children}
      </CaseRegistrationFormContext.Provider>
    );

    const { result } = renderHook(() => useISAreaSensitive(), { wrapper });
    expect(result.current).toBe(true);
  });

  it("returns false if areaIsSensitive is false", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CaseRegistrationFormContext.Provider
        value={{
          state: {
            apiData: {
              areasAndRegisteringUnits: {
                homeUnit: { areaIsSensitive: false },
              },
            },
          } as CaseRegistrationState,
          dispatch: () => {},
        }}
      >
        {children}
      </CaseRegistrationFormContext.Provider>
    );

    const { result } = renderHook(() => useISAreaSensitive(), { wrapper });
    expect(result.current).toBe(false);
  });

  it("returns undefined if homeUnit or areasAndRegisteringUnits is missing", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CaseRegistrationFormContext.Provider
        value={{
          state: { apiData: {} } as CaseRegistrationState,
          dispatch: () => {},
        }}
      >
        {children}
      </CaseRegistrationFormContext.Provider>
    );

    const { result } = renderHook(() => useISAreaSensitive(), { wrapper });
    expect(result.current).toBeUndefined();
  });
});
