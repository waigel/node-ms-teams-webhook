import { describe, expect, it } from "vitest";
import MicrosoftTeamsError from "./MicrosoftTeamsError";
import { isMicrosoftTeamsError } from "./isMicrosoftTeamsError";

describe("isMicrosoftTeamsError", () => {
  it("should return true if the error is created by core::createError", function () {
    expect(
      isMicrosoftTeamsError(new MicrosoftTeamsError("Boom!", "ERR_BOOM")),
    ).toBe(true);
  });

  it("should return true if the error is enhanced by core::enhanceError", function () {
    expect(
      isMicrosoftTeamsError(
        MicrosoftTeamsError.from(new Error("Boom!"), "ERR_BOOM"),
      ),
    ).toBe(true);
  });

  it("should return false if the error is a normal Error instance", function () {
    expect(isMicrosoftTeamsError(new Error("Boom!"))).toBe(false);
  });

  it("should return false if the error is null", function () {
    expect(isMicrosoftTeamsError(null)).toBe(false);
  });
});
