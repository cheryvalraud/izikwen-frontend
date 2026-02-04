import * as SecureStore from "expo-secure-store";

const KEY = "izikwen_device_id";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEY);
  if (existing) return existing;

  const id = uuid();
  await SecureStore.setItemAsync(KEY, id);
  return id;
}
export async function clearDeviceId() {
  await SecureStore.deleteItemAsync(KEY);
}