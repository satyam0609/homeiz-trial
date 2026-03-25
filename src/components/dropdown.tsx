"use client";

import React, { useEffect, useRef, useState } from "react";

type DropdownItem =
  | {
      type?: "item";
      label: string;
      icon?: React.ReactNode;
      shortcut?: string;
      destructive?: boolean;
      disabled?: boolean;
      onClick?: () => void;
    }
  | { type: "separator" }
  | { type: "label"; label: string };

type DropdownProps = {
  trigger: React.ReactNode;
  items: DropdownItem[];
  side?: "left" | "right";
  label?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  side = "right",
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      // Tiny delay so the animation plays on mount
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open]);

  const alignmentClass = side === "left" ? "left-0" : "right-0";

  return (
    <>
      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: scale(0.95) translateY(-4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .dropdown-menu {
          animation: dropdown-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 13.5px;
          line-height: 1.4;
          color: #09090b;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.1s ease, color 0.1s ease;
          position: relative;
          font-family: inherit;
          letter-spacing: -0.01em;
        }
        .dropdown-item:hover:not(:disabled) {
          background: #f4f4f5;
        }
        .dropdown-item:focus-visible {
          outline: 2px solid #18181b;
          outline-offset: -2px;
        }
        .dropdown-item:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          pointer-events: none;
        }
        .dropdown-item.destructive {
          color: #dc2626;
        }
        .dropdown-item.destructive:hover {
          background: #fef2f2;
          color: #b91c1c;
        }
        .dropdown-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: #71717a;
        }
        .dropdown-item.destructive .dropdown-item-icon {
          color: #dc2626;
        }
        .dropdown-item-label {
          flex: 1;
        }
        .dropdown-item-shortcut {
          margin-left: auto;
          font-size: 11px;
          color: #a1a1aa;
          letter-spacing: 0.04em;
          padding-left: 12px;
        }
        .dropdown-separator {
          height: 1px;
          background: #f4f4f5;
          margin: 4px -4px;
        }
        .dropdown-group-label {
          padding: 4px 8px 2px;
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          user-select: none;
        }
      `}</style>

      <div className="relative inline-block" ref={ref}>
        <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

        {open && (
          <div
            className={`dropdown-menu absolute mt-1.5 min-w-32 ${alignmentClass}`}
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
              padding: "4px",
              zIndex: 50,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            {label && <div className="dropdown-group-label">{label}</div>}

            {items.map((item, index) => {
              if (item.type === "separator") {
                return <div key={index} className="dropdown-separator" />;
              }

              if (item.type === "label") {
                return (
                  <div key={index} className="dropdown-group-label">
                    {item.label}
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  disabled={item.disabled}
                  className={`dropdown-item${item.destructive ? " destructive" : ""}`}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                >
                  {item.icon && (
                    <span className="dropdown-item-icon">{item.icon}</span>
                  )}
                  <span className="dropdown-item-label">{item.label}</span>
                  {item.shortcut && (
                    <span className="dropdown-item-shortcut">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Dropdown;
