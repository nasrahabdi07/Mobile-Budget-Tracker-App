import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Compat auth object

interface AuthContextType {
    user: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Compat API listener
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log("👤 Auth State:", user ? "Logged In" : "Logged Out");
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
