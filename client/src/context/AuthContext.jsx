import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "http://localhost:5001/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("connex_token"));
  const [loading, setLoading] = useState(true);

  // Keep axios Authorization header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("connex_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("connex_token");
    }
  }, [token]);

  // Load the current user on mount (or whenever token changes)
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/me`);
        setUser(res.data.data);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const register = async (userData) => {
    const res = await axios.post(`${API_BASE}/register`, userData);
    setToken(res.data.token);
    setUser(res.data.user);
    setLoading(false);
    return res.data;
  };

  const login = async (userData) => {
    const res = await axios.post(`${API_BASE}/login`, userData);
    setToken(res.data.token);
    setUser(res.data.user);
    setLoading(false);
    return res.data;
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
