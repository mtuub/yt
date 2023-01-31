import axios from "axios";
import fs from "fs/promises";
import { getUserAgent } from "../utils";

async function convertTTS(text: string, save_path: string): Promise<void> {
  const data = {
    text,
    voice: "en-US-CoraNeural",
  };
  const headers = {
    "user-agent": getUserAgent(),
    referer: "https://www.veed.io/",
  };
  const response = await axios.post(
    `https://www.veed.io/api/v1/subtitles/synthesize`,
    data,
    { headers }
  );
  const audio = await axios.get(response.data.data.synthesisResult.audioURL, {
    headers,
    responseType: "arraybuffer",
  });
  await fs.writeFile(save_path, audio.data);
}

export default convertTTS;
