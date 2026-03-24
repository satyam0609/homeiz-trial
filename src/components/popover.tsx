"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

const ReactionPopover = ({ trigger, children }: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {/* Picker */}
      {open && <div className="absolute left-0 -top-14 z-50">{children}</div>}
    </div>
  );
};

export default ReactionPopover;
