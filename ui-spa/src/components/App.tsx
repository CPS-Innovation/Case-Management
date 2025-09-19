import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";
import { BrowserRouter } from "react-router";
import Layout from "./Layout";
import { Auth } from "../auth";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
        <Auth>
          <Layout>
            <AppRoutes />
          </Layout>
        </Auth>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
