import { Routes, Route, Navigate } from "react-router";
import CaseRegistrationPage from "./case-registration";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<CaseRegistrationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
