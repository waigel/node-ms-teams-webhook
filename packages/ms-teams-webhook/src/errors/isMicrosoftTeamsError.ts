import type { MicrosoftTeamsError } from "./MicrosoftTeamsError";

export function isMicrosoftTeamsError(
  payload: any,
): payload is MicrosoftTeamsError {
  return (
    payload !== null &&
    typeof payload === "object" &&
    payload?.isMicrosoftTeamsError === true
  );
}
