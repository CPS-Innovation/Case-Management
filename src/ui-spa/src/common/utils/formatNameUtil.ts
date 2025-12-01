export const formatNameUtil = (firstName: string, lastName: string) => {
  const formattedLastName = lastName.toUpperCase();
  if (!firstName) {
    return formattedLastName;
  }
  if (!lastName) {
    return firstName;
  }
  return `${formattedLastName}, ${firstName}`;
};
