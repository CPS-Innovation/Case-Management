export const getSelectedInvestigatorTitle = (
  titles: { shortCode: string; display: string }[],
  inputValue: string,
): { shortCode: string | null; display: string } => {
  const matchedTitle = titles.find((title) => title.shortCode === inputValue);
  if (matchedTitle) {
    return {
      shortCode: matchedTitle.shortCode,
      display: matchedTitle.display,
    };
  }
  return { shortCode: null, display: inputValue };
};
