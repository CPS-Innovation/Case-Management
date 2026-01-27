const NAME_MAX_LENGTH = 50;
export const sanitizeNameText = (input: string): string => {
  // remove any character that is not any unicode letter, hyphens, full stops, dashes, spaces and apostrophes
  const cleaned = input.replaceAll(/[^\p{L}.'\s-]/gu, "");
  return cleaned.slice(0, NAME_MAX_LENGTH);
};
