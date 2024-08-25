//create zod schema for the object

import { z } from "zod";
export const APIRequestSchema = z.object({
  json: z.string(),
  instructions: z.string(),
});
export type APIRequest = z.infer<typeof APIRequestSchema>;
