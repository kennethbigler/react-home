import { useEffect, useState } from "react";
import { announceFromTokenStream } from "./AnnouncementEngine";
import mockTokenStream from "../stream-helpers/mockTokenStream";
import starWarsIntros from "../stream-helpers/starWarsIntros";
import { Button, Typography } from "@mui/material";

const StreamExample = () => {
  const [streamContent, setStreamContent] = useState("");
  const [announcement, setAnnouncement] = useState("");
  // used to start/stop stream
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!isStreaming) return;
    let cancelled = false;

    async function runStream() {
      try {
        // run engine on mock tokens coming in
        for await (const token of announceFromTokenStream(
          mockTokenStream(starWarsIntros),
        )) {
          if (cancelled) return;
          // visually update UI each time a token is received
          setStreamContent((prev) => prev + token);
          // and announce to SR
          setAnnouncement("");
          requestAnimationFrame(() => setAnnouncement(token));
        }
        // The "Done" Signal
        if (!cancelled) {
          setAnnouncement("Response complete");
        }
      } finally {
        // re-enable button
        if (!cancelled) {
          setIsStreaming(false);
        }
      }
    }

    void runStream();
    // ensure stream doesn't continue to update on close
    return () => {
      cancelled = true;
    };
  }, [isStreaming]);

  const handleStart = () => {
    setStreamContent("");
    setAnnouncement("");
    setIsStreaming(true);
  };

  return (
    <div>
      <Button onClick={handleStart} disabled={isStreaming}>
        {isStreaming ? "Streaming…" : "Start stream"}
      </Button>
      <Typography sx={{ whiteSpace: "pre-line" }}>{streamContent}</Typography>
      <p className="sr-only" role="status" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
};

export default StreamExample;
