import { useState, useEffect, useRef } from "react";

function getStorageValue(key: string, defaultValue: any) {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = saved && JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
      // storing input name
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
};