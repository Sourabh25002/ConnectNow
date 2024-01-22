import { Router, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

// Retrieve secret keys and token expiry durations from environment variables
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const accessExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY;

// Define the structure of the JWT payload
interface TokenPayload {
  user_id: number;
  email_address: string;
}

// Function to generate an access token based on the provided payload
function generateAccessToken(payload: TokenPayload): string {
  return sign(payload, accessSecret!, { expiresIn: accessExpiry });
}

// Function to generate a refresh token based on the provided payload
function generateRefreshToken(payload: TokenPayload): string {
  return sign(payload, refreshSecret!, { expiresIn: refreshExpiry });
}

// Function to verify a token using the provided secret key
function verifyToken(token: string, secret: string): TokenPayload | null {
  try {
    // Verify the token and cast the decoded result to the TokenPayload type
    const decoded = verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    // If verification fails, return null
    return null;
  }
}

// Export the functions for external use
export { generateAccessToken, generateRefreshToken, verifyToken };
