"use client";
import { useEffect, useRef } from "react";
import twemoji from "twemoji";

const Twemoji = ({ emoji }: { emoji: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      twemoji.parse(ref.current, {
        folder: "svg",
        ext: ".svg",
      });
    }
  }, [emoji]);

  return <span ref={ref}>{emoji}</span>;
};

export default Twemoji;
