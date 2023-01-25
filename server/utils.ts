const { exec } = require("child_process");

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

export async function increaseAudioVolume(
  input_path: string,
  output_path: string,
  threshold: number
): Promise<void> {
  try {
    await exec(
      `ffmpeg -y -i ${input_path} -af "volume=${threshold}" ${output_path}`
    );
  } catch (error) {
    console.error(`exec error: ${error}`);
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
