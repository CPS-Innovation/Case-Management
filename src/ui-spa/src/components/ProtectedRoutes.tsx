import { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  useEffect(() => {
    return () => {
      globalThis.history.replaceState({}, "");
    };
  }, []);
  const location = useLocation();
  const isAllowed = location.state?.isRouteValid;
  return isAllowed ? <Outlet /> : <Navigate to="/case-registration" replace />;
};

export default ProtectedRoutes;
