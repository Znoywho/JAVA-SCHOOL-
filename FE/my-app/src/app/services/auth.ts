const BASE_URL = 'http://localhost:8080/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'BUYER' | 'SELLER' | 'INSPECTOR' | 'SHIPPER' | 'ADMIN';
}

const STORAGE_KEY = 'rebike_user';

/**
 * Login — calls POST /api/users/login
 */
export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Đăng nhập thất bại');
  }

  const user: AuthUser = json.data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
  return user;
}

/**
 * Logout — clear stored user
 */
export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('auth-change'));
}

/**
 * Get current logged-in user (from localStorage)
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function isSeller(): boolean {
  const user = getCurrentUser();
  return user?.role === 'SELLER';
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
}

export function isShipper(): boolean {
  const user = getCurrentUser();
  return user?.role === 'SHIPPER';
}
