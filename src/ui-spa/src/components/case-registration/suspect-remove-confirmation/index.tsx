import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import pageStyles from "./index.module.scss";

const SuspectRemoveConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { suspectId, backRoute },
  }: { state: { suspectId: string; backRoute: string } } = useLocation();
  const { state, dispatch } = useContext(CaseRegistrationFormContext);
  const {
    formData: { suspects },
  } = state;
  const selectedSuspect = suspects.find(
    (suspect) => suspect.suspectId === suspectId,
  );

  const { suspectFirstNameText = "", suspectLastNameText = "" } =
    selectedSuspect ?? {};

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch({
      type: "REMOVE_SUSPECT",
      payload: { suspectId },
    });

    return navigate(backRoute);
  };

  return (
    <div className={pageStyles.caseSuspectRemoveConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>

      <form onSubmit={handleSubmit}>
        <h1>
          {`Are you sure you want to remove ${formatNameUtil(suspectFirstNameText, suspectLastNameText)}?`}
        </h1>
        <div className={pageStyles.summaryListWrapper}>
          <div>
            <p>
              This will permanently remove all the details you&apos;ve entered
              including any linked charges.
            </p>
            <p>You will not be able to restore them.</p>
          </div>
        </div>
        <div className={pageStyles.buttonWrapper}>
          <Button type="submit" onClick={() => handleSubmit}>
            Save and Continue
          </Button>

          <Link to={backRoute}>Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default SuspectRemoveConfirmationPage;
