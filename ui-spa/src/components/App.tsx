import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";
import { BrowserRouter } from "react-router";
import AutoComplete from "./common/AutoComplete";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
        <div>
          <h1>Create a Case</h1>
          <AutoComplete
            options={[
              { id: "1", value: "Option 1" },
              { id: "2", value: "Option 2" },
              { id: "3", value: "Option 3" },
            ]}
            onInputChange={(value) => console.log("Selected:", value)}
          />
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
