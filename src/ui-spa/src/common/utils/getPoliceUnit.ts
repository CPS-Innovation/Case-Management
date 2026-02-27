import { type PoliceUnits } from "../../schemas";
export const getPoliceUnit = (
  urnPoliceUnitText: string,
  policeUnits: PoliceUnits,
) => {
  const policeUnit = policeUnits.find(
    (unit) => unit.code === urnPoliceUnitText,
  );
  return policeUnit;
};
