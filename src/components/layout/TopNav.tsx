import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const NAV_LINKS = [{ to: "/", end: true, label: "Integrations" }];

export function TopNav() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial mode on client render
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !isDark;

    if (nextDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setIsDark(nextDark);
  };

  return (
    <nav className="top-nav">
      <div className="top-nav__inner">
        <button className="top-nav__logo" onClick={() => navigate("/")}>
          <div className="top-nav__logo-icon">
            <Icon icon="mdi:swap-horizontal" width={20} />
          </div>
          Sync Port
        </button>

        <div className="top-nav__links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `top-nav__link${isActive ? " top-nav__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="top-nav__right">
          <button
            className="top-nav__bell"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            <Icon
              icon={isDark ? "mdi:weather-night" : "mdi:weather-sunny"}
              width={20}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
