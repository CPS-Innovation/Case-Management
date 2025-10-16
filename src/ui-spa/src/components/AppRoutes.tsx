import { Routes, Route, Navigate } from "react-router";
import CaseRegistrationPage from "./case-registration";
import CaseAreasPage from "./case-registration/case-areas-page";
import CaseDetailsPage from "./case-registration//case-details-page";
import FirstHearingPage from "./case-registration/first-hearing-page";
import CaseComplexityPage from "./case-registration/case-complexity-page";
import CaseMonitoringCodesPage from "./case-registration/case-monitoring-codes";
import CaseAssigneePage from "./case-registration/case-assignee";

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
      <Route
        path="/case-registration/first-hearing"
        element={<FirstHearingPage />}
      />
      <Route
        path="/case-registration/case-complexity"
        element={<CaseComplexityPage />}
      />
      <Route
        path="/case-registration/case-complexity"
        element={<CaseComplexityPage />}
      />
      <Route
        path="/case-registration/case-monitoring-codes"
        element={<CaseMonitoringCodesPage />}
      />
      <Route
        path="/case-registration/case-assignee"
        element={<CaseAssigneePage />}
      />

      <Route path="*" element={<Navigate to="/case-registration" replace />} />
    </Routes>
  );
};

export default AppRoutes;
