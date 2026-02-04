import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "izikwen_access_token";
const REFRESH_KEY = "izikwen_refresh_token";
const BIOMETRIC_KEY = "izikwen_biometrics_enabled";

export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken?: string) {
    if (accessToken) await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    if (refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  },

  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_KEY, token);
  },

  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_KEY);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_KEY);
  },

  async removeTokens() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },

  async clearAll() {
    await this.removeTokens();
  
    // await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
  },

  async getBiometricsEnabled(): Promise<boolean> {
    const v = await SecureStore.getItemAsync(BIOMETRIC_KEY);
    return v === "true";
  },

  async setBiometricsEnabled(v: boolean) {
    await SecureStore.setItemAsync(BIOMETRIC_KEY, v ? "true" : "false");
  },
};
