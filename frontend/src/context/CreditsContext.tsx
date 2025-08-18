import React, { createContext, useContext, useState, useCallback } from "react";

interface Credits {
  daily_credits_remaining?: number;
  monthly_credits_remaining?: number;
  topup_credits_remaining?: number;
  subscription_type?: string;
}

interface CreditsContextType {
  credits: Credits | null;
  refreshCredits: () => Promise<void>;
}

export const CreditsContext = createContext<CreditsContextType>({
  credits: null,
  refreshCredits: async () => {},
});

export const CreditsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<Credits | null>(null);

  const refreshCredits = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("https://api-gw-production.up.railway.app/api/user/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCredits(data);
    } catch {}
  }, []);

  React.useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  return (
    <CreditsContext.Provider value={{ credits, refreshCredits }}>
      {children}
    </CreditsContext.Provider>
  );
};

