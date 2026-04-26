import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  subscribeToAuth,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
} from "../lib/supabase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = subscribeToAuth((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Toggle this to true to enable dummy login for testing
  const useDummyLogin = false;

  const signIn = async (email, password) => {
    if (useDummyLogin) {
      // Dummy login: accept any email/password
      const dummyUser = { id: "dummy-id", email };
      setUser(dummyUser);
      return { user: dummyUser, session: null };
    } else {
      const data = await supabaseSignIn(email, password);
      setUser(data.user);
      return data;
    }
  };

  const logout = async () => {
    await supabaseSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
