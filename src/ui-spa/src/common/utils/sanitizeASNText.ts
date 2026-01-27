const ASN_MAX_LENGTH = 30;
export const sanitizeASNText = (input: string): string => {
  // remove any character that not letter or number
  const cleaned = input.replaceAll(/[^a-z0-9]/gi, "");
  return cleaned.slice(0, ASN_MAX_LENGTH);
};
