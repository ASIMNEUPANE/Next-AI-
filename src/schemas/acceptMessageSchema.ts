import { z } from "zod";

export const AccpetMessageSchema = z.object({
  accpetMessages: z.boolean(),
});
