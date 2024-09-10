import { localStorageKeys } from "../localStorage/keys";

export function getStoredToken(): string | null {
  return localStorage.getItem(localStorageKeys.token);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(localStorageKeys.token, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(localStorageKeys.token);
}
