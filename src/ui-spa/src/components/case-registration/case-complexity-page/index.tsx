import { BackLink } from "../../../components/govuk";

const CaseComplexityPage = () => {
  return (
    <div>
      <BackLink
        to="/case-registration/first-hearing"
        replace
        state={{ isRouteValid: true }}
      >
        Back
      </BackLink>
      <h1>Case Complexity</h1>
    </div>
  );
};

export default CaseComplexityPage;
