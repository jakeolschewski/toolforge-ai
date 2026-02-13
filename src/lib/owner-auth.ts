// Owner Authentication Helper
// Centralizes owner password verification for all owner API routes

const OWNER_PASSWORD = '1992Ja';

/**
 * Check if a password matches the owner password.
 * Accepts the hardcoded password OR the OWNER_PASSWORD env var.
 */
export function isValidOwnerPassword(password: string): boolean {
  if (password === OWNER_PASSWORD) return true;
  const envPassword = process.env.OWNER_PASSWORD;
  if (envPassword && password === envPassword) return true;
  return false;
}

/**
 * Verify owner auth from a Bearer token in the request Authorization header.
 * Used by all owner API routes.
 */
export function verifyOwnerAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  return isValidOwnerPassword(token);
}

/**
 * Check if a token is the owner's token (for vault bypass).
 * The owner gets full access to all site features for free.
 */
export function isOwnerToken(token: string): boolean {
  return isValidOwnerPassword(token);
}
