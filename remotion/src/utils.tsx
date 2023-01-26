export function splitTextToSentences(text: string): string[] {
  return text.split(/(?<=[.!?])/);
}
