const { exec } = require("child_process");
import fs from "fs/promises";
import axios from "axios";
import { TrimToSentenceData } from "./types";

export function trimToSentence(
  text: string,
  start_sentence: number,
  character_limit: number
): TrimToSentenceData {
  const sentences = text.split(/(?<=[.!?])/);

  let trimmed_text = "";
  let sentence_count = 0;

  for (let idx = start_sentence; idx < sentences.length; idx++) {
    const sentence = sentences[idx];
    if (trimmed_text.length + sentence.length > character_limit) break;

    trimmed_text += sentence;
    sentence_count++;
  }

  return {
    text: trimmed_text,
    sentence_count,
  };
}

export async function increaseAudioVolume(
  input_path: string,
  output_path: string,
  threshold: number
): Promise<void> {
  await exec(
    `ffmpeg -y -i ${input_path} -af "volume=${threshold}" ${output_path}`
  );
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function downloadFile({
  file_url,
  save_path,
}: {
  file_url: string;
  save_path: string;
}) {
  const response = await axios.get(file_url, {
    responseType: "arraybuffer",
  });
  await fs.writeFile(save_path, response.data);
}
