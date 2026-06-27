import jwt from "jsonwebtoken";
import { config } from "@/config";

export interface TokenPayload {
  userId: string;
  email: string;
}

class JwtService {
  /**
   * Generates a pair of access and refresh tokens for a user.
   * 
   * @param payload The token payload content containing user details.
   */
  generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiry as jwt.SignOptions["expiresIn"],
    });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry as jwt.SignOptions["expiresIn"],
    });
    return { accessToken, refreshToken };
  }

  /**
   * Decodes and validates an access token.
   * 
   * @param token The raw access token string.
   * @returns The decoded token payload.
   * @throws Error if token is invalid or expired.
   */
  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  }

  /**
   * Decodes and validates a refresh token.
   * 
   * @param token The raw refresh token string.
   * @returns The decoded token payload.
   * @throws Error if token is invalid or expired.
   */
  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  }
}

export const jwtService = new JwtService();
