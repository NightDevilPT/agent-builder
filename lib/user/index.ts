import { prisma } from "@/lib/prisma";
import { User } from "@/generated/prisma";
import crypto from "crypto";
import { createUserRequest, updateUserRequest, UserResponse } from "./types";
import { ApiErrorCode } from "@/lib/api-service/api.types";

export type ServiceResult<T> = 
  | { success: true; data: T } 
  | { success: false; errorCode: ApiErrorCode };

/**
 * Encrypts a plaintext password using PBKDF2 with SHA-512.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Validates a plaintext password against a stored salt-hash pair.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  const salt = parts[0];
  const originalHash = parts[1];
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

class UserService {
  /**
   * Transforms raw database User model into the public UserResponse layout.
   */
  private formatUser(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Registers a new user. Returns a ServiceResult indicating success or validation error.
   */
  async createUser(data: createUserRequest): Promise<ServiceResult<UserResponse>> {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return { success: false, errorCode: ApiErrorCode.EMAIL_ALREADY_REGISTERED };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      return { success: false, errorCode: ApiErrorCode.USERNAME_ALREADY_TAKEN };
    }

    const passwordHash = hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        avatar: data.avatar || null,
      },
    });

    return { success: true, data: this.formatUser(user) };
  }

  /**
   * Updates an existing user's profile fields. Returns a ServiceResult indicating success or validation error.
   */
  async updateUser(userId: string, data: updateUserRequest): Promise<ServiceResult<UserResponse>> {
    const existingUserRecord = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!existingUserRecord) {
      return { success: false, errorCode: ApiErrorCode.USER_NOT_FOUND };
    }

    if (data.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: userId },
        },
      });
      if (existingUsername) {
        return { success: false, errorCode: ApiErrorCode.USERNAME_ALREADY_TAKEN };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
      },
    });

    return { success: true, data: this.formatUser(updatedUser) };
  }

  /**
   * Fetches user details by user UUID. Returns a ServiceResult indicating success or validation error.
   */
  async getUserById(userId: string): Promise<ServiceResult<UserResponse>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return { success: false, errorCode: ApiErrorCode.USER_NOT_FOUND };
    }
    return { success: true, data: this.formatUser(user) };
  }
}

export const userService = new UserService();
