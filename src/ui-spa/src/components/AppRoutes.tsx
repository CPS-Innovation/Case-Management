import { Routes, Route, Navigate } from "react-router";
import CaseRegistrationPage from "./case-registration";
import CaseAreasPage from "./case-registration/case-areas-page";
import CaseDetailsPage from "./case-registration//case-details-page";
import FirstHearingPage from "./case-registration/first-hearing-page";
import CaseComplexityPage from "./case-registration/case-complexity-page";
import CaseMonitoringCodesPage from "./case-registration/case-monitoring-codes";
import CaseAssigneePage from "./case-registration/case-assignee";
import CaseSummaryPage from "./case-registration/case-summary-page";
import CaseRegistrationConfirmationPage from "./case-registration/case-registartion-confirmation";
import AddSuspectPage from "./case-registration/add-suspect";
import SuspectDOBPage from "./case-registration/suspect-dob";
import SuspectGenderPage from "./case-registration/suspect-gender";
import SuspectEthnicityPage from "./case-registration/suspect-ethnicity";
import SuspectReligionPage from "./case-registration/suspect-religion";
import SuspectDisabilityPage from "./case-registration/suspect-disability";
import SuspectSDOPage from "./case-registration/suspect-sdo";
import SuspectASNPage from "./case-registration/suspect-asn";
import SuspectOffenderPage from "./case-registration/suspect-offender";
import SuspectAliasesPage from "./case-registration/suspect-aliases";
import SuspectAliasesSummaryPage from "./case-registration/suspect-aliases-summary";
import SuspectSummaryPage from "./case-registration/suspect-summary";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/case-registration" element={<CaseRegistrationPage />} />
      <Route element={<ProtectedRoutes />}>
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
          path="/case-registration/case-monitoring-codes"
          element={<CaseMonitoringCodesPage />}
        />
        <Route
          path="/case-registration/case-assignee"
          element={<CaseAssigneePage />}
        />
        <Route
          path="/case-registration/case-summary"
          element={<CaseSummaryPage />}
        />
        <Route
          path="/case-registration/case-registration-confirmation"
          element={<CaseRegistrationConfirmationPage />}
        />
        <Route
          path="/case-registration/:suspectId/add-suspect"
          element={<AddSuspectPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-dob"
          element={<SuspectDOBPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-gender"
          element={<SuspectGenderPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-ethnicity"
          element={<SuspectEthnicityPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-religion"
          element={<SuspectReligionPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-disability"
          element={<SuspectDisabilityPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-sdo"
          element={<SuspectSDOPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-asn"
          element={<SuspectASNPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-offender"
          element={<SuspectOffenderPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-add-aliases"
          element={<SuspectAliasesPage />}
        />
        <Route
          path="/case-registration/:suspectId/suspect-aliases-summary"
          element={<SuspectAliasesSummaryPage />}
        />
        <Route
          path="/case-registration/suspect-summary"
          element={<SuspectSummaryPage />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/case-registration" replace />} />
    </Routes>
  );
};

export default AppRoutes;
