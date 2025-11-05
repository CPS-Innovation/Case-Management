import { useContext, useMemo } from "react";
import { Panel } from "../../govuk";
import { CaseRegistrationFormContext } from "../../../common/providers/CaseRegistrationProvider";
import styles from "./index.module.scss";
const CaseRegistrationConfirmationPage = () => {
  const {
    state: { formData },
  } = useContext(CaseRegistrationFormContext);
  const urn = useMemo(
    () =>
      `${formData.urnPoliceForceText}${formData.urnPoliceUnitText}${formData.urnUniqueReferenceText}/${formData.urnYearReferenceText}`,
    [formData],
  );
  return (
    <div className={styles.caseRegistrationConfirmationPage}>
      <Panel titleChildren="Case registered successfully">
        <div className={styles.urnData}>
          <span className={styles.urnLabel}>URN</span>
          <span className={styles.urnValue}>{urn}</span>
        </div>
      </Panel>
      <h2>Next steps</h2>
      <p>You can continue to view or edit the case details.</p>
      <p>
        For large and complex cases, you can now set up folders for materials.
      </p>
    </div>
  );
};
export default CaseRegistrationConfirmationPage;
