import React, { useContext, useEffect, useState } from "react";

import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

import { appContext } from "context/app-context";

const ThemeToggler = (props) => {
  const { systemTheme, theme: nextTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleTheme } = useContext(appContext);
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = nextTheme === "system" ? systemTheme : nextTheme;

  if (!mounted) return <button type="button" className="w-[24px] h-[24px]"></button>;

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-[24px] h-[24px] text-yellow-500 dark:text-blue-600 "
      onClick={() => {
        setTheme(currentTheme === "dark" ? "light" : "dark");
        toggleTheme();
      }}
    >
      {currentTheme === "dark" ? (
        <FontAwesomeIcon className="text-[24px]" icon={faMoon} />
      ) : (
        <FontAwesomeIcon className="text-[24px]" icon={faSun} />
      )}
    </button>
  );
};

export default ThemeToggler;
