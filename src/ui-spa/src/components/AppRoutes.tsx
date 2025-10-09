import { Routes, Route, Navigate } from "react-router";
import CaseRegistrationPage from "./case-registration";
import CaseAreasPage from "./case-registration/case-areas-page";
import CaseDetailsPage from "./case-registration//case-details-page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<CaseRegistrationPage />} />
      <Route path="/case-registration" element={<CaseRegistrationPage />} />
      <Route path="/case-registration/areas" element={<CaseAreasPage />} />
      <Route
        path="/case-registration/case-details"
        element={<CaseDetailsPage />}
      />
      <Route path="*" element={<Navigate to="/case-registration" replace />} />
    </Routes>
  );
};

export default AppRoutes;
