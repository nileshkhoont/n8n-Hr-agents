import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const linkBase =
  "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground";

export const NavBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-card-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <nav className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <a href="/" aria-label="Candidate Suite home" className="inline-flex items-center gap-3">
            <img src="/movya-logo.svg" alt="Movya logo" className="h-8 w-auto object-contain" />
            <span className="text-base font-semibold text-foreground"></span>
          </a>
        </div>
        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-surface-hover"
              )
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/manage"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-surface-hover"
              )
            }
          >
            Manage Candidates
          </NavLink>
          <NavLink
            to="/linkedin"
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-surface-hover"
              )
            }
          >
            LinkedIn
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
