import { createContext, useContext, useEffect, useState } from "react";

// -------------------- localStorage helper --------------------
export function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      if (v === null || v === undefined) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

export function clearLocalStorage(key) {
  try { window.localStorage.removeItem(key); } catch {}
}

// -------------------- User result context --------------------
const ClarityContext = createContext(null);

export function ClarityProvider({ children }) {
  // Completed results (persisted so priority pages can read them)
  const [creditResult, setCreditResult] = useLocalStorage("clarity_credit_result", null);
  const [creditAnswers, setCreditAnswers] = useLocalStorage("clarity_credit_answers", null);
  const [investResult, setInvestResult] = useLocalStorage("clarity_invest_result", null);
  const [investAnswers, setInvestAnswers] = useLocalStorage("clarity_invest_answers", null);

  const clearCredit = () => {
    setCreditResult(null); setCreditAnswers(null);
    clearLocalStorage("clarity_credit_result");
    clearLocalStorage("clarity_credit_answers");
  };
  const clearInvest = () => {
    setInvestResult(null); setInvestAnswers(null);
    clearLocalStorage("clarity_invest_result");
    clearLocalStorage("clarity_invest_answers");
  };

  return (
    <ClarityContext.Provider value={{
      creditResult, setCreditResult, creditAnswers, setCreditAnswers, clearCredit,
      investResult, setInvestResult, investAnswers, setInvestAnswers, clearInvest,
    }}>
      {children}
    </ClarityContext.Provider>
  );
}

export const useClarity = () => useContext(ClarityContext);
