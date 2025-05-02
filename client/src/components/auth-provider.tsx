import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { MoonLoader } from "react-spinners";

type User = {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
};

type UserAuth = {
  isAuth: boolean;
  user: User | null;
  setUser: (user: User) => void;
  setIsAuth: (isLoggedIn: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<UserAuth>({
  isAuth: false,
  user: null,
  setUser: () => {},
  setIsAuth: () => {},
  logout: () => {},
});

export const checkAuth = async () => {
  try {
    const res = await api.get("/user/me");
    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error("Not authenticated");
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cookies, , removeCookie] = useCookies();
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (cookies.access_token) {
        try {
          const userData = await checkAuth();
          setUser(userData);
          setIsAuth(true);
        } catch (error) {
          console.error("Authentication verification failed:", error);
          setUser(null);
          setIsAuth(false);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [cookies.access_token, removeCookie]);

  const logout = async () => {
    setUser(null);
    setIsAuth(false);
    removeCookie("access_token", { path: "/" });
  };

  const authContextValue = {
    isAuth,
    user,
    setUser,
    setIsAuth,
    logout,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <MoonLoader />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
