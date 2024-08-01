/**
 * Error class for MicrosoftTeams errors.
 */

export class MicrosoftTeamsError extends Error {
  public code?: string;
  public description?: string;
  public number?: number;
  public fileName?: string;
  public lineNumber?: number;
  public columnNumber?: number;
  public config?: any;
  public response?: any;

  constructor(message?: string, code?: string) {
    super(message);
    this.name = "MicrosoftTeamsError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }

  toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      code: this.code,
      status:
        this.response && this.response.status ? this.response.status : null,
    };
  }

  static from(error: any, code?: string) {
    return new MicrosoftTeamsError(error.message, code);
  }
}

Object.defineProperty(MicrosoftTeamsError.prototype, "isMicrosoftTeamsError", {
  value: true,
});

export default MicrosoftTeamsError;
