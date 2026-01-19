import { useContext } from "react";
import { Button, BackLink } from "../../govuk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import { type VictimAdditionalDetailsValue } from "../../../common/reducers/caseRegistrationReducer";
import { formatNameUtil } from "../../../common/utils/formatNameUtil";
import { v4 as uuidv4 } from "uuid";
import pageStyles from "./index.module.scss";

const ChargesVictimDuplicateConfirmationPage = () => {
  const navigate = useNavigate();
  const {
    state: {
      suspectIndex,
      chargeIndex,
      victimFirstName,
      victimLastName,
      victimAdditionalDetailsCheckboxes,
      backRoute,
    },
  }: {
    state: {
      suspectIndex: number;
      chargeIndex: number;
      victimFirstName: string;
      victimLastName: string;
      victimAdditionalDetailsCheckboxes: VictimAdditionalDetailsValue[];
      backRoute: string;
    };
  } = useLocation();
  const { dispatch, state } = useContext(CaseRegistrationFormContext);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newVictim = {
      victimId: uuidv4(),
      victimFirstNameText: victimFirstName,
      victimLastNameText: victimLastName,
      victimAdditionalDetailsCheckboxes: victimAdditionalDetailsCheckboxes,
    };
    dispatch({
      type: "SET_CHARGE_FIELDS",
      payload: {
        suspectIndex: suspectIndex,
        chargeIndex: chargeIndex,
        data: {
          victim: {
            ...newVictim,
          },
        },
      },
    });

    dispatch({
      type: "SET_FIELDS",
      payload: {
        data: {
          victimsList: [
            ...state.formData.victimsList,
            {
              ...newVictim,
            },
          ],
        },
      },
    });

    return navigate("/case-registration/charges-summary");
  };

  return (
    <div className={pageStyles.chargesVictimDuplicateConfirmationPage}>
      <BackLink to={backRoute}>Back</BackLink>

      <form onSubmit={handleSubmit}>
        <h1>Check the victim name</h1>

        <div>
          <p>
            This victim <b>{formatNameUtil(victimFirstName, victimLastName)}</b>{" "}
            has already been added.
          </p>

          <p>
            Save and continue if this is a different person, or cancel to go
            back and check the details.
          </p>
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

export default ChargesVictimDuplicateConfirmationPage;
