import { BackLink } from "../../govuk";

import styles from "./index.module.scss";

const SuspectSummaryPage = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className={styles.caseSuspectSummaryPage}>
      <BackLink to={`/case-registration`}>Back</BackLink>

      <form onSubmit={handleSubmit}>
        <h1>Suspect Summary</h1>
        <div></div>
      </form>
    </div>
  );
};

export default SuspectSummaryPage;
