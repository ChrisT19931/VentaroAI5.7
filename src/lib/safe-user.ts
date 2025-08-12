/**
 * Type-safe utility functions for handling user objects
 * Prevents 'user is possibly undefined' TypeScript errors
 */

export function getUserIdOrNull(user: { id?: string } | null | undefined): string | null {
  return typeof user?.id === 'string' && user.id.length > 0 ? user.id : null;
}

export function getUserEmailOrNull(user: { email?: string } | null | undefined): string | null {
  return typeof user?.email === 'string' && user.email.length > 0 ? user.email : null;
}

export function getUserNameOrNull(user: { name?: string } | null | undefined): string | null {
  return typeof user?.name === 'string' && user.name.length > 0 ? user.name : null;
}

export function isUserValid(user: { id?: string; email?: string } | null | undefined): user is { id: string; email: string } {
  return !!(user?.id && user?.email && typeof user.id === 'string' && typeof user.email === 'string');
}