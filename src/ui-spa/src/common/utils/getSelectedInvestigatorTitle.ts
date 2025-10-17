export const getSelectedInvestigatorTitle = (
  titles: { shortCode: string; description: string }[],
  inputValue: string,
): { shortCode: string | null; description: string } => {
  const matchedTitle = titles.find((title) => title.description === inputValue);
  if (matchedTitle) {
    return {
      shortCode: matchedTitle.shortCode,
      description: matchedTitle.description,
    };
  }
  return { shortCode: null, description: inputValue };
};
