export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be defined in production environment');
    }
    // Only use fallback in development
    console.warn('WARNING: Using default JWT_SECRET. This is not secure for production!');
    return 'dev-secret-key-change-in-production';
  }
  
  return secret;
}
