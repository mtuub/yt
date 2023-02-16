import fs from "fs/promises";
import convertTTS from "./services/tts";
import { Horoscope } from "./types";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_horoscope = horoscopes.find((h) => h.sign === sign);

  const save_dir = "output/audios";
  try {
    await fs.mkdir(save_dir, { recursive: true });
  } catch (error) {}

  await convertTTS(
    sign_horoscope.horoscope,
    `${save_dir}/${sign_horoscope.sign}.mp3`
  );
  console.log(`Generated audio for ${sign_horoscope.sign}`);
})();
