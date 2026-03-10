import { Outlet, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { CaseRegistrationFormContext } from "../common/providers/CaseRegistrationProvider";
const ProtectedRoutes = () => {
  const { state } = useContext(CaseRegistrationFormContext);
  useEffect(() => {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("caseRegistration", serializedState);
    const sizeInBytes = new Blob([serializedState]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    console.log("Saved state size:", sizeInMB, "MB");
  }, [state]);

  const isAllowed =
    state.formData.suspectDetailsRadio &&
    state.apiData.areasAndRegisteringUnits;
  return isAllowed ? <Outlet /> : <Navigate to="/case-registration" replace />;
};

export default ProtectedRoutes;
