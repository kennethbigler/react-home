import { streamRegEx } from "../v2/AnnouncementEngine";

// Fully pure, fully testable - Returns a stream/observable of announcement strings
export async function* announceFromTokenStream(
  tokenStream: AsyncIterable<string>,
): AsyncIterable<string> {
  let buffer = "";

  // v1 (no debounce), announce and display are together
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
