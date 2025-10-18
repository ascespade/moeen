export function canViewAdmin(role: string | undefined) {
  export type string = 'admin' | 'staff' | 'viewer';

  return role === 'admin';
}

export function canWriteConversations(role: string | undefined) {
  return role === 'admin' || role === 'staff';
}

export function canReadOnly(role: string | undefined) {
  return role === 'viewer';
}
