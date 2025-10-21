export type Role = 'admin' | 'staff' | 'viewer';

export function canViewAdmin(role: Role | undefined) {
  return role === 'admin';
}

export function canWriteConversations(role: Role | undefined) {
  return role === 'admin' || role === 'staff';
}

export function canReadOnly(role: Role | undefined) {
  return role === 'viewer';
}
