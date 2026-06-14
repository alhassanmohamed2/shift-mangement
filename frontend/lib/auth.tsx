'use client';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';

export interface DecodedToken {
    sub: string;
    role: 'admin' | 'member';
    exp: number;
}

interface AuthContextType {
    user: DecodedToken | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.exp * 1000 < Date.now()) {
                    Cookies.remove('token');
                    setUser(null);
                    if (pathname !== '/login') router.push('/login');
                } else {
                    setUser(decoded);
                }
            } catch (e) {
                Cookies.remove('token');
                if (pathname !== '/login') router.push('/login');
            }
        } else {
            if (pathname !== '/login') router.push('/login');
        }
        setLoading(false);
    }, [pathname, router]);

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
