import axios, { AxiosInstance, AxiosResponse } from "axios";
import { showWebhookUrlDeprecatedWarning } from "./util/url-deprecated-warning";

export interface IncomingWebhookResult {
  text: string;
}

/**
 * A client for Teams's Incoming Webhooks
 */

interface Payload {
  [key: string]: any;
}
export class IncomingWebhook {
  /**
   * The webhook URL
   */
  private url: string;

  /**
   * Axios HTTP client instance used by this client
   */
  private axios: AxiosInstance;

  constructor(url: string) {
    if (url === undefined) {
      throw new Error("Incoming webhook URL is required");
    }
    // Show console warning, if URL is deprecated
    showWebhookUrlDeprecatedWarning(url);

    this.url = url;

    this.axios = axios.create({
      baseURL: url,
      maxRedirects: 0,
      proxy: false,
    });
  }
  /**
   * Send a notification to a conversation
   * @param message the message (object describing the message)
   */
  public async send(
    message: Payload,
  ): Promise<IncomingWebhookResult | undefined> {
    // NOTE: no support for TLS config
    let payload = message;

    if (typeof payload === "string") {
      throw new Error(
        "Message must be a JSON object. Dont use a string or JSON.stringify() your message",
      );
    }

    try {
      const response = await this.axios.post(this.url, payload);

      return this.buildResult(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processes an HTTP response into an IncomingWebhookResult.
   */
  private buildResult(response: AxiosResponse): IncomingWebhookResult {
    return {
      text: response.data,
    };
  }
}
