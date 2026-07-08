import { streamRegEx } from "../v2/AnnouncementEngine";

// Fully pure, fully testable
class AnnouncementEngine {
  // Returns a stream/observable of announcement strings
  async *process(tokenStream: AsyncIterable<string>): AsyncIterable<string> {
    let buffer = "";

    // v1 (no debounce)
    for await (const token of tokenStream) {
      buffer += token;
      if (streamRegEx.test(buffer)) {
        yield buffer;
        buffer = "";
      }
    }

    // ensure the last portion of tokens are provided if not on a clean boundary
    if (buffer.length > 0) {
      yield buffer;
    }
  }
}

export default AnnouncementEngine;
