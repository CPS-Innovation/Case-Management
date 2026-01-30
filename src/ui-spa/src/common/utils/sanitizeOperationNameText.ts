const OPERATION_NAME_MAX_LENGTH = 50;
export const sanitizeOperationNameText = (input: string): string => {
  return input.slice(0, OPERATION_NAME_MAX_LENGTH);
};
