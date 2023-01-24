export function trimToSentence(text: string, character_limit: number): string {
  const sentences = text.split(/(?<=[.!?])/);

  let trimmed_text = "";

  for (let idx = 0; idx < sentences.length; idx++) {
    const sentence = sentences[idx];
    if (trimmed_text.length + sentence.length > character_limit) break;

    trimmed_text += sentence;
  }

  return trimmed_text;
}
