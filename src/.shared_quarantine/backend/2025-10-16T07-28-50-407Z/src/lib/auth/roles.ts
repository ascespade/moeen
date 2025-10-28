export type Role = "admin" | "staff" | "viewer";

export function __canViewAdmin(_role: Role | undefined) {
  return role === "admin";
}

export function __canWriteConversations(_role: Role | undefined) {
  return role === "admin" || role === "staff";
}

export function __canReadOnly(_role: Role | undefined) {
  return role === "viewer";
}
