"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomingWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * A client for Slack's Incoming Webhooks
 */
class IncomingWebhook {
    constructor(url) {
        if (url === undefined) {
            throw new Error('Incoming webhook URL is required');
        }
        this.url = url;
        this.axios = axios_1.default.create({
            baseURL: url,
            maxRedirects: 0,
            proxy: false
        });
    }
    /**
     * Send a notification to a conversation
     * @param message the message (a simple string, or an object describing the message)
     */
    async send(message) {
        // NOTE: no support for TLS config
        let payload = message;
        try {
            const response = await this.axios.post(this.url, payload);
            return this.buildResult(response);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Processes an HTTP response into an IncomingWebhookResult.
     */
    buildResult(response) {
        return {
            text: response.data,
        };
    }
}
exports.IncomingWebhook = IncomingWebhook;
//# sourceMappingURL=IncomingWebhook.js.map