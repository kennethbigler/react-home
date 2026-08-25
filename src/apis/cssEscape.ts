/** Minimal CSSOM-compatible CSS.escape for jsdom test environments. */
export const cssEscape = (value: string): string => {
  const { length } = value;
  let index = 0;
  let result = "";

  while (index < length) {
    const codeUnit = value.charCodeAt(index);
    const char = value.charAt(index);
    const position = index;
    index += 1;

    if (codeUnit === 0x0000) {
      result += "\uFFFD";
      continue;
    }

    if ((codeUnit >= 0x0001 && codeUnit <= 0x001f) || codeUnit === 0x007f) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    if (position === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    if (
      position === 1 &&
      codeUnit >= 0x0030 &&
      codeUnit <= 0x0039 &&
      value.charCodeAt(0) === 0x002d
    ) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    if (codeUnit === 0x0020) {
      result += "\\ ";
      continue;
    }

    if (
      codeUnit >= 0x0080 ||
      codeUnit === 0x002d ||
      codeUnit === 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      result += char;
      continue;
    }

    result += `\\${codeUnit.toString(16)} `;
  }

  return result;
};
