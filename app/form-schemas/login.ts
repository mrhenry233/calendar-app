import { z } from "zod";

export const LoginFormSchema = z.object({
  username_email: z.union([
    z.string().min(2, { message: "Username or email are required" }).trim(),
    z.string().email({ message: "Please enter a valid email" }).trim()
  ]),
  password: z.string().min(1, { message: "Password is required" }).trim()
});