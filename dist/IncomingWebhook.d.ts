import { IncomingWebhookResult } from './types';
/**
 * A client for Slack's Incoming Webhooks
 */
export declare class IncomingWebhook {
    /**
     * The webhook URL
     */
    private url;
    /**
     * Axios HTTP client instance used by this client
     */
    private axios;
    constructor(url: string);
    /**
     * Send a notification to a conversation
     * @param message the message (a simple string, or an object describing the message)
     */
    send(message: string): Promise<IncomingWebhookResult | undefined>;
    /**
     * Processes an HTTP response into an IncomingWebhookResult.
     */
    private buildResult;
}
//# sourceMappingURL=IncomingWebhook.d.ts.map