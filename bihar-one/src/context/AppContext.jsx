import { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Save token + user
  const saveToken = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);

    if (userData?.role) {
      localStorage.setItem("role", userData.role);
    }
  };

  // Clear token
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // Load user profile if token exists
  useEffect(() => {
    if (token) {
      setLoading(true);

      const role = localStorage.getItem("role");
      const headers = { Authorization: `Bearer ${token}` };

      // Decide endpoint based on role
      let endpoint;
      if (role === "CITIZEN") {
        endpoint = `${backendUrl}/citizens/profile`;
      } else {
        endpoint = `${backendUrl}/officials/profile`;
      }

      axios
        .get(endpoint, { headers })
        .then((res) => {
          setUser(res.data);
          setUserProfile(res.data);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, [token, backendUrl]);

  const value = useMemo(
    () => ({
      backendUrl,
      token,
      user,
      loading,
      setToken,
      saveToken,
      logout,
      userProfile,
    }),
    [backendUrl, token, user, loading, userProfile]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
