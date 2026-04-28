import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  { id: '1', email: 'investor@nexus.com', password: 'Demo@1234', name: 'Alex Morgan', role: 'investor', avatar: 'AM' },
  { id: '2', email: 'entrepreneur@nexus.com', password: 'Demo@1234', name: 'Sarah Chen', role: 'entrepreneur', avatar: 'SC' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('nexus_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('nexus_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const register = (email, password, name, role) => {
    const exists = DEMO_USERS.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already registered.' };
    const newUser = {
      id: Date.now().toString(),
      email, name, role,
      avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    DEMO_USERS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const updateRole = (role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('nexus_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
