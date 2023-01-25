import axios from "axios";
import fs from "fs/promises";
import { OverdubResponse } from "../types";
import { sleep } from "../utils";
require("dotenv").config();

async function convertTTSDescript(
  text: string,
  save_path: string
): Promise<void> {
  const overdub: OverdubResponse = await createOverdub(
    text,
    "6510c9b3-4ff0-4d09-8741-cca2c23e100f"
  ); //carla
  const audio_url = await pollGetOverdub(overdub.id);
  console.log(audio_url);
  const audio = await axios.get(audio_url, { responseType: "arraybuffer" });
  await fs.writeFile(save_path, audio.data);
}

async function createOverdub(
  text: string,
  voice_id: string
): Promise<OverdubResponse> {
  const response = await axios.post(
    `${process.env.HOROSCOPE_API_URL}:5500/overdub`,
    {
      text,
      voice_id,
    }
  );
  return response.data;
}

async function pollGetOverdub(id: string): Promise<string> {
  try {
    const response = await axios.get(
      `${process.env.HOROSCOPE_API_URL}:5500/overdub/${id}`
    );
    return response.data.url;
  } catch (error) {
    await sleep(2000);
    return pollGetOverdub(id);
  }
}

export default convertTTSDescript;
