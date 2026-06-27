import { z } from "zod";
import { createUserSchema, updateUserSchema } from "./validation";

// Request parameters derived from validation schemas
export type createUserRequest = z.infer<typeof createUserSchema>;
export type updateUserRequest = z.infer<typeof updateUserSchema>;

// Strongly-typed response payload interface
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}
