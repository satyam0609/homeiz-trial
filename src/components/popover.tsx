// "use client";
// import React, { useEffect, useRef, useState } from "react";

// type Props = {
//   trigger: React.ReactNode;
//   children: React.ReactNode;
// };

// const ReactionPopover = ({ trigger, children }: Props) => {
//   const [open, setOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   // ✅ Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!containerRef.current?.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={containerRef}>
//       {/* Trigger */}
//       <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

//       {/* Picker */}
//       {open && <div className="absolute left-0 -top-14 z-50">{children}</div>}
//     </div>
//   );
// };

// export default ReactionPopover;

// "use client";
// import React, { useRef, useState, useCallback } from "react";

// type Props = {
//   trigger: React.ReactNode;
//   children: React.ReactNode;
// };

// const ReactionPopover = ({ trigger, children }: Props) => {
//   const [open, setOpen] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const openPopover = useCallback(() => {
//     if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
//     setClosing(false);
//     setOpen(true);
//   }, []);

//   const closePopover = useCallback(() => {
//     setClosing(true);
//     closeTimeoutRef.current = setTimeout(() => {
//       setOpen(false);
//       setClosing(false);
//     }, 150); // match animation duration
//   }, []);

//   // Click outside to close
//   React.useEffect(() => {
//     if (!open) return;
//     const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         closePopover();
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     document.addEventListener("touchstart", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//       document.removeEventListener("touchstart", handleOutsideClick);
//     };
//   }, [open, closePopover]);

//   // Desktop: hover
//   const handlePointerEnter = useCallback(
//     (e: React.PointerEvent) => {
//       if (e.pointerType === "touch") return; // ignore touch — handled by click
//       if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
//       openPopover();
//     },
//     [openPopover],
//   );

//   const handlePointerLeave = useCallback(
//     (e: React.PointerEvent) => {
//       if (e.pointerType === "touch") return;
//       hoverTimeoutRef.current = setTimeout(() => {
//         closePopover();
//       }, 120);
//     },
//     [closePopover],
//   );

//   // Mobile + desktop: click/tap toggle
//   const handleClick = useCallback(
//     (e: React.MouseEvent) => {
//       // On desktop, hover already opens it — clicks should close it
//       // On touch, clicks are the only trigger
//       if (open && !closing) {
//         closePopover();
//       } else {
//         openPopover();
//       }
//     },
//     [open, closing, openPopover, closePopover],
//   );

//   return (
//     <>
//       <style>{`
//         @keyframes popover-in {
//           from {
//             opacity: 0;
//             transform: scale(0.92) translateY(4px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
//         @keyframes popover-out {
//           from {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//           to {
//             opacity: 0;
//             transform: scale(0.92) translateY(4px);
//           }
//         }
//         .popover-enter {
//           animation: popover-in 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//         .popover-exit {
//           animation: popover-out 0.15s ease-in forwards;
//         }
//       `}</style>

//       <div
//         ref={containerRef}
//         className="relative inline-block"
//         onPointerEnter={handlePointerEnter}
//         onPointerLeave={handlePointerLeave}
//       >
//         {/* Trigger */}
//         <div
//           onClick={handleClick}
//           style={{ WebkitTapHighlightColor: "transparent" }}
//         >
//           {trigger}
//         </div>

//         {/* Invisible hover bridge — fills gap between trigger and popover */}
//         {open && (
//           <div
//             className="absolute left-0 w-full"
//             style={{ bottom: "100%", height: "12px" }}
//           />
//         )}

//         {/* Popover */}
//         {open && (
//           <div
//             className={`absolute left-0 z-50 ${closing ? "popover-exit" : "popover-enter"}`}
//             style={{
//               bottom: "calc(100% + 8px)",
//               transformOrigin: "bottom left",
//             }}
//           >
//             {children}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ReactionPopover;

"use client";
import React, { useRef, useState, useCallback } from "react";

const LONG_PRESS_DURATION = 500;

type Props = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onTap?: () => void;
};

const ReactionPopover = ({ trigger, children, onTap }: Props) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Tracks whether the long press threshold was reached for this touch
  const longPressTriggeredRef = useRef(false);
  // Tracks touch start position to cancel on scroll/drag
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const openPopover = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setClosing(false);
    setOpen(true);
  }, []);

  const closePopover = useCallback(() => {
    setClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 150);
  }, []);

  // Click outside to close
  React.useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open, closePopover]);

  // ── Desktop: hover ──────────────────────────────────────────────────────────
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      openPopover();
    },
    [openPopover],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      hoverTimeoutRef.current = setTimeout(() => {
        closePopover();
      }, 120);
    },
    [closePopover],
  );

  // ── Desktop: click fires onTap (hover already handles open/close) ───────────
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Skip clicks synthesised from a touch event (handled below)
      if ((e.nativeEvent as PointerEvent).pointerType === "touch") return;
      console.log("single tap");
      onTap?.();
    },
    [onTap],
  );

  // ── Touch: long-press → open popover  |  short tap → onTap ─────────────────
  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      longPressTriggeredRef.current = false;
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };

      longPressTimerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        console.log("long tap");
        openPopover();
      }, LONG_PRESS_DURATION);
    },
    [openPopover],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartPos.current) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
      const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
      // Cancel long press if the finger has moved > 10px (scroll intent)
      if (dx > 10 || dy > 10) cancelLongPress();
    },
    [cancelLongPress],
  );

  const handleTouchEnd = useCallback(() => {
    cancelLongPress();
    if (!longPressTriggeredRef.current) {
      console.log("single tap");
      onTap?.();
    }
    touchStartPos.current = null;
  }, [cancelLongPress, onTap]);

  return (
    <>
      <style>{`
        @keyframes popover-in {
          from { opacity: 0; transform: scale(0.92) translateY(4px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        @keyframes popover-out {
          from { opacity: 1; transform: scale(1)    translateY(0);   }
          to   { opacity: 0; transform: scale(0.92) translateY(4px); }
        }
        .popover-enter { animation: popover-in  0.15s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .popover-exit  { animation: popover-out 0.15s ease-in forwards; }
      `}</style>

      <div
        ref={containerRef}
        className="relative inline-block"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Trigger */}
        <div
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={(e) => e.preventDefault()} // suppress native long-press menu on mobile
          style={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
        >
          {trigger}
        </div>

        {/* Invisible hover bridge — prevents flicker crossing the gap */}
        {open && (
          <div
            className="absolute left-0 w-full"
            style={{ bottom: "100%", height: "12px" }}
          />
        )}

        {/* Popover */}
        {open && (
          <div
            className={`absolute left-0 z-50 ${closing ? "popover-exit" : "popover-enter"}`}
            style={{
              bottom: "calc(100% + 8px)",
              transformOrigin: "bottom left",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default ReactionPopover;
