import { z } from "zod";
const schema = z.object({ name: z.string().min(2) });
const result = schema.safeParse({ name: "a" });
console.log(JSON.stringify(result, null, 2));
