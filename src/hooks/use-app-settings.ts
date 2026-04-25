import { useEffect, useState } from "react";
import { getAppSettings, subscribeAppSettings, type AppSettings } from "@/lib/app-settings";

export function useAppSettings(): AppSettings {
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  useEffect(() => {
    setSettings(getAppSettings());
    return subscribeAppSettings(setSettings);
  }, []);
  return settings;
}
