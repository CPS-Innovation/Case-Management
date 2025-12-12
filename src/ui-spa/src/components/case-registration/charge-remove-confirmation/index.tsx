import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import pageStyles from "./index.module.scss";

const ChargeRemoveConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { suspectIndex, chargeIndex, backRoute },
  }: {
    state: { suspectIndex: number; chargeIndex: number; backRoute: string };
  } = useLocation();
  const { dispatch } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({
      type: "REMOVE_SUSPECT_CHARGE",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
      },
    });

    return navigate(backRoute);
  };

  return (
    <div className={pageStyles.chargeRemoveConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>

      <form onSubmit={handleSubmit}>
        <h1>Are you sure you want to remove this charge?</h1>
        <div className={pageStyles.summaryListWrapper}>
          <div>
            <p>
              This will permanently remove all the details you&apos;ve entered.
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

export default ChargeRemoveConfirmationPage;
