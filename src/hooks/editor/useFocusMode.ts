import { useState, useEffect } from "react";

export function useFocusMode() {
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("focusMode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("focusMode", String(focusMode));
  }, [focusMode]);

  return { focusMode, setFocusMode };
}
