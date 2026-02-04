import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import { api } from "../service/api";
import { tokenStorage } from "../utils/tokenStorage";
import { getDeviceId } from "../utils/deviceId";

type LoginResult =
  | { requires2FA: true; twoFaToken: string }
  | { requires2FA: false; accessToken: string; refreshToken?: string };

interface AuthContextType {
  authState: {
    authenticated: boolean;
    user: any | null;
  };
  onRegister: (email: string, password: string) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<LoginResult>;
  onVerify2FA: (code: string, twoFaToken: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onLogoutAll: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    user: null as any | null,
  });

  const loadingRef = useRef(false);

  // Load user on app start
  useEffect(() => {
    (async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        const token = await tokenStorage.getAccessToken();
        if (!token) {
          setAuthState({ authenticated: false, user: null });
          return;
        }

    
        const meRes = await api.get("/me");
        setAuthState({ authenticated: true, user: meRes.data });
      } catch {
        await tokenStorage.clearAll();
        setAuthState({ authenticated: false, user: null });
      } finally {
        loadingRef.current = false;
      }
    })();
  }, []);

  const onRegister = async (email: string, password: string) => {
    await api.post("/auth/register", { email, password });
  };

  const onLogin = async (email: string, password: string): Promise<LoginResult> => {
    const deviceId = await getDeviceId();

    const res = await api.post("/auth/login", {
      email,
      password,
      deviceId,
    });

    // Backend returns:
    // { accessToken, refreshToken, requires2FA, twoFaToken }
    if (res.data?.requires2FA) {
      return { requires2FA: true, twoFaToken: res.data.twoFaToken as string };
    }

    const accessToken = res.data?.accessToken as string;
    const refreshToken = res.data?.refreshToken as string | undefined;

    await tokenStorage.setTokens(accessToken, refreshToken);

    // Load user
    const meRes = await api.get("/me");
    setAuthState({ authenticated: true, user: meRes.data });

    return { requires2FA: false, accessToken, refreshToken };
  };

  const onVerify2FA = async (code: string, twoFaToken: string) => {
    const deviceId = await getDeviceId();

    const res = await api.post(
      "/auth/2fa/verify",
      {
        code,
        deviceId,
        deviceName: Device.deviceName ?? "Device",
        platform: (Device.osName ?? "unknown").toLowerCase(),
      },
      { headers: { Authorization: `Bearer ${twoFaToken}` } }
    );

    const accessToken = res.data?.accessToken as string;
    const refreshToken = res.data?.refreshToken as string | undefined;

    await tokenStorage.setTokens(accessToken, refreshToken);

    const meRes = await api.get("/me");
    setAuthState({ authenticated: true, user: meRes.data });
  };

  const onLogout = async () => {
    await tokenStorage.clearAll();
    setAuthState({ authenticated: false, user: null });
  };

  const onLogoutAll = async () => {
    // backend increments tokenVersion and revokes all tokens
    await api.post("/auth/logout-all");
    await tokenStorage.clearAll();
    setAuthState({ authenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, onRegister, onLogin, onVerify2FA, onLogout, onLogoutAll }}>
      {children}
    </AuthContext.Provider>
  );
};
