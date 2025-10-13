export const getSelectedUnit = (
  units: { id: number; description: string }[],
  inputValue: string,
): { id: number | null; description: string } => {
  const matchedUnit = units.find((unit) => unit.description === inputValue);
  if (matchedUnit) {
    return { id: matchedUnit.id, description: matchedUnit.description };
  }
  return { id: null, description: inputValue };
};
