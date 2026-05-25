import { useEffect, useState } from "react";

export type Lang = "en" | "id";
const KEY = "zanscode.lang";
const EVENT = "zanscode:lang";

function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

/** Reactive language hook. Re-renders when the language changes anywhere. */
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    setLang(readLang());
    const sync = () => setLang(readLang());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT, sync);
    };
  }, []);
  return lang;
}

/** Persist + broadcast a new language. */
export function setLang(l: Lang) {
  try {
    window.localStorage.setItem(KEY, l);
    document.documentElement.lang = l;
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

/** Pick value by language with English fallback. */
export function pick<T>(lang: Lang, en: T, id: T): T {
  return lang === "id" ? id : en;
}
