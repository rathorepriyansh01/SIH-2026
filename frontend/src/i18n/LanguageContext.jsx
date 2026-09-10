import React, { createContext, useContext, useState } from "react";
import translations from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("language") || "en";
    } catch {
      return "en";
    }
  });

  const changeLanguage = (lang) => {
    if (lang !== "en" && lang !== "hi") {
      return;
    }

    setLanguage(lang);

    try {
      localStorage.setItem("language", lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const t = (key) => {
    const currentTranslations = translations[language] || translations.en;

    return (
      currentTranslations?.[key] ||
      translations.en?.[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}