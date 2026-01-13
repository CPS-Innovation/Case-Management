import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import pageStyles from "./index.module.scss";

const ChangeAreaConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: { areaOrDivisionText },
  }: {
    state: {
      areaOrDivisionText?: {
        id: number | null;
        description: string;
      };
    };
  } = useLocation();
  const { dispatch, state } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          areaOrDivisionText,
        },
      },
    });

    return navigate("/case-registration/case-details");
  };

  return (
    <div className={pageStyles.changeAreaConfirmationPage}>
      <BackLink to={"/case-registration/case-areas"}>Back</BackLink>

      <form onSubmit={handleSubmit}>
        <h1>Changing the area means you must update other case details</h1>

        <div>
          <p>
            If you change the area, you will need to review and update other
            case details. This is because some information is linked to the
            area. You will need to check and update:
          </p>

          <ul>
            <li>the registering unit</li>
            {state.formData.firstHearingRadio && <li>first hearing details</li>}
            <li>who is working on the case</li>
          </ul>
          <p>
            You can continue to change the area now, or cancel to keep the
            current area.
          </p>
        </div>
        <div className={pageStyles.buttonWrapper}>
          <Button type="submit" onClick={() => handleSubmit}>
            Continue and change the area
          </Button>

          <Link to={"/case-registration/case-areas"}>Cancel</Link>
        </div>
      </form>
    </div>
  );
};

export default ChangeAreaConfirmationPage;
