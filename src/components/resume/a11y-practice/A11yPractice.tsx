import { useEffect, useState } from "react";
import AnnouncementEngine from "./AnnouncementEngine";
import mockTokenStream from "./mockTokenStream";
import starWarsIntros from "./starWarsIntros";
import { Button, Typography } from "@mui/material";

const A11yPractice = () => {
  const [streamContent, setStreamContent] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!isStreaming) return;

    let cancelled = false;

    async function runStream() {
      try {
        // initiate engine
        const engine = new AnnouncementEngine({
          debounceMs: 500,
          flushOnSentenceBoundary: true,
        });

        // run engine on mock tokens coming in
        for await (const event of engine.process(
          mockTokenStream(starWarsIntros),
        )) {
          if (cancelled) return;
          // visually update UI each time a token is received
          if (event.type === "token") {
            setStreamContent((prev) => prev + event.value);
          } else {
            // audibly update SR user on sentence boundaries or debounce time
            setAnnouncement("");
            requestAnimationFrame(() => setAnnouncement(event.value));
          }
        }

        // The "Done" Signal
        // One often-overlooked thing: when streaming completes, the user should get a clear signal.
        // Something like a polite announcement of "Response complete" or a focus shift to the response lets AT users know they can now navigate and explore the full text.
        // Without it, they're left wondering if more is coming.
        if (!cancelled) {
          setAnnouncement("Response complete");
        }
      } finally {
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
      <Typography variant="h2" component="h1">
        A11y Practice
      </Typography>
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

export default A11yPractice;
