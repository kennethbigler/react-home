import React from "react";

const RED_SUITS = new Set(["♥", "♦"]);

/**
 * Splits a string on ♥/♦ and wraps those characters in a red <span>.
 * Returns plain string when no red suits are present (avoids React overhead).
 */
export function colorSuits(text: string): React.ReactNode {
  if (!text.includes("♥") && !text.includes("♦")) return text;

  const parts = text.split(/(♥|♦)/);
  return (
    <>
      {parts.map((part, i) =>
        RED_SUITS.has(part) ? (
          <span key={i} style={{ color: "#d32f2f" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}
