export const UE_MINUTES = 45;

export function minutesToUE(minutes) {
  return (minutes / UE_MINUTES).toFixed(1);
}

export function ueLabel(minutes) {
  return `${minutesToUE(minutes)} UE`;
}
