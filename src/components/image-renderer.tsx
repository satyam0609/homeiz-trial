"use client";
import { useState } from "react";

const ImageRenderer = ({ src }: { src?: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-4 w-full relative">
      {!loaded && (
        <div className="w-full h-75 bg-gray-200 animate-pulse rounded-md" />
      )}

      {src && (
        <img
          src={src}
          alt="post"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`w-full h-auto object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
          }`}
        />
      )}
    </div>
  );
};

export default ImageRenderer;
