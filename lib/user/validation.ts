import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100),
  firstName: z.string().max(50, "First name must be at most 50 characters long").optional().nullable(),
  lastName: z.string().max(50, "Last name must be at most 50 characters long").optional().nullable(),
  avatar: z.string().optional().nullable(),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores")
    .optional(),
  firstName: z.string().max(50, "First name must be at most 50 characters long").optional().nullable(),
  lastName: z.string().max(50, "Last name must be at most 50 characters long").optional().nullable(),
  avatar: z.string().optional().nullable(),
});
