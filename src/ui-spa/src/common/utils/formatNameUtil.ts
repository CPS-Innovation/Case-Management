export const formatNameUtil = (firstName: string, lastName: string) => {
  const formattedLastName = lastName.toUpperCase();
  const formattedFirstName =
    firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
  if (!firstName) {
    return formattedLastName;
  }
  if (!lastName) {
    return formattedFirstName;
  }
  return `${formattedLastName}, ${formattedFirstName}`;
};
