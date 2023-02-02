export function splitTextToSentences(text: string): string[] {
  return text.split(/(?<=[.!?])/);
}

export function splitStringToWord(str: string, maxLength: number): string[] {
  const subStrings: string[] = [];
  let start = 0;
  while (start < str.length) {
    let end = start + maxLength;
    if (end >= str.length) {
      end = str.length;
      subStrings.push(str.slice(start, end));
      break;
    }
    let sliced = str.slice(start, end);
    let lastSpace = sliced.lastIndexOf(" ");
    if (lastSpace !== -1) {
      end = start + lastSpace;
      sliced = str.slice(start, end);
    }
    subStrings.push(sliced);
    start = end + 1;
  }
  return subStrings;
}
