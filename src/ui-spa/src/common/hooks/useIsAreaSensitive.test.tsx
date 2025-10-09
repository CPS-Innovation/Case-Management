import { renderHook } from "@testing-library/react";
import { useIsAreaSensitive } from "./useIsAreaSensitive";
import { CaseRegistrationFormContext } from "../providers/CaseRegistrationProvider";
import { type CaseRegistrationState } from "../reducers/caseRegistrationReducer";

describe("useIsAreaSensitive", () => {
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

    const { result } = renderHook(() => useIsAreaSensitive(), { wrapper });
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

    const { result } = renderHook(() => useIsAreaSensitive(), { wrapper });
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

    const { result } = renderHook(() => useIsAreaSensitive(), { wrapper });
    expect(result.current).toBeUndefined();
  });
});
